// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the DB connection function
const userRoutes = require('./routes/userRoutes'); // Import user routes
const categoryRoutes = require('./routes/categoryRoutes'); // Import category routes
const transactionRoutes = require('./routes/transactionRoutes'); // Import transaction routes
const dashboardRoutes = require('./routes/dashboardRoutes'); // Import dashboard routes


// Connect to the database
connectDB();

// Create an Express application
const app = express();

app.use(cors()); // Cross Origin Resource Sharing

// This middleware allows us to accept JSON data in the request body
app.use(express.json());

// Define the port the server will run on
const PORT = process.env.PORT || 5000;

// A simple test route to make sure the server is running
app.get('/', (req, res) => {
  res.send('Personal Finance Assistant API is running...');
});

// Use the user routes
app.use('/api/users', userRoutes);

// Use the category routes
app.use('/api/categories', categoryRoutes);

// Use the transaction routes
app.use('/api/transactions', transactionRoutes);

// Use the dashboard routes
app.use('/api/dashboard', dashboardRoutes); 


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});