/**
 * User Service
 * 
 * Handles all user-related API calls:
 * - Get user profile
 * - Update user info
 */

import axiosInstance from '../config/axios';
import API_ENDPOINTS from '../config/api';

/**
 * Get current user profile
 * 
 * @returns {Promise} User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

export default {
  getUserProfile
};
