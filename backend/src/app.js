const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const healthRoutes = require('./routes/health.routes');
const config = require('./config/env');

const app = express();

// ==================== CORS CONFIGURATION ====================

/**
 * CORS Options for production
 * Allows requests from deployed frontend
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from frontend and localhost
    const allowedOrigins = [
      'https://hellojwtbasedlogin-lm228iuq.b4a.run/'
    ];

    // For development: allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // For production: check against whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// ==================== ROUTES ====================

app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'JWT Authentication API',
    version: '1.0.0'
  });
});

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Endpoint not found'
  });
});

module.exports = app;
