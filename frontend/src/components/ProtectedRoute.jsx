/**
 * Protected Route Component
 * 
 * This component acts as a wrapper for routes that require authentication.
 * It prevents unauthenticated users from accessing protected pages.
 * 
 * How it works:
 * - If user is authenticated: render the page component
 * - If user is NOT authenticated: redirect to login page
 * 
 * Usage:
 * <ProtectedRoute isAuthenticated={isAuthenticated}>
 *   <Dashboard />
 * </ProtectedRoute>
 */

import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute component
 * 
 * @param {boolean} isAuthenticated - Whether user is currently logged in
 * @param {React.ReactNode} children - The component to render if authenticated
 * @returns {React.ReactNode} Either the protected component or redirect to login
 */
const ProtectedRoute = ({ isAuthenticated, children }) => {
  // If user is NOT authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // If user IS authenticated, render the protected component
  return children
}

export default ProtectedRoute
