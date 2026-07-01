const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { findUserByEmail } = require('../config/database');
const { addToBlacklist } = require('../config/tokenBlacklist');
const config = require('../config/env');

const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password required' 
      });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );

    res.json({ 
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user.id, email: user.email }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
};

const logout = (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      addToBlacklist(token);
    }

    res.json({ 
      success: true,
      message: 'Logout successful' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  login,
  logout
};
