import React from 'react'

function StatsCard({ views = 1245, clicks = 342, shares = 28 }) {
  return (
    <div className="stats-card p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="m-0">Basic Metrics</h6>
        <small className="text-muted">Last 30 days</small>
      </div>

      <div className="row text-center">
        <div className="col">
          <div className="stat-value fw-bold">{views}</div>
          <div className="text-muted small">Views</div>
        </div>
        <div className="col">
          <div className="stat-value fw-bold">{clicks}</div>
          <div className="text-muted small">Link Clicks</div>
        </div>
        <div className="col">
          <div className="stat-value fw-bold">{shares}</div>
          <div className="text-muted small">Shares</div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
