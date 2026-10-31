const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodresq';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`[FoodResQ DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[FoodResQ DB Error]: ${error.message}`);
    console.error('[FoodResQ DB] Please check your MONGODB_URI in .env');
    process.exit(1);
  }
};

module.exports = connectDB;
