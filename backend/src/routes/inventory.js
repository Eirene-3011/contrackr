


const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/inventory
router.get('/', authenticate, async (req, res) => {
  try {
    const { project_id } = req.query;
    let query = `
      SELECT i.*, m.name AS material_name, m.unit, m.reorder_level, p.name AS project_name
      FROM inventory i
      JOIN materials m ON i.material_id = m.id
      LEFT JOIN projects p ON i.project_id = p.id
    `;
    const params = [];
    if (project_id) {
      if (project_id === 'null') {
        query += ' WHERE i.project_id IS NULL';
      } else {
        query += ' WHERE i.project_id = ?';
        params.push(project_id);
      }
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/inventory/low-stock
// Returns warehouse-level items (project_id IS NULL) where quantity <= reorder_level
// Used by the Header notification badge and reorder alert dashboard
router.get('/low-stock', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.id, m.name, m.unit, m.reorder_level, m.category,
        COALESCE(i.quantity, 0) AS quantity
      FROM materials m
      LEFT JOIN inventory i ON i.material_id = m.id AND i.project_id IS NULL
      WHERE COALESCE(i.quantity, 0) <= m.reorder_level
      ORDER BY m.name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/inventory/out - Warehouse Manager issues materials to project
router.post('/out', authenticate, authorize('Administrator', 'Warehouse Manager'), async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { material_id, quantity, project_id, notes } = req.body;
    if (!material_id || !quantity || !project_id) {
      return res.status(400).json({ message: 'Material, quantity, and destination project are required.' });
    }

    // 1. Deduct from Warehouse
    const [whInv] = await conn.query(
      'SELECT quantity FROM inventory WHERE material_id = ? AND project_id IS NULL FOR UPDATE',
      [material_id]
    );
    const available = whInv.length > 0 ? parseFloat(whInv[0].quantity) : 0;
    if (available < quantity) {
      await conn.rollback();
      return res.status(400).json({ message: 'Insufficient stock in warehouse.' });
    }

    await conn.query(
      'UPDATE inventory SET quantity = quantity - ? WHERE material_id = ? AND project_id IS NULL',
      [quantity, material_id]
    );

    // 2. Add to Project Inventory
    const [existingProjInv] = await conn.query(
      'SELECT id FROM inventory WHERE material_id = ? AND project_id = ?',
      [material_id, project_id]
    );

    if (existingProjInv.length > 0) {
      await conn.query(
        'UPDATE inventory SET quantity = quantity + ? WHERE material_id = ? AND project_id = ?',
        [quantity, material_id, project_id]
      );
    } else {
      await conn.query(
        'INSERT INTO inventory (material_id, project_id, quantity) VALUES (?, ?, ?)',
        [material_id, project_id, quantity]
      );
    }

    // 3. Log Transactions
    await conn.query(
      'INSERT INTO inventory_transactions (type, material_id, project_id, quantity, reference_type, created_by, notes) VALUES (?, ?, NULL, ?, ?, ?, ?)',
      ['OUT', material_id, quantity, 'manual_issue', req.user.id, notes || 'Issued to project #' + project_id]
    );
    await conn.query(
      'INSERT INTO inventory_transactions (type, material_id, project_id, quantity, reference_type, created_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['IN', material_id, project_id, quantity, 'manual_issue', req.user.id, 'Received from warehouse']
    );

    // 4. Check for Low Stock Alert
    const [matRow] = await conn.query('SELECT name, reorder_level FROM materials WHERE id = ?', [material_id]);
    const newWhQty = available - quantity;
    let lowStockAlert = null;
    if (matRow.length > 0 && newWhQty <= matRow[0].reorder_level) {
      lowStockAlert = `Stock below reorder level: ${matRow[0].name} (Current: ${newWhQty}, Reorder: ${matRow[0].reorder_level})`;
    }

    await conn.commit();
    res.json({ message: 'Materials issued to project.', lowStockAlert });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error.', error: err.message });
  } finally {
    conn.release();
  }
});

// GET /api/inventory/transactions
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT it.*, m.name AS material_name, p.name AS project_name, u.name AS created_by_name
      FROM inventory_transactions it
      JOIN materials m ON it.material_id = m.id
      LEFT JOIN projects p ON it.project_id = p.id
      LEFT JOIN users u ON it.created_by = u.id
      ORDER BY it.transaction_date DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;