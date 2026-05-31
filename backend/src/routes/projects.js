const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const [projects] = await db.query(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM material_requests mr WHERE mr.project_id = p.id) AS mr_count
      FROM projects p ORDER BY p.created_at DESC
    `);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Project not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.post('/', authenticate, authorize('Administrator', 'Project Manager'), async (req, res) => {
  try {
    const { name, location, status, start_date, end_date, description } = req.body;
    if (!name || !location) return res.status(400).json({ message: 'Name and location are required.' });
    const [result] = await db.query(
      'INSERT INTO projects (name, location, status, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, location, status || 'active', start_date, end_date, description]
    );
    res.status(201).json({ message: 'Project created.', projectId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.put('/:id', authenticate, authorize('Administrator', 'Project Manager'), async (req, res) => {
  try {
    const { name, location, status, start_date, end_date, description } = req.body;
    await db.query(
      'UPDATE projects SET name=?, location=?, status=?, start_date=?, end_date=?, description=? WHERE id=?',
      [name, location, status, start_date, end_date, description, req.params.id]
    );
    res.json({ message: 'Project updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.delete('/:id', authenticate, authorize('Administrator'), async (req, res) => {
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
