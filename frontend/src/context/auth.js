import React, { useState } from 'react'
import axios from 'axios'
import { useLocation, Navigate } from 'react-router-dom'

export const AuthContext = React.createContext(null)

const AuthProv = {
  isAuthenticated: false,
  signin(callback) {
    AuthProv.isAuthenticated = true
    setTimeout(callback, 100) // fake async
  },
  signout(callback) {
    const { data } = axios.get('/isAuth')
    setTimeout(callback, 100)
  },
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const signin = (newUser, callback) => (
    AuthProv.signin(() => {
      setUser(newUser)
      callback()
    })
  )

  const signout = callback => (
    AuthProv.signout(() => {
      setUser(null)
      callback()
    })
  )

  const value = { user, signin, signout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => (React.useContext(AuthContext))

export const RequireAuth = ({ children }) => {
  const auth = useAuth()
  const location = useLocation()
  if (!auth.user) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  }
  return children
}
