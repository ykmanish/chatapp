const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI.trim();
    console.log("🔄 Connecting to MongoDB...");
    const safeUri = uri.replace(/:([^@]+)@/, ":****@");
    console.log(`📎 URI: ${safeUri}`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes("bad auth") || error.message.includes("Authentication failed")) {
      console.error("\n🔑 AUTHENTICATION FAILED! Fix steps:");
      console.error("   1. Go to MongoDB Atlas → Database Access");
      console.error("   2. Edit your user → Reset password");
      console.error("   3. Use a SIMPLE password (no special chars)");
      console.error("   4. Update .env with the new password");
      console.error("   5. Make sure username is correct\n");
    }
    if (error.message.includes("ECONNREFUSED")) {
      console.error("\n🌐 NETWORK ERROR! Check your internet connection\n");
    }
    process.exit(1);
  }
};

module.exports = connectDB;