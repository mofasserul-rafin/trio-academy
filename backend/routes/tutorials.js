const express = require('express');
const Tutorial = require('../models/Tutorial');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/tutorials - Get all tutorials (with optional search & category filter)
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category_name = category;
    }

    const skip = (page - 1) * limit;
    const tutorials = await Tutorial.find(query)
      .populate('user_id', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Tutorial.countDocuments(query);

    res.json({
      success: true,
      count: tutorials.length,
      total,
      pages: Math.ceil(total / limit),
      tutorials,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tutorials/latest - Get 6 latest tutorials for homepage
router.get('/latest', async (req, res) => {
  try {
    const tutorials = await Tutorial.find()
      .populate('user_id', 'name')
      .sort({ createdAt: -1 })
      .limit(6);
    res.json({ success: true, tutorials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tutorials/:id - Get single tutorial and increment views
router.get('/:id', async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('user_id', 'name email');

    if (!tutorial) {
      return res.status(404).json({ success: false, message: 'Tutorial not found.' });
    }
    res.json({ success: true, tutorial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tutorials - Create tutorial (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, content, category_name, tags } = req.body;
    const tutorial = await Tutorial.create({
      title,
      content,
      category_name,
      user_id: req.user._id,
      tags: tags || [],
    });
    res.status(201).json({ success: true, tutorial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/tutorials/:id - Update tutorial (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tutorial) {
      return res.status(404).json({ success: false, message: 'Tutorial not found.' });
    }
    res.json({ success: true, tutorial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/tutorials/:id - Delete tutorial (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndDelete(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ success: false, message: 'Tutorial not found.' });
    }
    res.json({ success: true, message: 'Tutorial deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
