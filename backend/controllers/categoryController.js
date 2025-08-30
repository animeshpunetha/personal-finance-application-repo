// backend/controllers/categoryController.js
const Category = require('../models/Category.js');

// @desc    Get all categories for the logged-in user
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    // Find categories that belong to the user making the request.
    // req.user._id is available because of our `protect` middleware.
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
const createCategory = async (req, res) => {
  const { name, type } = req.body;

  // Basic validation
  if (!name || !type) {
    return res.status(400).json({ message: 'Please provide a name and type' });
  }

  try {
    const category = await Category.create({
      name,
      type,
      user: req.user._id, // Link the category to the logged-in user
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = { getCategories, createCategory };