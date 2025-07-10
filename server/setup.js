const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Soch Likho Backend...\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://harshitjain74280:Canvaswho25@cluster0.fzaksma.mongodb.net/soch-likho?retryWrites=true&w=majority&appName=Cluster0
MONGODB_URI_PROD=mongodb+srv://harshitjain74280:Canvaswho25@cluster0.fzaksma.mongodb.net/soch-likho?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret
JWT_SECRET=soch-likho-super-secret-jwt-key-2024
JWT_EXPIRES_IN=7d

# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyA-09aSkwIs6zYP9nQHTKzws5r23w0J0wA
GEMINI_MODEL=gemini-pro
GEMINI_MAX_TOKENS=4000

# Netlify Deployment
NETLIFY_ACCESS_TOKEN=nfp_tZpTtYuFTFmKc6bn9WQgrjjoX3iewPaE565a
NETLIFY_SITE_ID=your-netlify-site-id

# File Storage
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Security
BCRYPT_ROUNDS=12
`;

  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created successfully');
} else {
  console.log('✅ .env file already exists');
}

// Create necessary directories
const dirs = ['logs', 'uploads', 'temp'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created ${dir} directory`);
  } else {
    console.log(`✅ ${dir} directory already exists`);
  }
});

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run migrate');
console.log('3. Run: npm run seed');
console.log('4. Run: npm run dev');
console.log('\n🔗 Your backend will be available at: http://localhost:5000');
console.log('📊 Health check: http://localhost:5000/health'); 