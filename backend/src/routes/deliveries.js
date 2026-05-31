
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const [deliveries] = await db.query(`
      SELECT d.*, po.total_cost, s.name AS supplier_name,
        u1.name AS received_by_name, u2.name AS confirmed_by_name
      FROM deliveries d
      JOIN purchase_orders po ON d.po_id = po.id
      JOIN suppliers s ON po.supplier_id = s.id
      LEFT JOIN users u1 ON d.received_by = u1.id
      LEFT JOIN users u2 ON d.confirmed_by = u2.id
      ORDER BY d.delivery_date DESC
    `);
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, po.total_cost, s.name AS supplier_name
      FROM deliveries d
      JOIN purchase_orders po ON d.po_id = po.id
      JOIN suppliers s ON po.supplier_id = s.id
      WHERE d.id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Delivery not found.' });
    const [items] = await db.query(`
      SELECT di.*, m.name AS material_name, m.unit
      FROM delivery_items di JOIN materials m ON di.material_id = m.id
      WHERE di.delivery_id = ?
    `, [req.params.id]);
    res.json({ ...rows[0], items });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Create delivery record
router.post('/', authenticate, authorize('Administrator', 'Warehouse Manager'), async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { po_id, delivery_date, notes, items } = req.body;
    if (!po_id || !delivery_date || !items || items.length === 0) {
      return res.status(400).json({ message: 'PO, delivery date, and items required.' });
    }
    const [delResult] = await conn.query(
      'INSERT INTO deliveries (po_id, delivery_date, notes, received_by) VALUES (?, ?, ?, ?)',
      [po_id, delivery_date, notes, req.user.id]
    );
    const deliveryId = delResult.insertId;
    for (const item of items) {
      await conn.query(
        'INSERT INTO delivery_items (delivery_id, material_id, quantity_ordered, quantity_received) VALUES (?, ?, ?, ?)',
        [deliveryId, item.material_id, item.quantity_ordered, item.quantity_received || 0]
      );
    }
    await conn.commit();
    res.status(201).json({ message: 'Delivery created.', deliveryId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error.', error: err.message });
  } finally {
    conn.release();
  }
});

// Confirm delivery - triggers inventory update (Stock-In to Warehouse)
router.put('/:id/confirm', authenticate, authorize('Administrator', 'Warehouse Manager'), async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { notes } = req.body;
    const [delRows] = await conn.query('SELECT * FROM deliveries WHERE id = ? FOR UPDATE', [req.params.id]);
    if (delRows.length === 0) return res.status(404).json({ message: 'Delivery not found.' });
    if (delRows[0].status === 'confirmed') return res.status(400).json({ message: 'Already confirmed.' });

    await conn.query(
      'UPDATE deliveries SET status=?, confirmed_by=?, received_date=NOW(), notes=? WHERE id=?',
      ['confirmed', req.user.id, notes || null, req.params.id]
    );

    // Update inventory for received items (Stock-In to Warehouse, project_id = NULL)
    const [items] = await conn.query('SELECT * FROM delivery_items WHERE delivery_id = ?', [req.params.id]);
    for (const item of items) {
      if (item.quantity_received > 0) {
        // Check if warehouse inventory exists for this material
        const [existingWhInv] = await conn.query(
          'SELECT id FROM inventory WHERE material_id = ? AND project_id IS NULL',
          [item.material_id]
        );

        if (existingWhInv.length > 0) {
          // If exists, update the quantity
          await conn.query(
            'UPDATE inventory SET quantity = quantity + ? WHERE material_id = ? AND project_id IS NULL',
            [item.quantity_received, item.material_id]
          );
        } else {
          // If not, insert a new record
          await conn.query(
            'INSERT INTO inventory (material_id, project_id, quantity) VALUES (?, NULL, ?)',
            [item.material_id, item.quantity_received]
          );
        }
        await conn.query(
          'INSERT INTO inventory_transactions (type, material_id, project_id, quantity, reference_id, reference_type, created_by, notes) VALUES (?, ?, NULL, ?, ?, ?, ?, ?)',
          ['IN', item.material_id, item.quantity_received, req.params.id, 'delivery', req.user.id, 'Delivery confirmed #' + req.params.id]
        );
      }
    }
    // Update PO status
    await conn.query('UPDATE purchase_orders SET status=? WHERE id=?', ['delivered', delRows[0].po_id]);
    await conn.commit();
    res.json({ message: 'Delivery confirmed. Inventory updated.' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error.', error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;