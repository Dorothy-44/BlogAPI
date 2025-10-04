const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, text: true },
    description: { type: String, text: true },
    content: { type: String, required: true, text: true },
    tags: [{ type: String, lowercase: true, trim: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    state: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },

    read_count: { type: Number, default: 0 },
    reading_time: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// create index for searching
blogSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
