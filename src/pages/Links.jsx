import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import LoginModal from '../components/LoginModal'
import { getCurrentUser } from '../services/auth'
import './dashboard.css'
import Image from "react-bootstrap/Image";
import ig from "../img/ig.png";
import facebook from "../img/facebook.png";
import x from "../img/twitter.png";
import spotify from "../img/spotify.png";

function Links() {
  const navigate = useNavigate()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleSwitchToSignup = () => {
    setShowLoginModal(false)
    navigate('/signup')
  }

  const handleSocialClick = () => {
    const user = getCurrentUser()
    if (!user) {
      setShowLoginModal(true)
      return
    }
    alert('Social media linking feature - available for logged in users!')
  }
  return (
    <div className="dashboard-shell p-4">
      <div className="dashboard-card d-flex">
        <Sidebar />

        <main className="dashboard-main p-4">
          <div className="links-card p-4">
            <h4 className="mb-1">Link your social media profiles.</h4>
            <p className="text-muted small mb-3">Pick a social media to add to your profile.</p>

            <div className="social-icons d-flex gap-3">
              <Image
                  src={ig}
                  rounded
                  style={{ width: "49px", height: "49px", cursor: "pointer" }}
                  onClick={handleSocialClick}
                />
              <Image
                  src={facebook}
                  rounded
                  style={{ width: "49px", height: "49px", cursor: "pointer" }}
                  onClick={handleSocialClick}
                />
              <Image
                  src={x}
                  rounded
                  style={{ width: "49px", height: "49px", cursor: "pointer" }}
                  onClick={handleSocialClick}
                />
              <Image
                  src={spotify}
                  rounded
                  style={{ width: "49px", height: "49px", cursor: "pointer" }}
                  onClick={handleSocialClick}
                />
            </div>
          </div>

          <div style={{ height: 420 }}></div>
        </main>
      </div>

      <LoginModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
    </div>
  )
}

export default Links
