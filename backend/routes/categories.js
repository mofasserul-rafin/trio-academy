const express = require('express');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/categories (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/categories/:id (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/categories/:id (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
