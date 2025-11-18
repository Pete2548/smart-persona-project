import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './profileview.css'

const ProfileView = () => {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // load saved profile
    try {
      const raw = localStorage.getItem('user_profile')
      if (raw) {
        const p = JSON.parse(raw)
        if (!username || p.username === username) {
          setProfile(p)
          return
        }
      }
    } catch (err) {
      // ignore
    }
    setProfile(null)
  }, [username])

  if (!profile) {
    return (
      <div className="profile-view-wrapper">
        <div className="profile-empty-card">Profile not found</div>
      </div>
    )
  }
  const cardStyle = {
    background: profile.blockColor || undefined,
  }

  // helper to create rgba shadow from hex
  const hexToRgba = (hex, alpha) => {
    if (!hex) return `rgba(30,111,184,${alpha})`
    const h = hex.replace('#','')
    const normalized = h.length === 3 ? h.split('').map(c=>c+c).join('') : h
    const bigint = parseInt(normalized, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r},${g},${b},${alpha})`
  }

  // build a multi-layered glow (strong neon / soft halo) from hex color
  const buildTextGlow = (hex) => {
    const c1 = hexToRgba(hex, 0.95) // inner bright
    const c2 = hexToRgba(hex, 0.6)  // mid glow
    const c3 = hexToRgba(hex, 0.35) // outer glow
    const dark1 = 'rgba(0,0,0,0.7)'
    const dark2 = 'rgba(0,0,0,0.45)'
    return [
      `0 2px 0 ${dark1}`,
      `0 6px 14px ${dark2}`,
      `0 0 6px ${c1}`,
      `0 0 18px ${c2}`,
      `0 0 40px ${c3}`,
      `0 0 90px ${c3}`,
    ].join(', ')
  }

  // compute relative luminance of a hex color (0..1)
  const hexLuminance = (hex) => {
    if (!hex) return 0
    const h = hex.replace('#','')
    const normalized = h.length === 3 ? h.split('').map(c=>c+c).join('') : h
    const bigint = parseInt(normalized, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    // sRGB luminance
    const srgb = [r,g,b].map(v => {
      const s = v/255
      return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4)
    })
    return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2]
  }

  const usernameStyle = {
    color: profile.nameColor || undefined,
    textShadow: buildTextGlow(profile.nameColor)
  }

  // description color: use saved descColor if present, otherwise pick dark or light based on page background luminance
  const bg = profile.bgColor || '#050505'
  const descColor = profile.descColor ? profile.descColor : (hexLuminance(bg) > 0.6 ? 'rgba(17,24,39,0.9)' : 'rgba(255,255,255,0.85)')


  const wrapperStyle = profile && profile.bgImage ? (() => {
    const overlay = typeof profile.bgOverlay === 'number' ? profile.bgOverlay : 0.3
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,${overlay}), rgba(0,0,0,${overlay})), url(${profile.bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      padding: '48px 16px'
    }
  })() : { background: profile.bgColor || '#050505' }

  return (
    <div className="profile-view-wrapper" style={wrapperStyle}>
      <div className="profile-card" style={cardStyle}>
        <div className="profile-center">
            {profile.avatar && (
              <img src={profile.avatar} alt="avatar" className="avatar-circle" style={{
                boxShadow: `0 12px 36px ${hexToRgba(profile.nameColor, 0.28)}`,
                border: `4px solid ${hexToRgba(profile.nameColor, 0.12)}`
              }} />
            )}
          <div className="username-glow" style={usernameStyle}>{profile.username}</div>
            <div className="profile-description" style={{color: descColor, marginTop: 8, fontSize: 16, textAlign: 'center'}}>{profile.description}</div>
        </div>
        {/* profile-right removed per user request (no copy link) */}
      </div>
    </div>
  )
}

export default ProfileView
