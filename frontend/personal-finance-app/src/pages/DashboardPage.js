// frontend/src/pages/DashboardPage.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, 
  Cell, Legend, Tooltip, CartesianGrid 
} from 'recharts';

// Define some colors for our pie chart slices
const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#6D28D9'];

const DashboardPage = () => {
  // State to hold our dashboard data
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false); // Start false to avoid flash on auto-refresh
  const [initialLoading, setInitialLoading] = useState(true); // For initial page load
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardSummary = async () => {
    if (!initialLoading) setLoading(true); // Show loading spinner on manual/auto refresh
    setError('');
    try {
      // Get user info from local storage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('User not authenticated');
      }

      // Prepare the authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Fetch the summary data from our new backend endpoint
      const { data } = await axios.get('/api/dashboard/summary', config);
      setSummary(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
    const interval = setInterval(fetchDashboardSummary, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []); // The empty array [] means this effect runs once when the component mounts

  // Show a loading message for the initial page load
  if (initialLoading) {
    return <div className="text-center mt-16">Loading Dashboard...</div>;
  }

  // Show an error message if data fetching fails
  if (error) {
    return <div className="text-center mt-16 text-red-500">{error}</div>;
  }

  // Add safety check for summary data
  if (!summary) {
    return <div className="text-center mt-16 text-red-500">No data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header with refresh button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchDashboardSummary}
              disabled={loading}
              className="bg-purple-600 text-gray-400 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:bg-purple-300"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Net Balance</p>
              <p className={`text-2xl font-semibold text-gray-900 ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹ {(Number(summary.netBalance)).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Income</p>
            <p className="text-2xl font-semibold text-gray-900">
              ₹ {(Number(summary.totalIncome)).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Expense</p>
            <p className="text-2xl font-semibold text-gray-900">
              ₹ {(Number(summary.totalExpense)).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-900">
          {/* Statistics Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Expenses by Category</h3>
            {summary.pieChartData && summary.pieChartData.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={summary.pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {summary.pieChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`₹${(Number(value)).toLocaleString('en-IN')}`, name]}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: '#4b5563' }}
                        itemStyle={{ color: '#1f2937' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => (
                          <span style={{ color: '#4b5563', fontSize: '12px', marginLeft: '4px' }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Category Breakdown</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {summary.pieChartData.map((category, index) => {
                      const percentage = ((category.value / summary.totalExpense) * 100).toFixed(1);
                      return (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-gray-700">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-gray-900">
                              ₹{category.value.toLocaleString('en-IN')}
                            </span>
                            <span className="text-gray-500 ml-2">({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <p className="text-gray-500">No expense data to display.</p>
              </div>
            )}
          </div>

          {/* Monthly Overview Bar Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Overview (Last 6 Months)</h3>
            <div style={{ width: '100%', height: 320 }}>
              {summary.barChartData && summary.barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12, tickFormatter: (value) => `₹${value/1000}k` }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem'
                      }}
                      formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#22C55E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                   <p className="text-center text-gray-500">No transaction data available for the last 6 months.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        {summary.message && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-800">{summary.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;