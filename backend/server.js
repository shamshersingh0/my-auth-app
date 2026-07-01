const app = require('./src/app');
const config = require('./src/config/env');

const server = app.listen(config.PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 JWT Authentication Server');
  console.log('='.repeat(60));
  console.log(`📍 Server: http://localhost:${config.PORT}`);
  console.log(`🔐 JWT Secret: ${config.JWT_SECRET ? '✓ Set' : '✗ Not set'}`);
  console.log(`⏰ Token expiry: ${config.JWT_EXPIRE}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log('\n📚 Available Routes:');
  console.log('   POST   /api/auth/login      - Login');
  console.log('   POST   /api/auth/logout     - Logout (Protected)');
  console.log('   GET    /api/users/profile   - Get Profile (Protected)');
  console.log('   GET    /api/health          - Health Check');
  console.log('\n✅ Server Ready!');
  console.log('='.repeat(60) + '\n');
});

process.on('SIGTERM', () => {
  console.log('\n⚠️  Shutting down...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});
