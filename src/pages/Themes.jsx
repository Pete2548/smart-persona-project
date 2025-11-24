import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import LoginModal from '../components/LoginModal'
import { getCurrentUser } from '../services/auth'
import { getActiveProfile, updateProfile } from '../services/profileManager'
import './dashboard.css'
import './themes.css'

const Themes = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('themes') // 'themes' or 'layouts'
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleSwitchToSignup = () => {
    setShowLoginModal(false)
    navigate('/signup')
  }

  // Themes with different profile layouts inspired by popular platforms
  const themes = [
    {
      id: 1,
      name: 'Guns.lol Style',
      preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
      author: 'VERE',
      uses: 15200,
      trending: true,
      tags: ['dark', 'neon', 'free'],
      config: {
        bgColor: '#0a0a0a',
        blockColor: '#1a1a1a',
        nameColor: '#00ff88',
        descColor: '#888888'
      }
    },
    {
      id: 2,
      name: 'Linktree Classic',
      preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
      author: 'VERE',
      uses: 28400,
      trending: true,
      tags: ['aesthetic', 'free'],
      config: {
        bgColor: '#f5f5f5',
        blockColor: '#ffffff',
        nameColor: '#1a1a1a',
        descColor: '#666666'
      }
    },
    {
      id: 3,
      name: 'LinkedIn Pro',
      preview: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
      author: 'VERE',
      uses: 32100,
      trending: true,
      tags: ['aesthetic', 'free'],
      config: {
        bgColor: '#ffffff',
        blockColor: '#f3f6f8',
        nameColor: '#0a66c2',
        descColor: '#191919'
      }
    },
    {
      id: 4,
      name: 'Neon Cyberpunk',
      preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      author: 'VERE',
      uses: 18700,
      trending: false,
      tags: ['dark', 'neon', 'free'],
      config: {
        bgColor: '#0d0221',
        blockColor: '#1a1a2e',
        nameColor: '#ff006e',
        descColor: '#8338ec'
      }
    },
    {
      id: 5,
      name: 'Minimalist White',
      preview: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=300&fit=crop',
      author: 'VERE',
      uses: 21300,
      trending: false,
      tags: ['aesthetic', 'free'],
      config: {
        bgColor: '#ffffff',
        blockColor: '#fafafa',
        nameColor: '#2d3436',
        descColor: '#636e72'
      }
    },
    {
      id: 6,
      name: 'Dark Mode Pro',
      preview: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
      author: 'VERE',
      uses: 25600,
      trending: true,
      tags: ['dark', 'free'],
      config: {
        bgColor: '#121212',
        blockColor: '#1e1e1e',
        nameColor: '#ffffff',
        descColor: '#b3b3b3'
      }
    },
    {
      id: 7,
      name: 'Sunset Gradient',
      preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      author: 'VERE',
      uses: 19800,
      trending: false,
      tags: ['aesthetic', 'free'],
      config: {
        bgColor: '#ff9a56',
        blockColor: '#ffffff',
        nameColor: '#ff4757',
        descColor: '#2f3542'
      }
    },
    {
      id: 8,
      name: 'Ocean Blue',
      preview: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
      author: 'VERE',
      uses: 16400,
      trending: false,
      tags: ['aesthetic', 'free'],
      config: {
        bgColor: '#0984e3',
        blockColor: '#ffffff',
        nameColor: '#0652dd',
        descColor: '#2d3436'
      }
    }
  ]

  // Layout templates for different profile styles
  const layouts = [
    {
      id: 1,
      name: 'Default Card',
      layout: 'default',
      preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
      description: 'Classic card-based layout with centered content',
      uses: 42000,
      trending: true,
      tags: ['classic', 'free']
    },
    {
      id: 2,
      name: 'Linktree Style',
      layout: 'linktree',
      preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
      description: 'Minimalist centered links like Linktree',
      uses: 35200,
      trending: true,
      tags: ['minimal', 'free']
    },
    {
      id: 3,
      name: 'LinkedIn Professional',
      layout: 'linkedin',
      preview: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
      description: 'Professional header with content sections',
      uses: 28400,
      trending: true,
      tags: ['professional', 'free']
    },
    {
      id: 4,
      name: 'Guns.lol Neon',
      layout: 'guns',
      preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      description: 'Dark theme with neon effects and animations',
      uses: 19800,
      trending: false,
      tags: ['neon', 'free']
    },
    {
      id: 5,
      name: 'Minimal Clean',
      layout: 'minimal',
      preview: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=300&fit=crop',
      description: 'Ultra-minimal text-focused layout',
      uses: 16700,
      trending: false,
      tags: ['minimal', 'free']
    }
  ]

  const applyTheme = (theme) => {
    const user = getCurrentUser()
    if (!user) {
      setShowLoginModal(true)
      return
    }
    
    try {
      const activeProfile = getActiveProfile()
      if (!activeProfile) {
        alert('No active profile found')
        return
      }

      updateProfile(activeProfile.id, {
        bgColor: theme.config.bgColor,
        blockColor: theme.config.blockColor,
        nameColor: theme.config.nameColor,
        descColor: theme.config.descColor
      })
      
      alert(`Theme "${theme.name}" applied! Go to Customize to see the changes.`)
    } catch (err) {
      console.error('Failed to apply theme', err)
      alert('Failed to apply theme')
    }
  }

  const applyLayout = (layoutTemplate) => {
    const user = getCurrentUser()
    if (!user) {
      setShowLoginModal(true)
      return
    }
    
    try {
      const activeProfile = getActiveProfile()
      if (!activeProfile) {
        alert('No active profile found')
        return
      }

      updateProfile(activeProfile.id, {
        layout: layoutTemplate.layout
      })
      
      alert(`Layout "${layoutTemplate.name}" applied! View your profile to see the changes.`)
    } catch (err) {
      console.error('Failed to apply layout', err)
      alert('Failed to apply layout')
    }
  }

  const filteredThemes = selectedFilter === 'all' 
    ? themes 
    : themes.filter(t => t.tags.includes(selectedFilter))

  const filteredLayouts = selectedFilter === 'all'
    ? layouts
    : layouts.filter(l => l.tags.includes(selectedFilter))

  return (
    <div className="dashboard-shell p-4">
      <div className="dashboard-card d-flex">
        <Sidebar />

        <main className="dashboard-main p-4">
          <div className="themes-container">
            <div className="themes-header">
              <div>
                <h2 className="themes-title">
                  {selectedTab === 'themes' 
                    ? 'Discover the perfect Theme for your Profile'
                    : 'Choose your Profile Layout Style'
                  }
                </h2>
                <p className="themes-subtitle">
                  {selectedTab === 'themes'
                    ? 'Browse community-created themes, or design your own in Customize'
                    : 'Select a layout template that matches your style and purpose'
                  }
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="themes-tabs mb-4">
              <button
                className={`tab-btn ${selectedTab === 'themes' ? 'active' : ''}`}
                onClick={() => setSelectedTab('themes')}
              >
                <i className="bi bi-palette-fill me-2"></i>
                Color Themes
              </button>
              <button
                className={`tab-btn ${selectedTab === 'layouts' ? 'active' : ''}`}
                onClick={() => setSelectedTab('layouts')}
              >
                <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                Layout Templates
              </button>
            </div>

            <div className="themes-filters">
              <button 
                className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                All {selectedTab === 'themes' ? 'Themes' : 'Layouts'}
              </button>
              {selectedTab === 'themes' ? (
                <>
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
                </>
              ) : (
                <>
                  <button 
                    className={`filter-btn ${selectedFilter === 'minimal' ? 'active' : ''}`}
                    onClick={() => setSelectedFilter('minimal')}
                  >
                    Minimal
                  </button>
                  <button 
                    className={`filter-btn ${selectedFilter === 'professional' ? 'active' : ''}`}
                    onClick={() => setSelectedFilter('professional')}
                  >
                    Professional
                  </button>
                  <button 
                    className={`filter-btn ${selectedFilter === 'neon' ? 'active' : ''}`}
                    onClick={() => setSelectedFilter('neon')}
                  >
                    Neon
                  </button>
                  <button 
                    className={`filter-btn ${selectedFilter === 'free' ? 'active' : ''}`}
                    onClick={() => setSelectedFilter('free')}
                  >
                    Free
                  </button>
                </>
              )}
            </div>

            {/* Themes Grid */}
            {selectedTab === 'themes' && (
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
            )}

            {/* Layouts Grid */}
            {selectedTab === 'layouts' && (
              <div className="themes-grid">
                {filteredLayouts.length === 0 ? (
                  <div className="no-themes">
                    <p>No layouts available yet. Check back soon!</p>
                  </div>
                ) : (
                  filteredLayouts.map(layout => (
                    <div key={layout.id} className="theme-card">
                      <div className="theme-preview">
                        <img src={layout.preview} alt={layout.name} />
                        {layout.trending && (
                          <div className="theme-badge">
                            <i className="bi bi-star-fill"></i> Trending
                          </div>
                        )}
                      </div>
                      <div className="theme-info">
                        <div className="theme-header">
                          <div className="theme-author">
                            <i className="bi bi-layout-text-sidebar"></i>
                            <span>Layout</span>
                          </div>
                          <div className="theme-stats">
                            <span>{(layout.uses / 1000).toFixed(1)}k uses</span>
                          </div>
                        </div>
                        <h3 className="theme-name">{layout.name}</h3>
                        <p className="layout-description">{layout.description}</p>
                        <div className="theme-tags">
                          {layout.tags.map(tag => (
                            <span key={tag} className="theme-tag">{tag}</span>
                          ))}
                        </div>
                        <button 
                          className="btn-use-theme"
                          onClick={() => applyLayout(layout)}
                        >
                          Use Layout
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <LoginModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
    </div>
  )
}

export default Themes
