import React, { useState, useEffect } from 'react'

function StatsCard() {
  const [stats, setStats] = useState({ views: 0, clicks: 0, shares: 0 })

  useEffect(() => {
    // Load stats from localStorage
    try {
      const savedStats = localStorage.getItem('profile_stats')
      if (savedStats) {
        setStats(JSON.parse(savedStats))
      } else {
        // Generate random initial stats for demo
        const randomStats = {
          views: Math.floor(Math.random() * 2000) + 500,
          clicks: Math.floor(Math.random() * 500) + 100,
          shares: Math.floor(Math.random() * 50) + 10
        }
        setStats(randomStats)
        localStorage.setItem('profile_stats', JSON.stringify(randomStats))
      }
    } catch (err) {
      console.warn('Failed to load stats', err)
    }
  }, [])

  return (
    <div className="stats-card p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="m-0">Basic Metrics</h6>
        <small className="text-muted">Last 30 days</small>
      </div>

      <div className="row text-center">
        <div className="col">
          <div className="stat-value fw-bold">{stats.views}</div>
          <div className="text-muted small">Views</div>
        </div>
        <div className="col">
          <div className="stat-value fw-bold">{stats.clicks}</div>
          <div className="text-muted small">Link Clicks</div>
        </div>
        <div className="col">
          <div className="stat-value fw-bold">{stats.shares}</div>
          <div className="text-muted small">Shares</div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
