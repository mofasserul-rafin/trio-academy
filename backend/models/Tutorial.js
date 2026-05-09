const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category_name: {
      type: String,
      required: [true, 'Category is required'],
      ref: 'Category',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        tag_name: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Text index for search
tutorialSchema.index({ title: 'text', content: 'text', category_name: 'text' });

module.exports = mongoose.model('Tutorial', tutorialSchema);
