/**
 * Main App Component
 * 
 * This is the root component that handles:
 * - Route management (Login, Dashboard, Protected routes)
 * - Global authentication state
 * - Token validation on app load
 * - Redirecting authenticated/unauthenticated users appropriately
 * 
 * App Flow:
 * 1. App loads and checks for stored token
 * 2. If token exists, verify it with backend
 * 3. If valid, show Dashboard
 * 4. If invalid/expired, show Login
 * 5. After login, store token and redirect to Dashboard
 * 6. After logout, clear token and redirect to Login
 */

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import axios from 'axios'

function App() {
  // ==================== STATE VARIABLES ====================
  
  // Tracks whether user is authenticated
  // Updated by setIsAuthenticated function
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Tracks whether app is still loading on startup
  // Prevents showing login/dashboard until token validation completes
  const [loading, setLoading] = useState(true)

  // ==================== LIFECYCLE HOOKS ====================

  /**
   * Component mounting effect
   * 
   * Runs once when app loads
   * Checks if user has a stored token and validates it
   * 
   * This ensures:
   * 1. Users stay logged in after page refresh
   * 2. Expired tokens are detected and cleared
   * 3. Unauthenticated users see login page
   */
  useEffect(() => {
    // Get token from browser's localStorage
    const token = localStorage.getItem('token')
    
    // If token exists, verify it with backend
    if (token) {
      verifyToken(token)
    } else {
      // No token found, user not authenticated
      setLoading(false)
    }
  }, []) // Empty dependency array = run only on mount

  // ==================== TOKEN VERIFICATION ====================

  /**
   * Verify stored token with backend
   * 
   * This function checks if the stored token is:
   * 1. Still valid (not expired)
   * 2. Not blacklisted (user hasn't logged out)
   * 3. Recognized by the backend
   * 
   * If token is invalid, it's removed from localStorage
   * 
   * @param {string} token - JWT token to verify
   */
  const API_URL = "https://jwtbasedlogin-qwpn2swz.b4a.run";

const verifyToken = async (token) => {
  try {
    await axios.get(
      `${API_URL}/api/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000
      }
    );

    setIsAuthenticated(true);

  } catch (error) {
    console.log("Verify Token Error:", error);

    localStorage.removeItem("token");
    setIsAuthenticated(false);

  } finally {
    setLoading(false);
  }
};

  // ==================== LOADING STATE ====================

  // Show loading screen while checking token validity
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // ==================== COMPONENT RENDER ====================

  return (
    <Router>
      <Routes>
        
        {/* LOGIN ROUTE */}
        <Route 
          path="/login" 
          element={
            // If already authenticated, redirect to dashboard
            // Otherwise, show login page
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          } 
        />
        
        {/* DASHBOARD ROUTE (PROTECTED) */}
        <Route 
          path="/dashboard" 
          element={
            // Use ProtectedRoute wrapper to check authentication
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        
        {/* HOME ROUTE - REDIRECT TO LOGIN */}
        <Route path="/" element={<Navigate to="/login" />} />
        
      </Routes>
    </Router>
  )
}

export default App
