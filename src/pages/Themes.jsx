import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import './dashboard.css'
import './themes.css'

const Themes = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Empty themes array - ready for you to add themes
  const themes = []

  const applyTheme = (theme) => {
    try {
      const raw = localStorage.getItem('user_profile')
      const profile = raw ? JSON.parse(raw) : {}
      
      const updatedProfile = {
        ...profile,
        bgColor: theme.config.bgColor,
        blockColor: theme.config.blockColor,
        nameColor: theme.config.nameColor,
        descColor: theme.config.descColor
      }
      
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile))
      alert(`Theme "${theme.name}" applied! Go to Customize to see the changes.`)
    } catch (err) {
      console.error('Failed to apply theme', err)
      alert('Failed to apply theme')
    }
  }

  const filteredThemes = selectedFilter === 'all' 
    ? themes 
    : themes.filter(t => t.tags.includes(selectedFilter))

  return (
    <div className="dashboard-shell p-4">
      <div className="dashboard-card d-flex">
        <Sidebar />

        <main className="dashboard-main p-4">
          <div className="themes-container">
            <div className="themes-header">
              <div>
                <h2 className="themes-title">Discover the perfect Theme for your Profile</h2>
                <p className="themes-subtitle">Browse community-created themes, or design your own in Customize</p>
              </div>
            </div>

            <div className="themes-filters">
              <button 
                className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                All Themes
              </button>
              <button 
                className={`filter-btn ${selectedFilter === 'dark' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('dark')}
              >
                Dark
              </button>
              <button 
                className={`filter-btn ${selectedFilter === 'neon' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('neon')}
              >
                Neon
              </button>
              <button 
                className={`filter-btn ${selectedFilter === 'aesthetic' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('aesthetic')}
              >
                Aesthetic
              </button>
              <button 
                className={`filter-btn ${selectedFilter === 'free' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('free')}
              >
                Free
              </button>
            </div>

            <div className="themes-grid">
              {filteredThemes.length === 0 ? (
                <div className="no-themes">
                  <p>No themes available yet. Check back soon!</p>
                </div>
              ) : (
                filteredThemes.map(theme => (
                  <div key={theme.id} className="theme-card">
                    <div className="theme-preview">
                      <img src={theme.preview} alt={theme.name} />
                      {theme.trending && (
                        <div className="theme-badge">
                          <i className="bi bi-star-fill"></i> Trending
                        </div>
                      )}
                    </div>
                    <div className="theme-info">
                      <div className="theme-header">
                        <div className="theme-author">
                          <i className="bi bi-person-circle"></i>
                          <span>@{theme.author}</span>
                        </div>
                        <div className="theme-stats">
                          <span>{(theme.uses / 1000).toFixed(1)}k uses</span>
                        </div>
                      </div>
                      <h3 className="theme-name">{theme.name}</h3>
                      <div className="theme-tags">
                        {theme.tags.map(tag => (
                          <span key={tag} className="theme-tag">{tag}</span>
                        ))}
                      </div>
                      <button 
                        className="btn-use-theme"
                        onClick={() => applyTheme(theme)}
                      >
                        Use Theme
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Themes
