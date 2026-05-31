const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/mr
router.get('/', authenticate, async (req, res) => {
  try {
    const [requests] = await db.query(`
      SELECT mr.*, p.name AS project_name, u.name AS requested_by_name,
        (SELECT COUNT(*) FROM mr_items WHERE mr_id = mr.id) AS item_count
      FROM material_requests mr
      JOIN projects p ON mr.project_id = p.id
      JOIN users u ON mr.requested_by = u.id
      ORDER BY mr.created_at DESC
    `);

    if (requests.length > 0) {
      const mrIds = requests.map(r => r.id);
      const [items] = await db.query(`
        SELECT mri.*, m.name AS material_name, m.unit
        FROM mr_items mri JOIN materials m ON mri.material_id = m.id
        WHERE mri.mr_id IN (?)
      `, [mrIds]);

      requests.forEach(mr => {
        mr.items = items.filter(i => i.mr_id === mr.id);
      });
    }

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/mr/pending-procurement
router.get('/pending-procurement', authenticate, async (req, res) => {
  try {
    const [requests] = await db.query(`
      SELECT mr.*, p.name AS project_name, u.name AS requested_by_name
      FROM material_requests mr
      JOIN projects p ON mr.project_id = p.id
      JOIN users u ON mr.requested_by = u.id
      WHERE mr.status = 'pending_procurement'
      ORDER BY mr.created_at DESC
    `);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/mr/available-issuance
router.get('/available-issuance', authenticate, async (req, res) => {
  try {
    const [requests] = await db.query(`
      SELECT mr.*, p.name AS project_name, u.name AS requested_by_name
      FROM material_requests mr
      JOIN projects p ON mr.project_id = p.id
      JOIN users u ON mr.requested_by = u.id
      WHERE mr.status IN ('available_for_issuance', 'partially_fulfilled')
      ORDER BY mr.created_at DESC
    `);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/mr/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT mr.*, p.name AS project_name, u.name AS requested_by_name
      FROM material_requests mr
      JOIN projects p ON mr.project_id = p.id
      JOIN users u ON mr.requested_by = u.id
      WHERE mr.id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'MR not found.' });
    const [items] = await db.query(`
      SELECT mri.*, m.name AS material_name, m.unit
      FROM mr_items mri JOIN materials m ON mri.material_id = m.id
      WHERE mri.mr_id = ?
    `, [req.params.id]);
    res.json({ ...rows[0], items });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/mr
// - If ALL requested items have sufficient warehouse stock → auto-fulfill:
//     deduct from warehouse, add to project inventory, mark MR as 'fulfilled'
// - If ANY item is short → mark MR as 'pending_procurement' (no stock movement)
router.post('/', authenticate, authorize('Administrator', 'Site Engineer'), async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { project_id, date_needed, notes, items } = req.body;
    if (!project_id || !date_needed || !items || items.length === 0) {
      return res.status(400).json({ message: 'Project, date needed, and items are required.' });
    }

    const [mrResult] = await conn.query(
      'INSERT INTO material_requests (project_id, requested_by, date_needed, notes) VALUES (?, ?, ?, ?)',
      [project_id, req.user.id, date_needed, notes]
    );
    const mrId = mrResult.insertId;

    // Insert items and check warehouse stock for each
    let allAvailable = true;
    const itemChecks = [];

    for (const item of items) {
      const { material_id, quantity } = item;
      await conn.query(
        'INSERT INTO mr_items (mr_id, material_id, quantity) VALUES (?, ?, ?)',
        [mrId, material_id, quantity]
      );

      const [invRows] = await conn.query(
        'SELECT quantity FROM inventory WHERE material_id = ? AND project_id IS NULL',
        [material_id]
      );
      const available = invRows.length > 0 ? parseFloat(invRows[0].quantity) : 0;
      if (available < parseFloat(quantity)) {
        allAvailable = false;
      }
      itemChecks.push({ material_id, quantity: parseFloat(quantity), available });
    }

    if (allAvailable) {
      // AUTO-FULFILL: deduct from warehouse, add to project, log transactions
      for (const item of itemChecks) {
        // Deduct from warehouse (project_id IS NULL)
        await conn.query(
          'UPDATE inventory SET quantity = quantity - ? WHERE material_id = ? AND project_id IS NULL',
          [item.quantity, item.material_id]
        );
        // Add to project inventory
        await conn.query(
          'INSERT INTO inventory (material_id, project_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
          [item.material_id, project_id, item.quantity, item.quantity]
        );
        // Log OUT from warehouse
        await conn.query(
          'INSERT INTO inventory_transactions (type, material_id, project_id, quantity, reference_id, reference_type, created_by, notes) VALUES (?, ?, NULL, ?, ?, ?, ?, ?)',
          ['OUT', item.material_id, item.quantity, mrId, 'material_request', req.user.id, 'Auto-issued for MR #' + mrId]
        );
        // Log IN to project
        await conn.query(
          'INSERT INTO inventory_transactions (type, material_id, project_id, quantity, reference_id, reference_type, created_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          ['IN', item.material_id, project_id, item.quantity, mrId, 'material_request', req.user.id, 'Auto-received from warehouse for MR #' + mrId]
        );
        // Mark mr_item as fulfilled
        await conn.query(
          'UPDATE mr_items SET status=?, quantity_fulfilled=? WHERE mr_id=? AND material_id=?',
          ['fulfilled', item.quantity, mrId, item.material_id]
        );
      }
      await conn.query('UPDATE material_requests SET status=? WHERE id=?', ['fulfilled', mrId]);
    } else {
      await conn.query('UPDATE material_requests SET status=? WHERE id=?', ['pending_procurement', mrId]);
    }

    await conn.commit();
    res.status(201).json({
      message: 'Material Request created.',
      mrId,
      status: allAvailable ? 'fulfilled' : 'pending_procurement',
      nextStep: allAvailable
        ? 'Materials auto-issued to project. Inventory updated.'
        : 'Insufficient warehouse stock. Procurement Officer needs to create a Purchase Request.'
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error.', error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
