/**
 * Login Component
 * 
 * This component displays the login form where users can enter their credentials.
 * 
 * Features:
 * - Email and password input fields
 * - Form validation
 * - Loading state during login
 * - Error message display
 * - Demo credentials display
 * - Redirects to dashboard on successful login
 * 
 * @param {Function} setIsAuthenticated - Function to update authentication state in parent
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = ({ setIsAuthenticated }) => {
  // ==================== STATE VARIABLES ====================
  
  // Pre-filled email for demo purposes (change for production)
  const [email, setEmail] = useState('user@example.com')
  
  // Pre-filled password for demo purposes (change for production)
  const [password, setPassword] = useState('password123')
  
  // Error message to display to user
  const [error, setError] = useState('')
  
  // Loading state while login request is in progress
  const [loading, setLoading] = useState(false)
  
  // Hook to navigate to different pages
  const navigate = useNavigate()

  // ==================== FORM SUBMISSION HANDLER ====================

  /**
   * Handle form submission and login
   * 
   * Steps:
   * 1. Prevent default form submission
   * 2. Clear previous errors
   * 3. Show loading state
   * 4. Send credentials to backend
   * 5. Store token in localStorage
   * 6. Update authentication state
   * 7. Redirect to dashboard
   * 8. Handle and display errors
   * 
   * @param {Event} e - Form submission event
   */
  const handleLogin = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault()
    
    // Clear any previous error messages
    setError('')
    
    // Show loading indicator
    setLoading(true)

    try {
      // Send login request to backend with email and password
      const response = await axios.post('/api/login', { email, password })
      
      // Extract token from response
      const { token } = response.data

      // Store token in browser's localStorage for persistence
      // Token will be used in Authorization headers for protected routes
      localStorage.setItem('token', token)
      
      // Update parent component's authentication state
      setIsAuthenticated(true)
      
      // Redirect user to dashboard page
      navigate('/dashboard')
    } catch (err) {
      // Display error message from backend or generic message
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      // Hide loading indicator regardless of success or failure
      setLoading(false)
    }
  }

  // ==================== COMPONENT RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      {/* Main login card container */}
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Header section */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">JWT Auth</h1>
        <p className="text-gray-600 text-center mb-6">Token expires in 1 minute</p>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Error message alert */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {/* Email input field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password input field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit button - disabled during loading */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {/* Show different text based on loading state */}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo credentials information box */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
          <p className="font-bold mb-2">Demo Credentials:</p>
          <p>Email: user@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  )
}

export default Login
