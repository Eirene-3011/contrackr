const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/transfers
router.get('/', authenticate, async (req, res) => {
  try {
    const [transfers] = await db.query(`
      SELECT t.*, p1.name AS from_project_name, p2.name AS to_project_name,
        u1.name AS requested_by_name, u2.name AS approved_by_name, u3.name AS executed_by_name
      FROM transfers t
      LEFT JOIN projects p1 ON t.from_project_id = p1.id
      LEFT JOIN projects p2 ON t.to_project_id = p2.id
      JOIN users u1 ON t.requested_by = u1.id
      LEFT JOIN users u2 ON t.approved_by = u2.id
      LEFT JOIN users u3 ON t.executed_by = u3.id
      ORDER BY t.request_date DESC
    `);
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/transfers/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, p1.name AS from_project_name, p2.name AS to_project_name,
        u1.name AS requested_by_name, u2.name AS approved_by_name, u3.name AS executed_by_name
      FROM transfers t
      LEFT JOIN projects p1 ON t.from_project_id = p1.id
      LEFT JOIN projects p2 ON t.to_project_id = p2.id
      JOIN users u1 ON t.requested_by = u1.id
      LEFT JOIN users u2 ON t.approved_by = u2.id
      LEFT JOIN users u3 ON t.executed_by = u3.id
      WHERE t.id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Transfer not found.' });
    const [items] = await db.query(`
      SELECT ti.*, m.name AS material_name, m.unit
      FROM transfer_items ti JOIN materials m ON ti.material_id = m.id
      WHERE ti.transfer_id = ?
    `, [req.params.id]);
    res.json({ ...rows[0], items });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/transfers - Create transfer request
router.post('/', authenticate, authorize('Administrator', 'Project Manager', 'Site Engineer'), async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { from_project_id, to_project_id, notes, items } = req.body;
    if (!to_project_id || !items || items.length === 0) {
      return res.status(400).json({ message: 'Destination project and items are required.' });
    }
    const [result] = await conn.query(
      'INSERT INTO transfers (from_project_id, to_project_id, requested_by, notes) VALUES (?, ?, ?, ?)',
      [from_project_id || null, to_project_id, req.user.id, notes]
    );
    const transferId = result.insertId;
    for (const item of items) {
      await conn.query('INSERT INTO transfer_items (transfer_id, material_id, quantity) VALUES (?, ?, ?)',
        [transferId, item.material_id, item.quantity]
      );
    }
    await conn.commit();
    res.status(201).json({ message: 'Transfer request created.', transferId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error.', error: err.message });
  } finally {
    conn.release();
  }
});

// PUT /api/transfers/:id/approve - Manager approval
router.put('/:id/approve', authenticate, authorize('Administrator', 'Project Manager'), async (req, res) => {
  try {
    const { action, reason } = req.body;
    const status = action === 'approve' ? 'approved' : 'rejected';
    await db.query(
      'UPDATE transfers SET status=?, approved_by=?, approval_date=NOW(), rejection_reason=? WHERE id=?',
      [status, req.user.id, reason || null, req.params.id]
    );
    res.json({ message: `Transfer ${action}d.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// PUT /api/transfers/:id/execute - Warehouse Manager execution
router.put('/:id/execute', authenticate, authorize('Administrator', 'Warehouse Manager'), async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [transfer] = await conn.query('SELECT * FROM transfers WHERE id = ? FOR UPDATE', [req.params.id]);
    if (transfer.length === 0) return res.status(404).json({ message: 'Transfer not found.' });
    if (transfer[0].status !== 'approved') return res.status(400).json({ message: 'Transfer must be approved first.' });

    const [items] = await conn.query('SELECT * FROM transfer_items WHERE transfer_id = ?', [req.params.id]);
    for (const item of items) {
      // Deduct from source
      const [sourceInv] = await conn.query(
        'SELECT quantity FROM inventory WHERE material_id = ? AND project_id <=> ? FOR UPDATE',
        [item.material_id, transfer[0].from_project_id]
      );
      const available = sourceInv.length > 0 ? parseFloat(sourceInv[0].quantity) : 0;
      if (available < item.quantity) {
        throw new Error(`Insufficient stock for material ID ${item.material_id} at source.`);
      }
      await conn.query(
        'UPDATE inventory SET quantity = quantity - ? WHERE material_id = ? AND project_id <=> ?',
        [item.quantity, item.material_id, transfer[0].from_project_id]
      );
      // Log TRANSFER_OUT
      await conn.query(
        'INSERT INTO inventory_transactions (type, material_id, project_id, quantity, reference_id, reference_type, created_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['TRANSFER_OUT', item.material_id, transfer[0].from_project_id, item.quantity, req.params.id, 'transfer', req.user.id, 'Transfer to project #' + transfer[0].to_project_id]
      );

      // Add to destination
      await conn.query(
        'INSERT INTO inventory (material_id, project_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
        [item.material_id, transfer[0].to_project_id, item.quantity, item.quantity]
      );
      // Log TRANSFER_IN
      await conn.query(
        'INSERT INTO inventory_transactions (type, material_id, project_id, quantity, reference_id, reference_type, created_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['TRANSFER_IN', item.material_id, transfer[0].to_project_id, item.quantity, req.params.id, 'transfer', req.user.id, 'Transfer from project #' + (transfer[0].from_project_id || 'Warehouse')]
      );
    }

    await conn.query(
      'UPDATE transfers SET status=?, executed_by=?, completion_date=NOW() WHERE id=?',
      ['completed', req.user.id, req.params.id]
    );

    await conn.commit();
    res.json({ message: 'Transfer executed successfully.' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error.', error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;