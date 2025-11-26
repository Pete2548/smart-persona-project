import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import ProfileCard from '../components/ProfileCard'
import StatsCard from '../components/StatsCard'
import { getActiveProfile, getAllProfiles } from '../services/profileManager'
import './dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [recentActivity, setRecentActivity] = useState([])
  const [profile, setProfile] = useState(null)
  const [profileStats, setProfileStats] = useState({
    completeness: 0,
    totalSocialLinks: 0,
    themeName: 'Custom',
    hasAvatar: false,
    hasDescription: false,
    hasUsername: false
  })

  useEffect(() => {
    // Load active profile and calculate stats
    try {
      const activeProfile = getActiveProfile()
      if (activeProfile && activeProfile.data) {
        const data = activeProfile.data
        setProfile(data)
        
        // Calculate profile completeness
        let completeness = 0
        if (data.username) completeness += 20
        if (data.displayName || data.firstName) completeness += 15
        if (data.description) completeness += 20
        if (data.avatar) completeness += 15
        if (data.bgColor || data.bgImage) completeness += 10
        if (data.socialLinks) {
          const linkedSocials = Object.values(data.socialLinks).filter(link => link && link.trim() !== '')
          completeness += Math.min(linkedSocials.length * 4, 20)
        }
        
        // Get social links count
        const socialLinks = data.socialLinks || {}
        const totalSocialLinks = Object.values(socialLinks).filter(link => link && link.trim() !== '').length
        
        // Get theme name
        let themeName = 'Custom'
        if (data.bgImage) themeName = 'Custom Background'
        if (data.layout) {
          const layoutNames = {
            'default': 'Default Card',
            'linktree': 'Linktree Style',
            'linkedin': 'LinkedIn Pro',
            'guns': 'Neon Style',
            'minimal': 'Minimal Clean'
          }
          themeName = layoutNames[data.layout] || 'Custom'
        }
        
        setProfileStats({
          completeness: Math.min(completeness, 100),
          totalSocialLinks,
          themeName,
          hasAvatar: !!data.avatar,
          hasDescription: !!data.description,
          hasUsername: !!data.username
        })
      }
    } catch (err) {
      console.warn('Failed to load profile', err)
    }

    // Load recent activity
    try {
      const activity = localStorage.getItem('recent_activity')
      if (activity) {
        setRecentActivity(JSON.parse(activity))
      } else {
        // Sample activity data
        const sampleActivity = [
          { id: 1, action: 'Profile created', time: 'Just now', icon: 'bi-person-plus' },
          { id: 2, action: 'Welcome to VERE!', time: 'Today', icon: 'bi-star' }
        ]
        setRecentActivity(sampleActivity)
        localStorage.setItem('recent_activity', JSON.stringify(sampleActivity))
      }
    } catch (err) {
      console.warn('Failed to load activity', err)
    }
  }, [])

  return (
    <div className="dashboard-shell p-4">
      <div className="dashboard-card d-flex">
        <Sidebar />

        <main className="dashboard-main p-4">
          <div className="d-flex justify-content-start align-items-start mb-4">
            <ProfileCard />
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-8">
              <StatsCard />
              
              {/* Profile Overview */}
              <div className="mt-3 p-3 card-like">
                <h6 className="mb-3">Profile Overview</h6>
                <p className="text-muted small">
                  Your profile is live and can be viewed by others. Share your unique link to increase visibility and engagement.
                </p>
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span className="small">Profile Completeness</span>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ 
                        width: '100px', 
                        height: '8px', 
                        background: '#e5e7eb', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${profileStats.completeness}%`, 
                          height: '100%', 
                          background: profileStats.completeness >= 80 ? '#22c55e' : profileStats.completeness >= 50 ? '#f59e0b' : '#ef4444',
                          borderRadius: '4px',
                          transition: 'width 0.3s'
                        }}></div>
                      </div>
                      <span className="fw-bold">{profileStats.completeness}%</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span className="small">Social Links</span>
                    <span className="fw-bold">{profileStats.totalSocialLinks}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span className="small">Theme Applied</span>
                    <span className="fw-bold">{profileStats.themeName}</span>
                  </div>
                </div>
              </div>

              {/* Profile Checklist */}
              {profileStats.completeness < 100 && (
                <div className="mt-3 p-3 card-like">
                  <h6 className="mb-3">
                    <i className="bi bi-list-check me-2"></i>
                    Complete Your Profile
                  </h6>
                  <div className="small">
                    {!profileStats.hasUsername && (
                      <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                        <i className="bi bi-circle"></i>
                        <span>Add a username</span>
                      </div>
                    )}
                    {!profileStats.hasAvatar && (
                      <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                        <i className="bi bi-circle"></i>
                        <span>Upload a profile picture</span>
                      </div>
                    )}
                    {!profileStats.hasDescription && (
                      <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                        <i className="bi bi-circle"></i>
                        <span>Write a bio description</span>
                      </div>
                    )}
                    {profileStats.totalSocialLinks === 0 && (
                      <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                        <i className="bi bi-circle"></i>
                        <span>Add social media links</span>
                      </div>
                    )}
                    {profileStats.hasUsername && profileStats.hasAvatar && profileStats.hasDescription && profileStats.totalSocialLinks > 0 && (
                      <div className="d-flex align-items-center gap-2 mb-2 text-success">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Looking great! Keep it up!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="col-12 col-lg-4">
              <div className="p-3 card-like">
                <h6 className="mb-3">Recent Activity</h6>
                {recentActivity.length > 0 ? (
                  <div>
                    {recentActivity.map(item => (
                      <div key={item.id} className="mb-3 pb-2 border-bottom last:border-0">
                        <div className="d-flex align-items-start gap-2">
                          {item.icon && <i className={`${item.icon} text-primary`}></i>}
                          <div className="flex-grow-1">
                            <div className="small fw-bold">{item.action}</div>
                            <div className="text-muted" style={{ fontSize: '12px' }}>{item.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted small">No recent activity yet.</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
