require('dotenv').config();

const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '1m',
  API_URL: process.env.API_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

// Log configuration on startup
if (process.env.NODE_ENV === 'production') {
  console.log('\n🔒 Production Mode CORS Enabled');
  console.log(`✅ Allowed Origins:`);
  console.log(`   - https://hellojwtbasedlogin-byapr167.b4a.run/`);
  console.log(`   - http://localhost:3000`);
  console.log(`   - http://localhost:5000\n`);
}

module.exports = config;
