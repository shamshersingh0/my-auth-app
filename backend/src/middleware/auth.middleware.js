const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../config/tokenBlacklist');
const config = require('../config/env');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required'
      });
    }

    if (isBlacklisted(token)) {
      return res.status(401).json({ 
        success: false,
        message: 'Token has been revoked'
      });
    }

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            success: false,
            message: 'Token expired'
          });
        }
        return res.status(403).json({ 
          success: false,
          message: 'Invalid token'
        });
      }
      
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Authentication error'
    });
  }
};

module.exports = {
  authenticateToken
};
