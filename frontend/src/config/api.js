/**
 * API Configuration
 * 
 * Centralized API endpoint configuration
 * Uses environment variable with fallback
 */

// Use production backend URL for deployed version
// For local development, use: http://localhost:5000/api
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jwtbasedlogin-s4o6o32t.b4a.run/api';

const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`
  },
  // User endpoints
  USER: {
    PROFILE: `${API_BASE_URL}/users/profile`
  },
  // Health endpoints
  HEALTH: `${API_BASE_URL}/health`
};

console.log('🌐 API Base URL:', API_BASE_URL);

export default API_ENDPOINTS;
