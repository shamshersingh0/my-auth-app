import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Backend URL
const API_URL = "https://jwtbasedlogin-s4o6o32t.b4a.run/"

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        `${API_URL}/api/login`,
        {
          email,
          password
        }
      )

      const { token } = response.data

      localStorage.setItem('token', token)

      setIsAuthenticated(true)

      navigate('/dashboard')

    } catch (err) {
      console.log("Login Error:", err)
      console.log("Response:", err.response)
      console.log("Data:", err.response?.data)

      setError(
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          JWT Auth
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Token expires in 1 minute
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="font-bold">Demo Credentials</p>
          <p>Email: user@example.com</p>
          <p>Password: password123</p>
        </div>

      </div>
    </div>
  )
}

export default Login