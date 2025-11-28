import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { getCurrentUser } from '../services/auth'
import { getActiveProfile, updateProfile } from '../services/profileManager'
import { getCurrentUserProfessionalProfile } from '../services/professionalProfileManager'
import LoginModal from './LoginModal'
import '../pages/dashboard.css'

function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [activeProfileRecord, setActiveProfileRecord] = useState(null)
  const [legacyProfile, setLegacyProfile] = useState(null)
  const [viewPath, setViewPath] = useState('/customize')
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false)
  const [professionalProfileData, setProfessionalProfileData] = useState(null)

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

  useEffect(() => {
    loadSidebarProfile()
    loadProfessionalProfile()
  }, [])

  const loadSidebarProfile = () => {
    try {
      const activeProfile = getActiveProfile()
      if (activeProfile?.data) {
        setActiveProfileRecord(activeProfile)
        setLegacyProfile(null)
        if (activeProfile.data.username) {
          let nextViewPath = `/u/${activeProfile.data.username}`
          if (activeProfile.type) {
            nextViewPath = `/u/${activeProfile.data.username}/${activeProfile.type}`
          }
          setViewPath(nextViewPath)
        } else {
          setViewPath('/customize')
        }
        return
      }

      const raw = localStorage.getItem('user_profile')
      const fallback = raw ? JSON.parse(raw) : null
      setLegacyProfile(fallback)
      setActiveProfileRecord(null)
      if (fallback?.username) {
        setViewPath(`/u/${fallback.username}`)
      } else {
        setViewPath('/customize')
      }
    } catch (err) {
      console.warn('Failed to read profile', err)
      setActiveProfileRecord(null)
      setLegacyProfile(null)
      setViewPath('/customize')
    }
  }

  const loadProfessionalProfile = () => {
    try {
      const professionalProfile = getCurrentUserProfessionalProfile()
      if (professionalProfile?.data) {
        setProfessionalProfileData(professionalProfile.data)
        if (professionalProfile.data.username) {
          setViewPath(`/pro/${professionalProfile.data.username}`)
        }
      } else {
        setProfessionalProfileData(null)
      }
    } catch (err) {
      console.warn('Failed to load professional profile', err)
      setProfessionalProfileData(null)
    }
  }

  const profile = activeProfileRecord?.data || legacyProfile || null
  const displayProfile = professionalProfileData || profile

  const handleVisibilityChange = (makePublic) => {
    if (!profile || isUpdatingVisibility) return
    const nextValue = !!makePublic
    const currentValue = profile.isPublic !== false
    if (currentValue === nextValue) return

    if (!nextValue) {
      const confirmed = window.confirm(t('confirm_private_profile', { defaultValue: 'Hide this profile from public view?' }))
      if (!confirmed) return
    }

    setIsUpdatingVisibility(true)
    try {
      if (activeProfileRecord?.id) {
        const updated = updateProfile(activeProfileRecord.id, { isPublic: nextValue })
        setActiveProfileRecord(updated)
      } else if (legacyProfile) {
        const updatedLegacy = { ...legacyProfile, isPublic: nextValue }
        localStorage.setItem('user_profile', JSON.stringify(updatedLegacy))
        setLegacyProfile(updatedLegacy)
      }
    } catch (err) {
      console.error('Failed to update visibility', err)
    } finally {
      setIsUpdatingVisibility(false)
    }
  }

  return (
    <aside className="dashboard-sidebar d-flex flex-column">
      <div className="sidebar-top p-3">
        <div className="logo fw-bold fs-4">VERE</div>
      </div>
      <nav className="sidebar-nav flex-grow-1">
        <ul className="list-unstyled m-0 p-2">
          <li className="nav-item mb-3">
            <NavLink to="/my-profile" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-person-circle fs-4 me-2"></i>
              <span className="nav-label">{t('professional_profile')}</span>
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <a 
              href="/dashboard" 
              onClick={(e) => handleProtectedAction(e, '/dashboard')}
              className="d-flex align-items-center text-decoration-none text-dark nav-link"
            >
              <i className="bi bi-speedometer2 fs-4 me-2"></i>
              <span className="nav-label">{t('dashboard')}</span>
            </a>
          </li>
          <li className="nav-item mb-3">
            <NavLink to="/explore" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-search fs-4 me-2"></i>
              <span className="nav-label">{t('explore_people')}</span>
            </NavLink>
          </li>
          
          <li><hr className="my-3" /></li>
          
          <li className="nav-item mb-3">
            <NavLink to="/my-profiles" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-collection fs-4 me-2"></i>
              <span className="nav-label">{t('my_links')}</span>
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink to="/customize" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-pencil-square fs-4 me-2"></i>
              <span className="nav-label">{t('customize')}</span>
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink to="/themes" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-palette fs-4 me-2"></i>
              <div className="d-flex align-items-center justify-content-between flex-grow-1">
                <span className="nav-label">{t('themes')}</span>
                <span 
                  className="badge bg-warning text-dark"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}
                >
                  Creative
                </span>
              </div>
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink to="/saved-profiles" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-heart fs-4 me-2"></i>
              <span className="nav-label">{t('saved_profiles')}</span>
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink to="/links" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-link-45deg fs-4 me-2"></i>
              <span className="nav-label">{t('links')}</span>
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
            <span>{t('view_profile')}</span>
          </button>
        </div>

        <div className="profile d-flex align-items-center">
          {displayProfile && displayProfile.avatar ? (
            <img 
              src={displayProfile.avatar} 
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
            <div className="profile-name">{displayProfile?.displayName || displayProfile?.username || 'Guest'}</div>
          </div>
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="link" 
              bsPrefix="p-0"
              className="text-dark text-decoration-none border-0 bg-transparent"
              style={{ boxShadow: 'none' }}
            >
              <i className="bi bi-three-dots fs-5"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate('/settings')}>
                <i className="bi bi-gear me-2"></i>
                {t('settings')}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => {
                localStorage.removeItem('currentUser');
                navigate('/');
                window.location.reload();
              }} className="text-danger">
                <i className="bi bi-box-arrow-right me-2"></i>
                {t('logout')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
