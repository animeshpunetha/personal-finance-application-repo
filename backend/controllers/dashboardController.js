// // backend/controllers/dashboardController.js
// const Transaction = require('../models/Transaction.js');
// const mongoose = require('mongoose');

// const getDashboardSummary = async (req, res) => {
//   try {
//     console.log('Dashboard request received for user:', req.user._id);
    
//     const userId = new mongoose.Types.ObjectId(req.user._id);
//     console.log('Converted userId:', userId);

//     // First, let's check if there are any transactions for this user
//     const totalTransactions = await Transaction.countDocuments({ user: userId });
//     console.log('Total transactions found for user:', totalTransactions);

//     if (totalTransactions === 0) {
//       console.log('No transactions found for user, returning zero values');
//       return res.json({
//         totalIncome: 0,
//         totalExpense: 0,
//         netBalance: 0,
//         pieChartData: [],
//         message: 'No transactions found for this user'
//       });
//     }

//     // 1. Calculate totals and group expenses by category using Aggregation
//     const aggregationResult = await Transaction.aggregate([
//       // Stage 1: Filter transactions for the logged-in user
//       { $match: { user: userId } },
//       // Stage 2: Group all documents to calculate sums and collect category expenses
//       {
//         $group: {
//           _id: null, // Group all documents into one
//           totalIncome: {
//             $sum: {
//               $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
//             },
//           },
//           totalExpense: {
//             $sum: {
//               $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
//             },
//           },
//           // We also need to get the category details for the pie chart
//           expensesByCategory: {
//               $push: {
//                 $cond: [
//                     { $eq: ["$type", "expense"] },
//                     { categoryId: '$category', amount: '$amount' },
//                     "$$REMOVE" // $$REMOVE is a special variable to exclude non-expense items
//                 ]
//               }
//           }
//         },
//       },
//     ]);

//     // 2. Handle case when no transactions exist
//     const summary = aggregationResult[0] || { totalIncome: 0, totalExpense: 0, expensesByCategory: [] };

//     // 3. Only populate if there are expenses by category
//     let pieChartData = [];
//     if (summary.expensesByCategory && summary.expensesByCategory.length > 0) {
//       await Transaction.populate(summary.expensesByCategory, { path: 'categoryId', select: 'name' });

//       // 4. Format the expensesByCategory data for the frontend chart
//       const formattedExpenses = summary.expensesByCategory.reduce((acc, item) => {
//           const categoryName = item.categoryId ? item.categoryId.name : 'Uncategorized';
//           acc[categoryName] = (acc[categoryName] || 0) + item.amount;
//           return acc;
//       }, {});

//       pieChartData = Object.keys(formattedExpenses).map(name => ({
//           name,
//           value: formattedExpenses[name],
//       }));
//     }

//     // 5. Send the final, structured response
//     const response = {
//       totalIncome: summary.totalIncome || 0,
//       totalExpense: summary.totalExpense || 0,
//       netBalance: (summary.totalIncome || 0) - (summary.totalExpense || 0),
//       pieChartData, // Send the data pre-formatted for the chart
//     };

//     console.log('Sending dashboard response:', response); // Debug log
//     res.json(response);

//   } catch (error) {
//     console.error('Dashboard summary error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// module.exports = { getDashboardSummary };


// backend/controllers/dashboardController.js (NEW VERSION)
const Transaction = require('../models/Transaction.js');
const mongoose = require('mongoose');

const getDashboardSummary = async (req, res) => {
  console.log('Dashboard requested by user ID:', req.user._id);
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // --- Aggregation Pipeline for Summary Cards & Pie Chart ---
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
    const [summaryResult, barChartResult] = await Promise.all([
        Transaction.aggregate(summaryPipeline),
        Transaction.aggregate(barChartPipeline)
    ]);
    
    // --- Process Summary & Pie Chart Data ---
    const summary = summaryResult[0] || { totalIncome: 0, totalExpense: 0, expensesByCategory: [] };

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