import React, { useState, useEffect } from 'react'
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
import discord from "../img/discord.png";
import google from "../img/google.png";
import Line from "../img/Line.png";
import tiktok from "../img/tiktok.png";
import github from "../img/github.png";
import AddSocialModal from '../components/AddSocialModal'

function Links() {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedSocial, setSelectedSocial] = useState('')
  const [links, setLinks] = useState({ ig: '', facebook: '', x: '', spotify: '', discord: '', google: '', line: '', tiktok: '', github: '' })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('socialLinks')
      if (raw) setLinks(JSON.parse(raw))
    } catch (e) {
      console.error('load social links', e)
    }
  }, [])

  const openModal = (social) => {
    setSelectedSocial(social)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedSocial('')
  }

  // Always open the modal when an icon is clicked (matches requested UX)
  const handleSocialClick = (social) => {
    openModal(social)
  }

  const handleAdd = (social, url) => {
    const next = { ...links, [social]: url }
    setLinks(next)
    try { localStorage.setItem('socialLinks', JSON.stringify(next)) } catch (e) { console.error(e) }
  }


  return (
    <div className="dashboard-shell p-4">
      <div className="dashboard-card d-flex">
        <Sidebar />

        <main className="dashboard-main p-4">
          <div className="links-card p-4">
            <h4 className="mb-1">Link your social media profiles.</h4>
            <p className="text-muted small mb-3">Pick a social media to add to your profile.</p>
            <div className="social-icons d-flex gap-3" style={{ position: 'relative' }}>
              <button className="btn p-0" onClick={() => handleSocialClick('ig')} title={links.ig ? links.ig : 'Add Instagram'}>
                <Image src={ig} rounded className="social-img" />
              </button>

              <button className="btn p-0" onClick={() => handleSocialClick('facebook')} title={links.facebook ? links.facebook : 'Add Facebook'}>
                <Image src={facebook} rounded className="social-img" />
              </button>

              <button className="btn p-0" onClick={() => handleSocialClick('x')} title={links.x ? links.x : 'Add X / Twitter'}>
                <Image src={x} rounded className="social-img" />
              </button>

              <button className="btn p-0" onClick={() => handleSocialClick('spotify')} title={links.spotify ? links.spotify : 'Add Spotify'}>
                <Image src={spotify} rounded className="social-img" />
              </button>

              <button className="btn p-0" onClick={() => handleSocialClick('discord')} title={links.discord ? links.discord : 'Add Discord'}>
                <Image src={discord} rounded className="social-img" />
              </button>

              <button className="btn p-0" onClick={() => handleSocialClick('google')} title={links.google ? links.google : 'Add Google'}>
                <Image src={google} rounded className="social-img" />
              </button>

              <button className="btn p-0" onClick={() => handleSocialClick('line')} title={links.line ? links.line : 'Add Line'}>
                <Image src={Line} rounded className="social-img" />
              </button>

              <button className="btn p-0" onClick={() => handleSocialClick('tiktok')} title={links.tiktok ? links.tiktok : 'Add TikTok'}>
                <Image src={tiktok} rounded className="social-img" />
              </button>

              <button className="btn p-0" onClick={() => handleSocialClick('github')} title={links.github ? links.github : 'Add GitHub'}>
                <Image src={github} rounded className="social-img" />
              </button>

              <AddSocialModal
                social={selectedSocial}
                visible={modalVisible}
                onClose={closeModal}
                onAdd={handleAdd}
                defaultValue={selectedSocial ? links[selectedSocial] || '' : ''}
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
