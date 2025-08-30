// backend/routes/dashboardRoutes.js
const express = require('express');
const { getDashboardSummary } = require('../controllers/dashboardController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/summary', protect, getDashboardSummary);

module.exports = router;