import React from 'react'
import Sidebar from '../components/Sidebar'
import './dashboard.css'

function Links() {
  return (
    <div className="dashboard-shell p-4">
      <div className="dashboard-card d-flex">
        <Sidebar />

        <main className="dashboard-main p-4">
          <div className="links-card p-4">
            <h4 className="mb-1">Link your social media profiles.</h4>
            <p className="text-muted small mb-3">Pick a social media to add to your profile.</p>

            <div className="social-icons d-flex gap-3">
              <button className="social-icon instagram" aria-label="Instagram">IG</button>
              <button className="social-icon facebook" aria-label="Facebook">f</button>
              <button className="social-icon x" aria-label="X">X</button>
              <button className="social-icon spotify" aria-label="Spotify">S</button>
            </div>
          </div>

          <div style={{ height: 420 }}></div>
        </main>
      </div>
    </div>
  )
}

export default Links
