# Personal Finance App - Dashboard

A full-stack personal finance application with a functional dashboard that displays financial summaries, charts, and transaction data.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- `.env` file with your MongoDB connection string

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```
The backend will run on `http://localhost:5000`

### 2. Start Frontend Server
```bash
cd frontend/personal-finance-app
npm install
npm start
```
The frontend will run on `http://localhost:3000`

## 🔧 Dashboard Features

### ✅ What's Working
- **Real-time Data**: Connected to MongoDB database
- **Financial Summary**: Net Balance, Total Income, Total Expense
- **Interactive Charts**: Pie chart for expense categories
- **Responsive Design**: Works on all device sizes
- **Error Handling**: Graceful error messages and retry buttons
- **Authentication**: Protected routes with JWT tokens

### 📊 Dashboard Components
1. **Stats Cards**: Net Balance, Income, Expenses with visual indicators
2. **Expense Categories**: Pie chart showing spending breakdown
3. **Monthly Overview**: Bar chart for trend analysis
4. **Quick Transaction Form**: Demo form for adding transactions
5. **Refresh Button**: Manual data refresh capability

## 🗄️ Database Structure

### Test Data Available
- **Test User**: `test@example.com` / `password123`
- **Sample Transactions**: 5 transactions (2 income, 3 expenses)
- **Categories**: 5 categories (3 expense, 2 income)
- **Total Sample Data**: ₹65,000 income, ₹23,000 expenses

### Collections
- `users`: User authentication and profiles
- `categories`: Income/expense categories
- `transactions`: Financial transactions with user linking

## 🐛 Troubleshooting

### Dashboard Shows Zero Values
1. **Check Database**: Ensure MongoDB is running and connected
2. **Verify Test Data**: Run `node test-data.js` in backend directory
3. **Check Authentication**: Ensure user is logged in with valid token
4. **Backend Logs**: Check console for any error messages

### Can't Login/Register
1. **Backend Running**: Ensure backend server is started
2. **Database Connection**: Check `.env` file and MongoDB connection
3. **Port Conflicts**: Verify ports 5000 and 3000 are available
4. **CORS Issues**: Backend should have CORS enabled

### Charts Not Displaying
1. **Data Available**: Check if transactions exist in database
2. **User Authentication**: Ensure user has associated transactions
3. **Console Errors**: Check browser console for JavaScript errors

## 🔍 Debug Steps

### 1. Check Backend Status
```bash
curl http://localhost:5000/
# Should return: "Personal Finance Assistant API is running..."
```

### 2. Check Database Connection
```bash
cd backend
node test-data.js
# Should show: "Connected to MongoDB" and create test data
```

### 3. Check Frontend API Calls
- Open browser console (F12)
- Navigate to dashboard
- Look for API request logs and responses

### 4. Verify Authentication
- Check localStorage for `userInfo` token
- Ensure token is valid and not expired
- Try logging out and logging back in

## 📁 Project Structure

```
personal-finance-app/
├── backend/
│   ├── controllers/     # API logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Authentication
│   └── test-data.js    # Sample data script
├── frontend/
│   └── personal-finance-app/
│       └── src/
│           ├── pages/      # Main page components
│           └── components/ # Reusable components
└── README.md
```

## 🎯 Next Steps

### Immediate Improvements
1. **Real Transaction Form**: Connect the demo form to backend API
2. **Date Filtering**: Add date range picker for dashboard data
3. **Category Management**: Allow users to create custom categories
4. **Data Export**: Add CSV/PDF export functionality

### Advanced Features
1. **Budget Tracking**: Set and monitor spending limits
2. **Recurring Transactions**: Automate regular income/expenses
3. **Financial Goals**: Track savings and investment goals
4. **Mobile App**: React Native version for mobile devices

## 🆘 Support

If you encounter issues:

1. **Check Console Logs**: Both backend and frontend
2. **Verify Database**: Ensure MongoDB is accessible
3. **Test API Endpoints**: Use Postman or curl to test backend
4. **Clear Browser Data**: Remove localStorage and try again

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/personal-finance
PORT=5000
JWT_SECRET=your-secret-key-here
```

---

**Happy Coding! 🚀**
