const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { authenticate } = require('../middleware/auth');

// GET /api/reports/dashboard
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const [[{ total_materials }]] = await db.query('SELECT COUNT(*) AS total_materials FROM materials');
    const [[{ total_projects }]] = await db.query("SELECT COUNT(*) AS total_projects FROM projects WHERE status = 'active'");
    
    // Updated status counters
    const [[{ available_mr }]] = await db.query("SELECT COUNT(*) AS available_mr FROM material_requests WHERE status = 'available_for_issuance'");
    const [[{ pending_procurement_mr }]] = await db.query("SELECT COUNT(*) AS pending_procurement_mr FROM material_requests WHERE status = 'pending_procurement'");
    const [[{ pending_pr }]] = await db.query("SELECT COUNT(*) AS pending_pr FROM purchase_requests WHERE status = 'pending'");
    const [[{ signed_po }]] = await db.query("SELECT COUNT(*) AS signed_po FROM purchase_orders WHERE status = 'signed'");
    const [[{ pending_transfers }]] = await db.query("SELECT COUNT(*) AS pending_transfers FROM transfers WHERE status = 'pending'");
    
    const [[{ low_stock_count }]] = await db.query('SELECT COUNT(*) AS low_stock_count FROM inventory i JOIN materials m ON i.material_id = m.id WHERE i.project_id IS NULL AND i.quantity <= m.reorder_level');
    const [[{ total_po_value }]] = await db.query('SELECT COALESCE(SUM(total_cost), 0) AS total_po_value FROM purchase_orders');
    
    const [recent_transactions] = await db.query(`
      SELECT it.type, m.name AS material_name, it.quantity, m.unit, it.transaction_date, p.name AS project_name
      FROM inventory_transactions it
      JOIN materials m ON it.material_id = m.id
      LEFT JOIN projects p ON it.project_id = p.id
      ORDER BY it.transaction_date DESC LIMIT 10
    `);
    
    const [low_stock_items] = await db.query(`
      SELECT m.name, m.unit, m.reorder_level, COALESCE(SUM(i.quantity), 0) AS total_quantity
      FROM materials m LEFT JOIN inventory i ON m.id = i.material_id AND i.project_id IS NULL
      GROUP BY m.id HAVING total_quantity <= m.reorder_level LIMIT 5
    `);
    
    res.json({
      total_materials, total_projects, available_mr, pending_procurement_mr, pending_pr, signed_po,
      pending_transfers, low_stock_count, total_po_value, recent_transactions, low_stock_items
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/reports/inventory
router.get('/inventory', authenticate, async (req, res) => {
  try {
    const [report] = await db.query(`
      SELECT m.id, m.name, m.unit, m.category, m.reorder_level,
        COALESCE(SUM(CASE WHEN i.project_id IS NULL THEN i.quantity ELSE 0 END), 0) AS warehouse_qty,
        COALESCE(SUM(CASE WHEN i.project_id IS NOT NULL THEN i.quantity ELSE 0 END), 0) AS project_qty,
        COALESCE(SUM(i.quantity), 0) AS total_qty,
        CASE WHEN COALESCE(SUM(CASE WHEN i.project_id IS NULL THEN i.quantity ELSE 0 END), 0) <= m.reorder_level 
          THEN 'LOW STOCK' ELSE 'OK' END AS status
      FROM materials m LEFT JOIN inventory i ON m.id = i.material_id
      GROUP BY m.id ORDER BY m.category, m.name
    `);
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/reports/transactions
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const { start_date, end_date, type } = req.query;
    let query = `
      SELECT it.*, m.name AS material_name, m.unit, p.name AS project_name, u.name AS created_by_name
      FROM inventory_transactions it
      JOIN materials m ON it.material_id = m.id
      LEFT JOIN projects p ON it.project_id = p.id
      LEFT JOIN users u ON it.created_by = u.id
    `;
    const params = [];
    let whereAdded = false;
    if (start_date) { query += ' WHERE DATE(it.transaction_date) >= ?'; params.push(start_date); whereAdded = true; }
    if (end_date) { query += (whereAdded ? ' AND' : ' WHERE') + ' DATE(it.transaction_date) <= ?'; params.push(end_date); whereAdded = true; }
    if (type) { query += (whereAdded ? ' AND' : ' WHERE') + ' it.type = ?'; params.push(type); }
    query += ' ORDER BY it.transaction_date DESC LIMIT 500';
    const [transactions] = await db.query(query, params);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/reports/stock-movement
router.get('/stock-movement', authenticate, async (req, res) => {
  try {
    const [movement] = await db.query(`
      SELECT DATE(transaction_date) AS date,
        SUM(CASE WHEN type = 'IN' THEN quantity ELSE 0 END) AS stock_in,
        SUM(CASE WHEN type = 'OUT' THEN quantity ELSE 0 END) AS stock_out,
        SUM(CASE WHEN type IN ('TRANSFER_IN', 'TRANSFER_OUT') THEN quantity ELSE 0 END) AS transfers
      FROM inventory_transactions
      WHERE transaction_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(transaction_date) ORDER BY date ASC
    `);
    res.json(movement);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/reports/most-used
router.get('/most-used', authenticate, async (req, res) => {
  try {
    const [items] = await db.query(`
      SELECT m.name, m.unit, SUM(it.quantity) AS total_out
      FROM inventory_transactions it
      JOIN materials m ON it.material_id = m.id
      WHERE it.type = 'OUT'
      GROUP BY it.material_id ORDER BY total_out DESC LIMIT 10
    `);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/reports/project-consumption
router.get('/project-consumption', authenticate, async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT p.name AS project_name, SUM(it.quantity) AS total_consumed,
        COUNT(DISTINCT it.material_id) AS material_types
      FROM inventory_transactions it
      JOIN projects p ON it.project_id = p.id
      WHERE it.type = 'OUT'
      GROUP BY it.project_id ORDER BY total_consumed DESC
    `);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/reports/procurement-history
router.get('/procurement-history', authenticate, async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT po.id, po.created_at, po.total_cost, po.status,
        s.name AS supplier_name, COUNT(poi.id) AS item_count
      FROM purchase_orders po
      JOIN suppliers s ON po.supplier_id = s.id
      LEFT JOIN po_items poi ON po.id = poi.po_id
      GROUP BY po.id ORDER BY po.created_at DESC
    `);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;