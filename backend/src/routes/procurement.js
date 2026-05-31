const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { authenticate, authorize } = require('../middleware/auth');

// ===== PURCHASE REQUESTS =====
router.get('/pr', authenticate, async (req, res) => {
  try {
    const [prs] = await db.query(`
      SELECT pr.*, u.name AS created_by_name, 
        mr.date_needed, p.name AS project_name,
        ua.name AS approved_by_name
      FROM purchase_requests pr
      JOIN users u ON pr.created_by = u.id
      LEFT JOIN material_requests mr ON pr.mr_id = mr.id
      LEFT JOIN projects p ON mr.project_id = p.id
      LEFT JOIN users ua ON pr.approved_by = ua.id
      ORDER BY pr.created_at DESC
    `);

    if (prs.length > 0) {
      const prIds = prs.map(p => p.id);
      const [items] = await db.query(`
        SELECT pri.*, m.name AS material_name, m.unit
        FROM pr_items pri JOIN materials m ON pri.material_id = m.id
        WHERE pri.pr_id IN (?)
      `, [prIds]);

      const [canvass] = await db.query(`
        SELECT ce.*, s.name AS supplier_name
        FROM canvass_entries ce JOIN suppliers s ON ce.supplier_id = s.id
        WHERE ce.pr_id IN (?)
      `, [prIds]);

      prs.forEach(pr => {
        pr.items = items.filter(i => i.pr_id === pr.id);
        pr.canvass = canvass.filter(c => c.pr_id === pr.id);
      });
    }

    res.json(prs);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.get('/pr/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pr.*, u.name AS created_by_name, mr.date_needed, p.name AS project_name
      FROM purchase_requests pr
      JOIN users u ON pr.created_by = u.id
      LEFT JOIN material_requests mr ON pr.mr_id = mr.id
      LEFT JOIN projects p ON mr.project_id = p.id
      WHERE pr.id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'PR not found.' });
    const [items] = await db.query(`
      SELECT pri.*, m.name AS material_name, m.unit
      FROM pr_items pri JOIN materials m ON pri.material_id = m.id
      WHERE pri.pr_id = ?
    `, [req.params.id]);
    const [canvass] = await db.query(`
      SELECT ce.*, s.name AS supplier_name
      FROM canvass_entries ce JOIN suppliers s ON ce.supplier_id = s.id
      WHERE ce.pr_id = ?
    `, [req.params.id]);
    res.json({ ...rows[0], items, canvass });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Create PR (Procurement Officer)
// Accepts: mr_id (optional), notes, items[]
router.post('/pr', authenticate, authorize('Administrator', 'Procurement Officer'), async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { mr_id, notes, items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required.' });
    }
    const [prResult] = await conn.query(
      'INSERT INTO purchase_requests (mr_id, created_by, notes) VALUES (?, ?, ?)',
      [mr_id || null, req.user.id, notes || null]
    );
    const prId = prResult.insertId;
    for (const item of items) {
      await conn.query(
        'INSERT INTO pr_items (pr_id, material_id, quantity, estimated_unit_cost) VALUES (?, ?, ?, ?)',
        [prId, item.material_id, item.quantity, item.estimated_unit_cost || 0]
      );
    }
    await conn.commit();
    res.status(201).json({ message: 'Purchase Request created.', prId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error.', error: err.message });
  } finally {
    conn.release();
  }
});

// Approve or Reject PR (Project Manager / Administrator)
router.put('/pr/:id/approve', authenticate, authorize('Administrator', 'Project Manager'), async (req, res) => {
  try {
    const { action, reason } = req.body;
    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action must be "approve" or "reject".' });
    }
    if (action === 'reject' && !reason) {
      return res.status(400).json({ message: 'Rejection reason is required.' });
    }
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    await db.query(
      'UPDATE purchase_requests SET status=?, approved_by=?, rejection_reason=? WHERE id=?',
      [newStatus, req.user.id, reason || null, req.params.id]
    );
    res.json({ message: `PR ${newStatus}.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// ===== CANVASS =====
// Accept canvass for PRs with status 'approved' OR 'ready_for_po'
router.post('/canvass', authenticate, authorize('Administrator', 'Procurement Officer'), async (req, res) => {
  try {
    const { pr_id, supplier_id, material_id, unit_price, delivery_days, notes } = req.body;
    const [prRows] = await db.query('SELECT status FROM purchase_requests WHERE id = ?', [pr_id]);
    if (prRows.length === 0) {
      return res.status(404).json({ message: 'PR not found.' });
    }
    if (!['approved', 'ready_for_po'].includes(prRows[0].status)) {
      return res.status(400).json({ message: 'Canvass entries can only be added to approved PRs.' });
    }
    const [result] = await db.query(
      'INSERT INTO canvass_entries (pr_id, supplier_id, material_id, unit_price, delivery_days, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [pr_id, supplier_id, material_id, unit_price, delivery_days, notes]
    );
    res.status(201).json({ message: 'Canvass entry added.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.put('/canvass/:id/select', authenticate, authorize('Administrator', 'Procurement Officer'), async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [entry] = await conn.query('SELECT pr_id, material_id FROM canvass_entries WHERE id = ?', [req.params.id]);
    if (entry.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Canvass entry not found.' });
    }

    // Reset selection for this material in this PR, then select this entry
    await conn.query(
      'UPDATE canvass_entries SET is_selected=0 WHERE pr_id=? AND material_id=?',
      [entry[0].pr_id, entry[0].material_id]
    );
    await conn.query('UPDATE canvass_entries SET is_selected=1 WHERE id=?', [req.params.id]);

    // Check if every PR item now has a selected canvass entry
    const [prItems] = await conn.query('SELECT material_id FROM pr_items WHERE pr_id = ?', [entry[0].pr_id]);
    const [selectedItems] = await conn.query(
      'SELECT DISTINCT material_id FROM canvass_entries WHERE pr_id = ? AND is_selected = 1',
      [entry[0].pr_id]
    );

    const allCanvassed = prItems.every(prItem =>
      selectedItems.some(s => s.material_id === prItem.material_id)
    );

    if (allCanvassed) {
      await conn.query(
        'UPDATE purchase_requests SET status = ? WHERE id = ?',
        ['ready_for_po', entry[0].pr_id]
      );
    }

    await conn.commit();
    res.json({ message: 'Supplier selected.', readyForPo: allCanvassed });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error.', error: err.message });
  } finally {
    conn.release();
  }
});

// ===== PURCHASE ORDERS =====
router.get('/po', authenticate, async (req, res) => {
  try {
    const [pos] = await db.query(`
      SELECT po.*, s.name AS supplier_name, u.name AS created_by_name,
        us.name AS signed_by_name
      FROM purchase_orders po
      JOIN suppliers s ON po.supplier_id = s.id
      JOIN users u ON po.created_by = u.id
      LEFT JOIN users us ON po.signed_by = us.id
      ORDER BY po.created_at DESC
    `);
    res.json(pos);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.get('/po/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT po.*, s.name AS supplier_name, s.contact_info, s.email AS supplier_email,
        u.name AS created_by_name, us.name AS signed_by_name
      FROM purchase_orders po
      JOIN suppliers s ON po.supplier_id = s.id
      JOIN users u ON po.created_by = u.id
      LEFT JOIN users us ON po.signed_by = us.id
      WHERE po.id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'PO not found.' });
    const [items] = await db.query(`
      SELECT poi.*, m.name AS material_name, m.unit
      FROM po_items poi JOIN materials m ON poi.material_id = m.id
      WHERE poi.po_id = ?
    `, [req.params.id]);
    res.json({ ...rows[0], items });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Create PO (Procurement Officer or Administrator)
router.post('/po', authenticate, authorize('Administrator', 'Project Manager', 'Procurement Officer'), async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { pr_id, supplier_id, items, expected_delivery_date, notes } = req.body;
    if (!pr_id || !supplier_id || !items || items.length === 0) {
      return res.status(400).json({ message: 'PR, supplier, and items are required.' });
    }
    const [prRows] = await conn.query('SELECT status FROM purchase_requests WHERE id = ?', [pr_id]);
    if (prRows.length === 0 || !['approved', 'ready_for_po'].includes(prRows[0].status)) {
      return res.status(400).json({ message: 'PR must be approved or ready for PO before creating a PO.' });
    }
    const totalCost = items.reduce((sum, i) => sum + (parseFloat(i.quantity) * parseFloat(i.unit_price)), 0);
    const [poResult] = await conn.query(
      'INSERT INTO purchase_orders (pr_id, supplier_id, created_by, total_cost, expected_delivery_date, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [pr_id, supplier_id, req.user.id, totalCost, expected_delivery_date, notes, 'pending']
    );
    const poId = poResult.insertId;
    for (const item of items) {
      await conn.query(
        'INSERT INTO po_items (po_id, material_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [poId, item.material_id, item.quantity, item.unit_price]
      );
    }
    await conn.commit();
    res.status(201).json({ message: 'Purchase Order created. Pending manager signature.', poId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error.', error: err.message });
  } finally {
    conn.release();
  }
});

// Sign PO — Project Manager or Administrator signs a pending PO
router.put('/po/:id/sign', authenticate, authorize('Administrator', 'Project Manager'), async (req, res) => {
  try {
    const [poRows] = await db.query('SELECT status FROM purchase_orders WHERE id = ?', [req.params.id]);
    if (poRows.length === 0) return res.status(404).json({ message: 'PO not found.' });
    if (poRows[0].status !== 'pending') {
      return res.status(400).json({ message: 'Only pending POs can be signed.' });
    }
    await db.query(
      'UPDATE purchase_orders SET status=?, signed_by=?, signed_date=NOW() WHERE id=?',
      ['signed', req.user.id, req.params.id]
    );
    res.json({ message: 'PO signed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Update PO status (cancel, etc.)
router.put('/po/:id/status', authenticate, authorize('Administrator', 'Project Manager'), async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE purchase_orders SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ message: 'PO status updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
