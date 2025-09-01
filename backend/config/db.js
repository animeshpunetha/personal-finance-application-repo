// backend/config/db.js
// Here we are configuring MongoDB for our project database.
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // connect to the MongoDB URI
    console.log(`MongoDB Connected: ${conn.connection.host}`); // print in the console that MongoDB connection was successful with ___ host.
  } catch (error) { // else print error message in the console regarding failure to connect
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a failure code
  }
};

module.exports = connectDB; // export the connectDB module for reuse in other modules