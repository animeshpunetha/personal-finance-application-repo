// backend/routes/transactionRoutes.js
const express = require('express');
const { getTransactions, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/transactionController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/').get(protect, getTransactions).post(protect, createTransaction);
router.route('/:id').put(protect, updateTransaction).delete(protect, deleteTransaction);

module.exports = router;