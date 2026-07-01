/**
 * Auth Utilities
 * 
 * Helper functions for token management and validation
 */

import { getToken } from '../config/storage';

/**
 * Check if user is authenticated
 * 
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get authorization header
 * 
 * @returns {Object} Authorization header object
 */
export const getAuthHeader = () => {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`
  };
};

/**
 * Decode JWT token (client-side only for display)
 * 
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * 
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  return Date.now() >= expiryTime;
};

/**
 * Get remaining time before token expires (in seconds)
 * 
 * @param {string} token - JWT token
 * @returns {number} Seconds remaining
 */
export const getTokenExpiryTime = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;
  
  const expiryTime = decoded.exp * 1000;
  const remainingTime = Math.floor((expiryTime - Date.now()) / 1000);
  return Math.max(0, remainingTime);
};

export default {
  isAuthenticated,
  getAuthHeader,
  decodeToken,
  isTokenExpired,
  getTokenExpiryTime
};
