const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const [suppliers] = await db.query('SELECT * FROM suppliers ORDER BY name');
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM suppliers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Supplier not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.post('/', authenticate, authorize('Administrator', 'Procurement Officer'), async (req, res) => {
  try {
    const { name, contact_info, email, address } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required.' });
    const [result] = await db.query(
      'INSERT INTO suppliers (name, contact_info, email, address) VALUES (?, ?, ?, ?)',
      [name, contact_info, email, address]
    );
    res.status(201).json({ message: 'Supplier created.', supplierId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.put('/:id', authenticate, authorize('Administrator', 'Procurement Officer'), async (req, res) => {
  try {
    const { name, contact_info, email, address } = req.body;
    await db.query('UPDATE suppliers SET name=?, contact_info=?, email=?, address=? WHERE id=?', [name, contact_info, email, address, req.params.id]);
    res.json({ message: 'Supplier updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.delete('/:id', authenticate, authorize('Administrator'), async (req, res) => {
  try {
    await db.query('DELETE FROM suppliers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Supplier deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
