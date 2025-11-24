import React, { useState, useEffect } from 'react'

function ProfileCard() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user_profile')
      if (raw) {
        setProfile(JSON.parse(raw))
      }
    } catch (err) {
      console.warn('Failed to load profile', err)
    }
  }, [])

  const displayName = profile?.displayName || profile?.username || 'Guest'
  const username = profile?.username || 'user'
  const description = profile?.description || 'No description yet.'
  const avatar = profile?.avatar
  const firstLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className="profile-card d-flex align-items-center p-3">
      <div className="avatar me-3">
        {avatar ? (
          <img 
            src={avatar} 
            alt={displayName}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div className="avatar-inner">{firstLetter}</div>
        )}
      </div>

      <div className="profile-meta">
        <div className="profile-name fw-bold">{displayName}</div>
        <div className="profile-title text-muted">@{username}</div>
        <div className="profile-bio small mt-2 text-muted">{description}</div>
      </div>
    </div>
  )
}

export default ProfileCard
