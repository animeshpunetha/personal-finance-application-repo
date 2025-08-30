// backend/routes/categoryRoutes.js
const express = require('express');
const { getCategories, createCategory } = require('../controllers/categoryController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// We can chain .get() and .post() for the same route ('/')
// Both routes are protected by the `protect` middleware.
router.route('/').get(protect, getCategories).post(protect, createCategory);

module.exports = router;