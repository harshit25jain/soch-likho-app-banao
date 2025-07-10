const mongoose = require('mongoose');
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

const migrateApps = async () => {
  try {
    const apps = await App.find({ code: { $exists: true }, files: { $exists: false } });
    if (apps.length === 0) {
      console.log('No apps found that need migration.');
      return;
    }
    for (const app of apps) {
      const files = {
        '/App.js': app.code || '',
        '/index.js': `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\nconst root = createRoot(document.getElementById('root'));\nroot.render(<App />);`,
        '/index.html': "<div id='root'></div>"
      };
      app.files = files;
      app.code = undefined;
      await app.save();
      console.log(`Migrated app ${app._id}`);
    }
    console.log('Migration complete.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(migrateApps); 