import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentUser, isAdmin } from '../services/auth'

export default function RequireAdmin({ children }) {
  const location = useLocation()
  const cur = getCurrentUser()
  // if not logged in or not admin, redirect to admin login
  if (!cur || !isAdmin()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
