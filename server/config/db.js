// ============================================
// config/db.js — MongoDB connection using Mongoose
// ============================================

const mongoose = require("mongoose");
const dns = require("dns");

// Use Google DNS to fix SRV lookup issues on some networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Force IPv4
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Exit the process if DB connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
