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
  console.error("Login Error:", error);

  if (error.response) {
    console.error("Response:", error.response.data);
    throw error.response.data;
  }

  if (error.request) {
    throw {
      message: "Cannot connect to the server. Check CORS, backend URL, or server status."
    };
  }

  throw {
    message: error.message
  };
}
};

export default {
  loginUser,
  logoutUser
};
