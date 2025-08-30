// backend/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  // This creates a reference to the User model.
  // It's the crucial link that ensures each category belongs to a specific user.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from both ends
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'], // The value must be one of these two
  },
}, {
  timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;