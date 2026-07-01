/**
 * String Utilities
 * 
 * Helper functions for string manipulation
 */

/**
 * Format time in seconds to readable format
 * 
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  if (seconds <= 0) return '0s';
  
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

/**
 * Truncate email for display
 * 
 * @param {string} email - Email to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated email
 */
export const truncateEmail = (email, length = 30) => {
  return email.length > length ? email.substring(0, length) + '...' : email;
};

export default {
  formatTime,
  truncateEmail
};
