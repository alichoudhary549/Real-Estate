import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api' })

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const signup = async ({ name, email, password }) => {
    const res = await api.post('/auth/signup', { name, email, password })
    setToken(res.data.token)
    setUser(res.data.user)
    return res
  }

  const login = async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password })
    setToken(res.data.token)
    setUser(res.data.user)
    return res
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const googleLogin = async (idToken) => {
    const res = await api.post('/auth/google', { idToken })
    setToken(res.data.token)
    setUser(res.data.user)
    return res
  }

  const forgotPassword = async (email) => api.post('/auth/forgot-password', { email })
  const resetPassword = async (token, password) => api.post('/auth/reset-password', { token, password })

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout, googleLogin, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
