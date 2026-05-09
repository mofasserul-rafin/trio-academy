const express = require('express');
const Tutorial = require('../models/Tutorial');
const Category = require('../models/Category');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalTutorials, totalCategories, totalUsers, totalViews] = await Promise.all([
      Tutorial.countDocuments(),
      Category.countDocuments(),
      User.countDocuments(),
      Tutorial.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    ]);

    res.json({
      success: true,
      stats: {
        totalTutorials,
        totalCategories,
        totalUsers,
        totalViews: totalViews[0]?.total || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ created_at: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself.' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
