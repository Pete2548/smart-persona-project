import React, { useEffect, useState } from 'react'
import { getProfile } from '../services/auth'

function ProfileCard({ name: _name, title: _title, bio: _bio }) {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    try {
      const p = getProfile()
      if (p) setProfile(p)
    } catch (e) {
      setProfile(null)
    }
  }, [])

  const name = profile ? (profile.firstName || profile.username || _name || 'Kotchakorn') : (_name || 'Kotchakorn')
  const title = profile ? (profile.title || _title || 'Product Designer') : (_title || 'Product Designer')
  const bio = profile ? (profile.description || _bio || 'Make beautiful micro-interactions.') : (_bio || 'Make beautiful micro-interactions.')

  const initial = (profile && (profile.firstName || profile.username)) ? (profile.firstName ? profile.firstName.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()) : 'K'

  return (
    <div className="profile-card d-flex align-items-center p-3">
      <div className="avatar me-3">
        <div className="avatar-inner">{initial}</div>
      </div>

      <div className="profile-meta">
        <div className="profile-name fw-bold">{name}</div>
        <div className="profile-title text-muted">{title}</div>
        <div className="profile-bio small mt-2 text-muted">{bio}</div>
      </div>
    </div>
  )
}

export default ProfileCard
