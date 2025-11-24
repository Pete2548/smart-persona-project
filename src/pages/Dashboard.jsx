import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ProfileCard from '../components/ProfileCard'
import StatsCard from '../components/StatsCard'
import './dashboard.css'

function Dashboard() {
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    // Load recent activity
    try {
      const activity = localStorage.getItem('recent_activity')
      if (activity) {
        setRecentActivity(JSON.parse(activity))
      } else {
        // Sample activity data
        const sampleActivity = [
          { id: 1, action: 'Profile updated', time: '2 hours ago' },
          { id: 2, action: 'New theme applied', time: '1 day ago' },
          { id: 3, action: 'Profile viewed', time: '2 days ago' }
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
              <div className="mt-3 p-3 card-like">
                <h6 className="mb-3">Profile Overview</h6>
                <p className="text-muted small">
                  Your profile is live and can be viewed by others. Share your unique link to increase visibility and engagement.
                </p>
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span className="small">Profile Completeness</span>
                    <span className="fw-bold">85%</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span className="small">Total Links</span>
                    <span className="fw-bold">0</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span className="small">Theme Applied</span>
                    <span className="fw-bold">Custom</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="p-3 card-like">
                <h6 className="mb-3">Recent Activity</h6>
                {recentActivity.length > 0 ? (
                  <div>
                    {recentActivity.map(item => (
                      <div key={item.id} className="mb-3 pb-2 border-bottom">
                        <div className="small fw-bold">{item.action}</div>
                        <div className="text-muted" style={{ fontSize: '12px' }}>{item.time}</div>
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
