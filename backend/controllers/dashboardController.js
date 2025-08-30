// backend/controllers/dashboardController.js
const Transaction = require('../models/Transaction.js');
const mongoose = require('mongoose');

const getDashboardSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // 1. Calculate totals and group expenses by category using Aggregation
    const aggregationResult = await Transaction.aggregate([
      // Stage 1: Filter transactions for the logged-in user
      { $match: { user: userId } },
      // Stage 2: Group all documents to calculate sums and collect category expenses
      {
        $group: {
          _id: null, // Group all documents into one
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
          // We also need to get the category details for the pie chart
          expensesByCategory: {
              $push: {
                $cond: [
                    { $eq: ["$type", "expense"] },
                    { categoryId: '$category', amount: '$amount' },
                    "$$REMOVE" // $$REMOVE is a special variable to exclude non-expense items
                ]
              }
          }
        },
      },
    ]);

    // 2. Handle case when no transactions exist
    const summary = aggregationResult[0] || { totalIncome: 0, totalExpense: 0, expensesByCategory: [] };

    // 3. Only populate if there are expenses by category
    let pieChartData = [];
    if (summary.expensesByCategory && summary.expensesByCategory.length > 0) {
      await Transaction.populate(summary.expensesByCategory, { path: 'categoryId', select: 'name' });

      // 4. Format the expensesByCategory data for the frontend chart
      const formattedExpenses = summary.expensesByCategory.reduce((acc, item) => {
          const categoryName = item.categoryId ? item.categoryId.name : 'Uncategorized';
          acc[categoryName] = (acc[categoryName] || 0) + item.amount;
          return acc;
      }, {});

      pieChartData = Object.keys(formattedExpenses).map(name => ({
          name,
          value: formattedExpenses[name],
      }));
    }

    // 5. Send the final, structured response
    const response = {
      totalIncome: summary.totalIncome || 0,
      totalExpense: summary.totalExpense || 0,
      netBalance: (summary.totalIncome || 0) - (summary.totalExpense || 0),
      pieChartData, // Send the data pre-formatted for the chart
    };

    console.log('Sending dashboard response:', response); // Debug log
    res.json(response);

  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDashboardSummary };