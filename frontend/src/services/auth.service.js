/**
 * Authentication Service
 * 
 * Handles all authentication API calls:
 * - User login
 * - User logout
 * - Token management
 */

import axiosInstance from '../config/axios';
import API_ENDPOINTS from '../config/api';
import { saveToken, removeToken } from '../config/storage';

/**
 * Login user with email and password
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} API response with token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });
    
    // Save token to localStorage
    if (response.data.data.token) {
      saveToken(response.data.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

/**
 * Logout user
 * Removes token and calls logout endpoint
 * 
 * @returns {Promise} API response
 */
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    
    // Remove token from localStorage
    removeToken();
    
    return response.data;
  } catch (error) {
    // Remove token even if logout fails
    removeToken();
    throw error.response?.data || { message: 'Logout failed' };
  }
};

export default {
  loginUser,
  logoutUser
};
