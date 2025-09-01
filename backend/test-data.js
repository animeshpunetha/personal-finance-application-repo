// backend/test-data.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User.js');
const Category = require('./models/Category.js');
const Transaction = require('./models/Transaction.js');

dotenv.config();

// this file is for testing out our backend.

const addTestData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if test user exists, if not create one
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Created test user:', testUser._id);
    } else {
      console.log('Test user already exists:', testUser._id);
    }

    // Create some categories if they don't exist
    const categories = [
      { name: 'Food & Dining', type: 'expense', user: testUser._id },
      { name: 'Transportation', type: 'expense', user: testUser._id },
      { name: 'Shopping', type: 'expense', user: testUser._id },
      { name: 'Salary', type: 'income', user: testUser._id },
      { name: 'Freelance', type: 'income', user: testUser._id }
    ];

    const createdCategories = [];
    for (const cat of categories) {
      let category = await Category.findOne({ name: cat.name, user: testUser._id });
      if (!category) {
        category = await Category.create(cat);
        console.log('Created category:', category.name);
      } else {
        console.log('Category already exists:', category.name);
      }
      createdCategories.push(category);
    }

    // Check if transactions already exist
    const existingTransactions = await Transaction.countDocuments({ user: testUser._id });
    if (existingTransactions > 0) {
      console.log('Transactions already exist, skipping...');
      return;
    }

    // Create sample transactions
    const transactions = [
      {
        user: testUser._id,
        type: 'income',
        category: createdCategories.find(c => c.name === 'Salary')._id,
        amount: 50000,
        date: new Date('2024-01-15'),
        description: 'Monthly salary'
      },
      {
        user: testUser._id,
        type: 'income',
        category: createdCategories.find(c => c.name === 'Freelance')._id,
        amount: 15000,
        date: new Date('2024-01-20'),
        description: 'Web development project'
      },
      {
        user: testUser._id,
        type: 'expense',
        category: createdCategories.find(c => c.name === 'Food & Dining')._id,
        amount: 8000,
        date: new Date('2024-01-18'),
        description: 'Restaurant and groceries'
      },
      {
        user: testUser._id,
        type: 'expense',
        category: createdCategories.find(c => c.name === 'Transportation')._id,
        amount: 3000,
        date: new Date('2024-01-19'),
        description: 'Fuel and public transport'
      },
      {
        user: testUser._id,
        type: 'expense',
        category: createdCategories.find(c => c.name === 'Shopping')._id,
        amount: 12000,
        date: new Date('2024-01-21'),
        description: 'Clothes and electronics'
      }
    ];

    await Transaction.insertMany(transactions);
    console.log('Created sample transactions');

    console.log('Test data added successfully!');
    console.log('You can now login with:');
    console.log('Email: test@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error adding test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the function
addTestData();
