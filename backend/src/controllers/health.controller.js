const config = require('../config/env');

const healthCheck = (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is running',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV
    }
  });
};

module.exports = {
  healthCheck
};
