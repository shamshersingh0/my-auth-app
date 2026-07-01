const { findUserById } = require('../config/database');

const getProfile = (req, res) => {
  try {
    const user = findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true,
      data: { user: { id: user.id, email: user.email } } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getProfile
};
