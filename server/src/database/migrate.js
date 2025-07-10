const mongoose = require('mongoose');
const User = require('../models/User');
const App = require('../models/App');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI;

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected for migration');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const runMigrations = async () => {
  try {
    console.log('Starting database migrations...');

    // Create indexes for better performance
    await App.createIndexes();
    await User.createIndexes();

    console.log('✅ Database indexes created successfully');

    // Add any additional migrations here
    // Example: Update existing documents with new fields
    
    console.log('✅ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migrations
connectDB().then(() => {
  runMigrations();
}); 