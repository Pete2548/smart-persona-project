import React from 'react'

function ProfileCard({ name = 'Kotchakorn', title = 'Product Designer', bio = 'Make beautiful micro-interactions.' }) {
  return (
    <div className="profile-card d-flex align-items-center p-3">
      <div className="avatar me-3">
        <div className="avatar-inner">K</div>
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
