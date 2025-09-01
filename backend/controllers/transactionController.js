// backend/controllers/transactionController.js
const Transaction = require('../models/Transaction.js');
const Category = require('../models/Category.js');

// @desc    Get all transactions for a user, with date filtering
// @route   GET /api/transactions
const getTransactions = async (req, res) => {
  // It fetches only 10 records at a time and sends to the client thus reducing 
  // one time load at the server and increasing scalability
  try {
    // Set the number of items per page
    const limit = parseInt(req.query.limit) || 10;
    // Get the page number from the query, default to page 1
    const page = parseInt(req.query.page) || 1;

    // Base query to always filter by the logged-in user
    const query = { user: req.user._id };

    // Add date filtering if startDate and endDate are provided
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // First, count the total number of documents that match the query
    const total = await Transaction.countDocuments(query);

    // Then, find the transactions for the specific page
    const transactions = await Transaction.find(query)
      .populate('category', 'name type')
      .sort({ date: -1 })
      .limit(limit) // Apply the limit
      .skip(limit * (page - 1)); // Skip documents for previous pages

    // Send a structured response with pagination details
    res.json({
      transactions,
      page,
      pages: Math.ceil(total / limit), // Calculate total pages
      total,
    });
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

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const { type, category, amount, date, description } = req.body;

    if (!type || !category || !amount || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Find the transaction and ensure it belongs to the user
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update the transaction
    transaction.type = type;
    transaction.category = category;
    transaction.amount = amount;
    transaction.date = date;
    transaction.description = description;

    const updatedTransaction = await transaction.save();
    
    // Populate category details
    await updatedTransaction.populate('category', 'name type');
    
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    // Find the transaction and ensure it belongs to the user
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction };