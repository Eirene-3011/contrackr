import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
  const { data } = await axios.post('/api/auth/login', { email, password })
  localStorage.setItem('token', data.token)
  
  // Handle if user object is nested or not present
  const user = data.user || data.data?.user || { email }
  localStorage.setItem('user', JSON.stringify(user))
  
  axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
  setUser(user)
  toast.success(`Welcome back!`)
  navigate('/dashboard')
}
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    navigate('/login')
    toast.success('Logged out successfully.')
  }

  const hasRole = (...roles) => roles.includes(user?.role)

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
