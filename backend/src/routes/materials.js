const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/materials
router.get('/', authenticate, async (req, res) => {
  try {
    const [materials] = await db.query(`
      SELECT m.*, 
        COALESCE((SELECT SUM(i.quantity) FROM inventory i WHERE i.material_id = m.id AND i.project_id IS NULL), 0) AS warehouse_stock,
        COALESCE((SELECT SUM(i.quantity) FROM inventory i WHERE i.material_id = m.id AND i.project_id IS NOT NULL), 0) AS project_stock
      FROM materials m ORDER BY m.name
    `);
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/materials/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM materials WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Material not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/materials
router.post('/', authenticate, authorize('Administrator', 'Warehouse Manager'), async (req, res) => {
  try {
    const { name, unit, reorder_level, category, description } = req.body;
    if (!name || !unit) return res.status(400).json({ message: 'Name and unit are required.' });
    const [result] = await db.query(
      'INSERT INTO materials (name, unit, reorder_level, category, description) VALUES (?, ?, ?, ?, ?)',
      [name, unit, reorder_level || 0, category, description]
    );
    res.status(201).json({ message: 'Material created.', materialId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// PUT /api/materials/:id
router.put('/:id', authenticate, authorize('Administrator', 'Warehouse Manager'), async (req, res) => {
  try {
    const { name, unit, reorder_level, category, description } = req.body;
    await db.query(
      'UPDATE materials SET name=?, unit=?, reorder_level=?, category=?, description=? WHERE id=?',
      [name, unit, reorder_level || 0, category, description, req.params.id]
    );
    res.json({ message: 'Material updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// DELETE /api/materials/:id
router.delete('/:id', authenticate, authorize('Administrator'), async (req, res) => {
  try {
    await db.query('DELETE FROM materials WHERE id = ?', [req.params.id]);
    res.json({ message: 'Material deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
