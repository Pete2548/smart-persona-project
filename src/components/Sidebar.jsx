import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/auth'
import { getActiveProfile } from '../services/profileManager'
import LoginModal from './LoginModal'
import '../pages/dashboard.css'

function Sidebar() {
  const navigate = useNavigate()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleProtectedAction = (e, path) => {
    e.preventDefault()
    const user = getCurrentUser()
    if (!user) {
      setShowLoginModal(true)
    } else {
      navigate(path)
    }
  }

  const handleProtectedClick = (callback) => {
    const user = getCurrentUser()
    if (!user) {
      setShowLoginModal(true)
    } else {
      callback()
    }
  }

  const handleSwitchToSignup = () => {
    setShowLoginModal(false)
    navigate('/signup')
  }

  // Read active profile from multi-profile system
  let profile = null
  let viewPath = '/customize'
  
  try {
    const activeProfile = getActiveProfile()
    if (activeProfile && activeProfile.data) {
      profile = activeProfile.data
      if (profile.username) {
        viewPath = `/u/${profile.username}`
        if (activeProfile.type) {
          viewPath = `/u/${profile.username}/${activeProfile.type}`
        }
      }
    } else {
      // Fallback to old single profile system
      const raw = localStorage.getItem('user_profile')
      profile = raw ? JSON.parse(raw) : null
      if (profile && profile.username) {
        viewPath = `/u/${profile.username}`
      }
    }
  } catch (err) {
    console.warn('Failed to read profile', err)
    profile = null
  }

  return (
    <aside className="dashboard-sidebar d-flex flex-column">
      <div className="sidebar-top p-3">
        <div className="logo fw-bold fs-4">VERE</div>
      </div>

      <nav className="sidebar-nav flex-grow-1">
        <ul className="list-unstyled m-0 p-2">
          <li className="nav-item mb-3">
            <a 
              href="/dashboard" 
              onClick={(e) => handleProtectedAction(e, '/dashboard')}
              className="d-flex align-items-center text-decoration-none text-dark nav-link"
            >
              <i className="bi bi-speedometer2 fs-4 me-2"></i>
              <span className="nav-label">dashboard</span>
            </a>
          </li>
          <li className="nav-item mb-3">
            <NavLink to="/my-profiles" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-collection fs-4 me-2"></i>
              <span className="nav-label">my profiles</span>
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink to="/customize" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-pencil-square fs-4 me-2"></i>
              <span className="nav-label">customize</span>
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink to="/themes" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-palette fs-4 me-2"></i>
              <span className="nav-label">themes</span>
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink to="/links" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-link-45deg fs-4 me-2"></i>
              <span className="nav-label">links</span>
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink to="/ai-create" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-robot fs-4 me-2"></i>
              <span className="nav-label">ai create</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer p-3">
        <div className="mb-3">
          <button 
            onClick={() => handleProtectedClick(() => window.open(viewPath, '_blank'))}
            className="btn view-profile-btn w-100 d-flex align-items-center justify-content-center"
          >
            <i className="bi bi-eye me-2"></i>
            <span>View Profile</span>
          </button>
        </div>

        <button 
          onClick={() => handleProtectedClick(() => alert('Share feature'))}
          className="btn btn-dark w-100 share-btn mb-3"
        >
          Share Your Profile
        </button>

        <div className="profile d-flex align-items-center">
          {profile && profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt="profile" 
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: 8
              }}
            />
          ) : (
            <i className="bi bi-person-circle fs-4 me-2"></i>
          )}
          <div className="flex-grow-1">
            <div className="profile-name">{profile?.displayName || profile?.username || 'Guest'}</div>
          </div>
          <i className="bi bi-three-dots"></i>
        </div>
      </div>

      <LoginModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
    </aside>
  )
}

export default Sidebar
