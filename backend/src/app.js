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
  origin: [
    'https://hellojwtbasedlogin-byapr167.b4a.run'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
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
