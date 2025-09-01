// // backend/controllers/dashboardController.js
const Transaction = require('../models/Transaction.js');
const mongoose = require('mongoose');

const getDashboardSummary = async (req, res) => {
  console.log('Dashboard requested by user ID:', req.user._id);
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // --- Aggregation Pipeline for Summary Cards & Pie Chart ---
    // JavaScript code that builds a MongoDB aggregation pipeline
      //Only consider transactions that belong to the currently logged-in user.
      // Combine all those transactions into one single object with summary fields.
      // If a transaction isn’t an expense, it’s skipped (not added to expensesByCategory).
    const summaryPipeline = [
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
          expensesByCategory: {
            $push: {
              $cond: [ { $eq: ["$type", "expense"] }, { category: '$category', amount: '$amount' }, "$$REMOVE" ]
            }
          }
        },
      },
    ];
    
    // --- Aggregation Pipeline for the Bar Chart (Monthly Data for last 6 months) ---
    // The pipeline filters the user’s transactions from the last six months, 
    // groups them by year and month, calculates the total income and total 
    // expense for each month, sorts the results chronologically, and formats 
    // the output for easy use (e.g., charts).
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const barChartPipeline = [
        { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                totalIncome: "$totalIncome",
                totalExpense: "$totalExpense"
            }
        }
    ];

    // --- Execute both aggregations in parallel for performance ---
    /*
    //Runs two MongoDB aggregation queries (summaryPipeline and barChartPipeline) 
    // at the same time instead of one after the other.Promise.all() waits until 
    // both queries finish and gives you their results as an array
    // This makes the backend faster because both DB operations happen concurrently.
    */
    const [summaryResult, barChartResult] = await Promise.all([
        Transaction.aggregate(summaryPipeline),
        Transaction.aggregate(barChartPipeline)
    ]);
    
    // --- Process Summary & Pie Chart Data ---
    //We take all expense records, populate their category names 
    // (replace category IDs with names), sum the amounts per category,
    //  and convert the result into an array of { name, value } objects
    //  for the pie chart.
    const summary = summaryResult[0] || { totalIncome: 0, totalExpense: 0, expensesByCategory: [] };

    // The code calculates a user’s total income, total expenses, and
    //  net balance, groups expenses by category for a pie chart, and
    //  aggregates monthly income and expenses for the bar chart (last
    //  6 months). It then sends all this structured financial data as
    //  a single JSON response to the frontend.
    let pieChartData = [];
    if (summary.expensesByCategory && summary.expensesByCategory.length > 0) {
      await Transaction.populate(summary.expensesByCategory, { path: 'category', select: 'name' });
      const formattedExpenses = summary.expensesByCategory.reduce((acc, item) => {
          const categoryName = item.category ? item.category.name : 'Uncategorized';
          acc[categoryName] = (acc[categoryName] || 0) + item.amount;
          return acc;
      }, {});
      pieChartData = Object.keys(formattedExpenses).map(name => ({ name, value: formattedExpenses[name] }));
    }
    
    // --- Process Bar Chart Data ---
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const barChartData = barChartResult.map(item => ({
        month: monthNames[item.month - 1], // month is 1-12, array is 0-11
        income: item.totalIncome,
        expense: item.totalExpense
    }));

    // --- Send the final, structured response ---
    const totalIncome = summary.totalIncome || 0;
    const totalExpense = summary.totalExpense || 0;

    const response = {
      totalIncome: totalIncome,
      totalExpense: totalExpense,
      netBalance: totalIncome - totalExpense,
      pieChartData,
      barChartData, // Here is the new data for the frontend!
    };

    // ADD THIS LINE FOR DEBUGGING
    console.log('Final data being sent to frontend:', response);
    
    res.json(response);

  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDashboardSummary };