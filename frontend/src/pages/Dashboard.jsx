/**
 * Dashboard Component
 *
 * This is a protected page.
 * Users can only access this page after successful login.
 *
 * Features:
 * 1. Fetch logged-in user information
 * 2. Show JWT token countdown
 * 3. Auto logout when token expires
 * 4. Manual logout
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

/**
 * Backend URL
 * Every API request will be sent here.
 */
const API_URL = "https://jwtbasedlogin-qwpn2swz.b4a.run"

const Dashboard = ({ setIsAuthenticated }) => {

  /**
   * ===========================
   * STATE VARIABLES
   * ===========================
   */

  // Stores logged-in user information
  const [user, setUser] = useState(null)

  // Stores remaining token time
  const [tokenExpiry, setTokenExpiry] = useState(null)

  // Stores API errors
  const [error, setError] = useState("")

  // Logout button loading state
  const [logoutLoading, setLogoutLoading] = useState(false)

  // Used for page navigation
  const navigate = useNavigate()

  /**
   * Runs only once after component loads.
   */
  useEffect(() => {
    fetchUserInfo()
  }, [])

  /**
   * ===================================
   * Fetch Logged In User Information
   * ===================================
   */
  const fetchUserInfo = async () => {

    try {

      /**
       * Read JWT token from browser
       */
      const token = localStorage.getItem("token")

      /**
       * If token doesn't exist,
       * redirect user to Login page.
       */
      if (!token) {
        navigate("/login")
        return
      }

      /**
       * Call protected API
       */
      const response = await axios.get(
        `${API_URL}/api/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 10000
        }
      )

      /**
       * Save user information
       */
      setUser(response.data.user)

      /**
       * Start countdown timer
       */
      calculateTokenExpiry(token)

    } catch (err) {

      console.error(err)

      /**
       * Display backend error
       */
      setError(
        err.response?.data?.message ||
        "Unable to fetch user."
      )

      /**
       * Invalid token
       * Logout automatically
       */
      localStorage.removeItem("token")
      setIsAuthenticated(false)
      navigate("/login")
    }
  }

  /**
   * ===================================
   * JWT Token Countdown
   * ===================================
   */
  const calculateTokenExpiry = (token) => {

    try {

      /**
       * JWT format:
       * Header.Payload.Signature
       *
       * Payload contains expiry time.
       */
      const payload = JSON.parse(
        atob(token.split(".")[1])
      )

      /**
       * Convert expiry to milliseconds
       */
      const expiryTime = payload.exp * 1000

      /**
       * Runs every second
       */
      const updateTimer = () => {

        const remainingSeconds = Math.floor(
          (expiryTime - Date.now()) / 1000
        )

        /**
         * Token expired
         */
        if (remainingSeconds <= 0) {

          clearInterval(interval)

          handleLogout()

        } else {

          setTokenExpiry(`${remainingSeconds}s`)
        }
      }

      /**
       * Run immediately
       */
      updateTimer()

      /**
       * Update every second
       */
      const interval = setInterval(updateTimer, 1000)

      /**
       * Cleanup
       */
      return () => clearInterval(interval)

    } catch (err) {

      console.error("JWT Decode Error", err)

    }

  }

  /**
   * ===================================
   * Logout Function
   * ===================================
   */
  const handleLogout = async () => {

    try {

      setLogoutLoading(true)

      const token = localStorage.getItem("token")

      /**
       * Inform backend
       * so token gets blacklisted.
       */
      if (token) {

        await axios.post(

          `${API_URL}/api/logout`,

          {},

          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            timeout: 10000
          }

        )

      }

    } catch (err) {

      console.error(err)

    } finally {

      /**
       * Clear browser storage
       */
      localStorage.removeItem("token")

      /**
       * Update authentication
       */
      setIsAuthenticated(false)

      /**
       * Stop loading
       */
      setLogoutLoading(false)

      /**
       * Redirect to Login page
       */
      navigate("/login")
    }

  }

  /**
   * ===================================
   * Loading Screen
   * ===================================
   */
  if (!user) {

    return (

      <div className="flex items-center justify-center min-h-screen bg-gray-900">

        <div className="text-white text-xl">
          Loading...
        </div>

      </div>

    )

  }

  /**
   * ===================================
   * Dashboard UI
   * ===================================
   */
  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">

      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Dashboard
        </h1>

        {
          error &&
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        }

        <div className="space-y-4">

          {/* User Email */}

          <div className="bg-gray-100 rounded p-4">

            <p className="text-gray-500 text-sm">
              User Email
            </p>

            <p className="font-bold text-lg">
              {user.email}
            </p>

          </div>

          {/* JWT Countdown */}

          <div className="bg-blue-50 rounded p-4 border border-blue-300">

            <p className="text-gray-500 text-sm">
              Token Expiry
            </p>

            <p className="text-blue-600 text-2xl font-bold">
              {tokenExpiry}
            </p>

          </div>

          {/* Authentication Status */}

          <div className="bg-green-50 rounded p-4 border border-green-300">

            <p className="text-gray-500 text-sm">
              Status
            </p>

            <p className="text-green-600 font-bold">
              ✓ Authenticated
            </p>

          </div>

        </div>

        <button

          onClick={handleLogout}

          disabled={logoutLoading}

          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"

        >

          {
            logoutLoading
              ? "Logging out..."
              : "Logout"
          }

        </button>

      </div>

    </div>

  )

}

export default Dashboard