import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = ({ setIsAuthenticated }) => {
  const [user, setUser] = useState(null)
  const [tokenExpiry, setTokenExpiry] = useState(null)
  const [error, setError] = useState('')
  const [logoutLoading, setLogoutLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data.user)
      calculateTokenExpiry(token)
    } catch (err) {
      setError('Failed to fetch user info')
      if (err.response?.status === 401) {
        handleLogout()
      }
    }
  }

  const calculateTokenExpiry = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      const expiryTime = decoded.exp * 1000 // Convert to milliseconds
      
      const updateExpiry = () => {
        const now = Date.now()
        const secondsRemaining = Math.floor((expiryTime - now) / 1000)
        
        if (secondsRemaining <= 0) {
          setTokenExpiry('Expired')
          handleLogout()
        } else {
          setTokenExpiry(`${secondsRemaining}s`)
        }
      }

      updateExpiry()
      const interval = setInterval(updateExpiry, 1000)
      return () => clearInterval(interval)
    } catch (error) {
      console.error('Error calculating token expiry:', error)
    }
  }

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('token')
      setIsAuthenticated(false)
      setLogoutLoading(false)
      navigate('/login')
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-gray-600 text-sm font-semibold mb-1">User Email</p>
            <p className="text-gray-800 text-lg font-bold">{user.email}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <p className="text-gray-600 text-sm font-semibold mb-1">Token Expiry</p>
            <p className="text-blue-600 text-2xl font-bold">{tokenExpiry || '...'}</p>
            <p className="text-gray-500 text-xs mt-1">Tokens expire after 1 minute</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <p className="text-gray-600 text-sm font-semibold mb-1">Status</p>
            <p className="text-green-600 text-lg font-bold">✓ Authenticated</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}

export default Dashboard
