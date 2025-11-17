import React from 'react'
import Sidebar from '../components/Sidebar'
import ProfileCard from '../components/ProfileCard'
import StatsCard from '../components/StatsCard'
import './dashboard.css'

function Dashboard() {
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
              <div className="mt-3 content-placeholder p-3">Detailed widgets / analytics go here</div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="p-3 card-like">
                <h6 className="mb-3">Recent Activity</h6>
                <div className="text-muted small">No recent activity — this is sample data.</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
