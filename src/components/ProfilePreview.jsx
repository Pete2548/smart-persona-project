import React from 'react'

function ProfilePreview({ applied, appliedAvatar }) {
  return (
    <div>
      <div className="profile-card d-flex align-items-center p-2 mb-3">
        <div className="avatar me-3">
          {appliedAvatar ? (
            <img src={appliedAvatar} alt="avatar" style={{width:60, height:60, borderRadius: '50%'}} />
          ) : (
            <div className="avatar-inner">K</div>
          )}
        </div>
        <div>
          <div className="fw-bold">Kotchakorn</div>
          <div className="text-muted small">Product Designer</div>
        </div>
      </div>

      <div className="p-2" style={{ minHeight: 140, borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)' }}>
        {applied ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{applied}</div>
        ) : (
          <div className="text-muted small">Generated bio/preview will appear here when you click Apply.</div>
        )}
      </div>
    </div>
  )
}

export default ProfilePreview
