import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../pages/dashboard.css'

function Sidebar() {
  // Read saved profile from localStorage to build the view-profile link
  let profile = null
  try {
    const raw = localStorage.getItem('user_profile')
    profile = raw ? JSON.parse(raw) : null
  } catch (err) {
    // if parsing fails, log and continue with null
    console.warn('Failed to read user_profile from localStorage', err)
    profile = null
  }

  const viewPath = profile && profile.username ? `/u/${profile.username}` : '/customize'

  return (
    <aside className="dashboard-sidebar d-flex flex-column">
      <div className="sidebar-top p-3">
        <div className="logo fw-bold fs-4">VERE</div>
      </div>

      <nav className="sidebar-nav flex-grow-1">
        <ul className="list-unstyled m-0 p-2">
          <li className="nav-item mb-3">
            <NavLink to="/dashboard" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-speedometer2 fs-4 me-2"></i>
              <span className="nav-label">dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink to="/customize" className={({isActive}) => `d-flex align-items-center text-decoration-none text-dark nav-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-pencil-square fs-4 me-2"></i>
              <span className="nav-label">customize</span>
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
          <Link to={viewPath} className="btn view-profile-btn w-100 d-flex align-items-center justify-content-center">
            <i className="bi bi-eye me-2"></i>
            <span>View Profile</span>
          </Link>
        </div>

        <button className="btn btn-dark w-100 share-btn mb-3">Share Your Profile</button>

        <div className="profile d-flex align-items-center">
          <i className="bi bi-person-circle fs-4 me-2"></i>
          <div className="flex-grow-1">
            <div className="profile-name">Kotchakorn</div>
          </div>
          <i className="bi bi-three-dots"></i>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
