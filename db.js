import mongoose from "mongoose";
import dbConfig from "./app/config/db.config.js";

const connectDB = async () => {
    try {
        await mongoose.connect(dbConfig.url, dbConfig.options);
        console.log("✅ MongoDB Connected Successfully!");
        console.log(`📊 Database: ${dbConfig.url}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        console.log("💡 Make sure MongoDB is running on your system");
        console.log("💡 You can start MongoDB with: mongod");
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('🎯 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
});

export default connectDB;