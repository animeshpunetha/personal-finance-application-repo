// backend/routes/transactionRoutes.js
const express = require('express');
const { getTransactions, createTransaction, getDashboardSummary } = require('../controllers/transactionController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/').get(protect, getTransactions).post(protect, createTransaction);
router.get('/dashboard/summary', protect, getDashboardSummary);

module.exports = router;