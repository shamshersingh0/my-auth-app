/**
 * JWT Authentication Backend Server
 * 
 * This server handles user authentication using JWT tokens.
 * Features:
 * - User login with email/password
 * - JWT token generation (expires in 1 minute)
 * - Token verification middleware
 * - Token blacklisting on logout
 * - Protected routes
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

// Enable CORS - allows requests from frontend on different port
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// ==================== DATA STORAGE ====================

/**
 * Mock user database
 * In production, use a real database like MongoDB
 * 
 * Structure:
 * - id: Unique user identifier
 * - email: User email (username for login)
 * - password: Hashed password using bcryptjs (never store plain passwords!)
 */
const users = [
  { 
    id: 1, 
    email: 'user@example.com', 
    // Password: "password123" (hashed with bcryptjs)
    password: bcryptjs.hashSync('password123', 10) 
  }
];

/**
 * Token blacklist for logout functionality
 * When user logs out, their token is added here
 * Prevents reuse of logged-out tokens
 * 
 * In production, use Redis or database for persistence
 * (this Set will clear on server restart)
 */
const tokenBlacklist = new Set();

// ==================== MIDDLEWARE: JWT VERIFICATION ====================

/**
 * Middleware to verify JWT token
 * 
 * This middleware is applied to protected routes
 * It checks:
 * 1. Token exists in Authorization header
 * 2. Token signature is valid
 * 3. Token hasn't expired
 * 4. Token hasn't been blacklisted (logged out)
 * 
 * If validation passes, decoded user data is stored in req.user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware/route handler
 */
const authenticateToken = (req, res, next) => {
  // Extract token from "Authorization: Bearer <token>"
  // Authorization header format: "Bearer eyJhbGciOiJIUzI1NiIs..."
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Return error if no token provided
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  // Check if token is blacklisted (user has logged out)
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'Token has been revoked' });
  }

  // Verify token using JWT secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Specific error handling for expired tokens
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      // Generic error for invalid or tampered tokens
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    // Store decoded user data in request object for use in route handlers
    // 'user' object contains: { id, email, iat, exp }
    req.user = user;
    next();
  });
};

// ==================== ROUTES ====================

/**
 * POST /api/login
 * 
 * Authenticates user and returns JWT token
 * Public endpoint - no authentication required
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * Success Response (200):
 * {
 *   "message": "Login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIs...",
 *   "user": { "id": 1, "email": "user@example.com" }
 * }
 * 
 * Error Responses:
 * - 400: Missing email or password
 * - 401: Invalid credentials
 * - 500: Server error
 */
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Step 2: Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Step 3: Verify password using bcryptjs comparison
    // bcryptjs.compareSync() checks if plain password matches hashed password
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Step 4: Generate JWT token
    // jwt.sign() creates a token with:
    // - Payload: user id and email
    // - Secret: used to sign and verify the token
    // - Options: token expires in 1 minute (set in .env file)
    const token = jwt.sign(
      { id: user.id, email: user.email },     // Payload - data in token
      process.env.JWT_SECRET,                  // Secret - never share this!
      { expiresIn: process.env.JWT_EXPIRE }   // Options - token validity
    );

    // Step 5: Return token and user info to client
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * POST /api/logout
 * 
 * Logs out user by blacklisting their token
 * Protected endpoint - requires valid JWT token
 * 
 * After logout, token cannot be reused
 * 
 * Request headers:
 * {
 *   "Authorization": "Bearer <token>"
 * }
 * 
 * Success Response (200):
 * {
 *   "message": "Logout successful"
 * }
 * 
 * Error Responses:
 * - 401: Missing or expired token
 * - 403: Invalid token
 * - 500: Server error
 */
app.post('/api/logout', authenticateToken, (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Add token to blacklist so it cannot be used again
    // This prevents the same token from being used after logout
    if (token) {
      tokenBlacklist.add(token);
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET /api/user
 * 
 * Protected endpoint - returns current user information
 * Requires valid JWT token in Authorization header
 * 
 * Used by frontend to:
 * 1. Verify token is still valid
 * 2. Get current user information
 * 3. Check if user is authenticated
 * 
 * Request headers:
 * {
 *   "Authorization": "Bearer <token>"
 * }
 * 
 * Success Response (200):
 * {
 *   "user": { "id": 1, "email": "user@example.com" }
 * }
 * 
 * Error Responses:
 * - 401: Missing, expired, or revoked token
 * - 403: Invalid token
 * - 500: Server error
 */
app.get('/api/user', authenticateToken, (req, res) => {
  try {
    // req.user contains decoded token data (set by authenticateToken middleware)
    // Use the user ID from token to fetch user details
    const user = users.find(u => u.id === req.user.id);
    
    // Return user info (never return password!)
    res.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET /api/health
 * 
 * Health check endpoint
 * Public endpoint - no authentication required
 * 
 * Used to:
 * 1. Verify server is running and accessible
 * 2. Check API connectivity
 * 
 * Success Response (200):
 * {
 *   "message": "Server is running"
 * }
 */
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// ==================== SERVER STARTUP ====================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 JWT Secret: ${process.env.JWT_SECRET ? '✓ Set' : '✗ Not set'}`);
  console.log(`⏰ Token expiration: ${process.env.JWT_EXPIRE}`);
});
