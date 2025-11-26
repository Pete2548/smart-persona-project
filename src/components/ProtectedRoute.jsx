import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/auth'
import LoginModal from './LoginModal'

/**
 * ProtectedRoute: Wrapper component that requires authentication
 * Shows LoginModal if user is not logged in
 */
function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      setShowModal(true)
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)
    }
    setIsChecking(false)
  }, [])

  const handleCloseModal = () => {
    setShowModal(false)
    navigate('/')
  }

  const handleSwitchToSignup = () => {
    setShowModal(false)
    navigate('/signup')
  }

  // Don't render anything while checking authentication
  if (isChecking) {
    return null
  }

  // If not authenticated, show login modal and prevent rendering children
  if (!isAuthenticated && showModal) {
    return (
      <LoginModal 
        onClose={handleCloseModal}
        onSwitchToSignup={handleSwitchToSignup}
      />
    )
  }

  // If authenticated, render the protected content
  return children
}

export default ProtectedRoute
