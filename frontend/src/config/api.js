/**
 * API Configuration
 * 
 * Centralized API endpoint configuration
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

export default API_ENDPOINTS;
