// backend/controllers/transactionController.js
const Transaction = require('../models/Transaction.js');
const Category = require('../models/Category.js');

// @desc    Get all transactions for a user, with date filtering
// @route   GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    // Base query to always filter by the logged-in user
    const query = { user: req.user._id };

    // Add date filtering if startDate and endDate are provided in the query string
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const transactions = await Transaction.find(query)
      // Replace the category ObjectId with its name and type
      .populate('category', 'name type')
      // Sort by date, most recent first
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
const createTransaction = async (req, res) => {
  const { type, category, amount, date, description } = req.body;

  if (!type || !category || !amount || !date) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const transaction = await Transaction.create({
      type,
      category,
      amount,
      date,
      description,
      user: req.user._id, // Link to the logged-in user
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get dashboard summary data
// @route   GET /api/dashboard/summary
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total income (deposits)
    const totalIncomeResult = await Transaction.aggregate([
      { $match: { user: userId, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;

    // Get total expenses
    const totalExpenseResult = await Transaction.aggregate([
      { $match: { user: userId, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpense = totalExpenseResult.length > 0 ? totalExpenseResult[0].total : 0;

    // Calculate net balance
    const netBalance = totalIncome - totalExpense;

    // Get expenses by category for pie chart
    const pieChartData = await Transaction.aggregate([
      { $match: { user: userId, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          value: { $sum: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      { $unwind: '$categoryDetails' },
      {
        $project: {
          _id: 0,
          name: '$categoryDetails.name',
          value: '$value'
        }
      }
    ]);

    res.json({
      netBalance,
      totalIncome,
      totalExpense,
      pieChartData
    });

  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = { getTransactions, createTransaction, getDashboardSummary };