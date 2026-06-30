/**
 * Dashboard Component
 * 
 * Protected page that displays after successful login.
 * Shows user information and token expiry countdown.
 * 
 * Features:
 * - Fetch and display current user information
 * - Real-time token expiry countdown (updates every second)
 * - Auto-logout when token expires
 * - Manual logout button
 * - Authentication status display
 * 
 * @param {Function} setIsAuthenticated - Function to update authentication state in parent
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = ({ setIsAuthenticated }) => {
  // ==================== STATE VARIABLES ====================
  
  // Stores current user information (id, email)
  const [user, setUser] = useState(null)
  
  // Displays remaining token validity time (updates every second)
  // Format: "45s", "30s", etc.
  const [tokenExpiry, setTokenExpiry] = useState(null)
  
  // Error message if user fetch fails
  const [error, setError] = useState('')
  
  // Loading state for logout button
  const [logoutLoading, setLogoutLoading] = useState(false)
  
  // Hook to navigate to different pages
  const navigate = useNavigate()

  // ==================== LIFECYCLE HOOKS ====================

  /**
   * Component mounting effect
   * Runs once when component loads
   * Fetches user information to verify token is still valid
   */
  useEffect(() => {
    fetchUserInfo()
  }, [])

  // ==================== API FUNCTIONS ====================

  /**
   * Fetch current user information from protected API endpoint
   * 
   * This function:
   * 1. Retrieves stored JWT token from localStorage
   * 2. Sends GET request to /api/user with token
   * 3. Updates user state if successful
   * 4. Starts token expiry countdown
   * 5. Auto-logs out if token is invalid
   */
  const fetchUserInfo = async () => {
    try {
      // Get stored JWT token from localStorage
      const token = localStorage.getItem('token')
      
      // Send request to protected endpoint with Authorization header
      const response = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Store user info in state
      setUser(response.data.user)
      
      // Start countdown timer for token expiry
      calculateTokenExpiry(token)
    } catch (err) {
      // Show error message
      setError('Failed to fetch user info')
      
      // Auto-logout if token is invalid or expired (401 error)
      if (err.response?.status === 401) {
        handleLogout()
      }
    }
  }

  /**
   * Calculate and display remaining token validity time
   * 
   * How JWT tokens work:
   * - JWT has 3 parts separated by dots: header.payload.signature
   * - Middle part (payload) contains token data in Base64
   * - Payload includes 'exp' field with expiration time (in seconds since 1970)
   * 
   * This function:
   * 1. Decodes JWT payload
   * 2. Calculates seconds remaining until expiry
   * 3. Updates display every second (1000ms)
   * 4. Auto-logs out when token expires
   * 
   * @param {string} token - JWT token from localStorage
   * @returns {Function} Cleanup function to stop interval
   */
  const calculateTokenExpiry = (token) => {
    try {
      // Split JWT into parts: [header, payload, signature]
      const parts = token.split('.')
      
      // Decode the payload (middle part) from Base64
      // atob() converts Base64 to regular string
      const decoded = JSON.parse(atob(parts[1]))
      
      // Get expiration time from token and convert to milliseconds
      // decoded.exp is in seconds, multiply by 1000 for JavaScript Date
      const expiryTime = decoded.exp * 1000
      
      /**
       * Update expiry display every second
       * This function is called repeatedly by setInterval
       */
      const updateExpiry = () => {
        // Get current time in milliseconds
        const now = Date.now()
        
        // Calculate seconds remaining
        const secondsRemaining = Math.floor((expiryTime - now) / 1000)
        
        // Check if token has expired
        if (secondsRemaining <= 0) {
          // Display expired message
          setTokenExpiry('Expired')
          
          // Auto-logout user
          handleLogout()
        } else {
          // Update display with remaining seconds (e.g., "45s", "30s")
          setTokenExpiry(`${secondsRemaining}s`)
        }
      }

      // Call update function immediately (don't wait 1 second)
      updateExpiry()
      
      // Set up interval to update every second (1000ms)
      const interval = setInterval(updateExpiry, 1000)
      
      // Return cleanup function to stop interval when component unmounts
      return () => clearInterval(interval)
    } catch (error) {
      console.error('Error calculating token expiry:', error)
    }
  }

  // ==================== LOGOUT HANDLER ====================

  /**
   * Handle user logout
   * 
   * Steps:
   * 1. Show loading state on logout button
   * 2. Send logout request to backend (blacklist token)
   * 3. Remove token from localStorage
   * 4. Update authentication state
   * 5. Redirect to login page
   */
  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      // Send logout request to backend
      // Backend will blacklist the token so it can't be reused
      await axios.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      // Log error but still proceed with logout
      console.error('Logout error:', err)
    } finally {
      // Clean up even if logout API fails
      
      // Remove token from localStorage
      localStorage.removeItem('token')
      
      // Update parent component's authentication state
      setIsAuthenticated(false)
      
      // Hide loading indicator
      setLogoutLoading(false)
      
      // Redirect to login page
      navigate('/login')
    }
  }

  // ==================== LOADING STATE ====================

  // Show loading screen if user data hasn't loaded yet
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // ==================== COMPONENT RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      {/* Main dashboard card container */}
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Dashboard</h1>

        {/* Error message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Information cards section */}
        <div className="space-y-4 mb-6">
          
          {/* User email card */}
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-gray-600 text-sm font-semibold mb-1">User Email</p>
            <p className="text-gray-800 text-lg font-bold">{user.email}</p>
          </div>

          {/* Token expiry countdown card */}
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <p className="text-gray-600 text-sm font-semibold mb-1">Token Expiry</p>
            {/* Display countdown or loading state */}
            <p className="text-blue-600 text-2xl font-bold">{tokenExpiry || '...'}</p>
            <p className="text-gray-500 text-xs mt-1">Tokens expire after 1 minute</p>
          </div>

          {/* Authentication status card */}
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <p className="text-gray-600 text-sm font-semibold mb-1">Status</p>
            <p className="text-green-600 text-lg font-bold">✓ Authenticated</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          {/* Show different text based on logout state */}
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}

export default Dashboard
