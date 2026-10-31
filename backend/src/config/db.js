const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodresq');
    console.log(`[FoodResQ DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[FoodResQ DB Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
