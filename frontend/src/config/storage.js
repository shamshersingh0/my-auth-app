/**
 * Local Storage Keys
 * 
 * Centralized keys for localStorage operations
 */

export const STORAGE_KEYS = {
  TOKEN: 'jwt_token',
  USER: 'user_info',
  THEME: 'theme_mode'
};

/**
 * Get token from localStorage
 */
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Save token to localStorage
 */
export const saveToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Clear all storage
 */
export const clearStorage = () => {
  localStorage.clear();
};
