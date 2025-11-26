import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActiveProfile } from '../services/profileManager'
import { getProfile } from '../services/auth'

function ProfileCard({ name: _name, title: _title, bio: _bio }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [authUser, setAuthUser] = useState(null)

  useEffect(() => {
    try {
      const activeProfile = getActiveProfile()
      if (activeProfile && activeProfile.data) {
        setProfile(activeProfile.data)
      }
      
      const user = getProfile()
      if (user) {
        setAuthUser(user)
      }
    } catch (e) {
      setProfile(null)
      setAuthUser(null)
    }
  }, [])

  const displayName = profile ? (profile.displayName || profile.firstName || _name || 'User') : (_name || 'User')
  const username = authUser ? (authUser.username || 'username') : 'username'
  const avatar = profile ? profile.avatar : null
  const firstLetter = displayName.charAt(0).toUpperCase()

  const handleClick = () => {
    if (username && username !== 'username') {
      navigate(`/u/${username}`)
    }
  }

  return (
    <div 
      className="profile-card d-flex align-items-center p-3"
      onClick={handleClick}
      style={{ cursor: username && username !== 'username' ? 'pointer' : 'default' }}
    >
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
      </div>
    </div>
  )
}

export default ProfileCard
