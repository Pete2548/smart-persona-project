import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import LoginModal from '../components/LoginModal'
import { getCurrentUser } from '../services/auth'
import { getActiveProfile, updateProfile } from '../services/profileManager'
import './dashboard.css'
import './themes.css'

const Themes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('personal') // 'personal', 'vtree', or 'resume'
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', theme: '' })

  const handleSwitchToSignup = () => {
    setShowLoginModal(false)
    navigate('/signup')
  }

  // Themes with different profile layouts inspired by popular platforms
  const themes = [
    {
      id: 1,
      name: 'Purple Gradient',
      animated: true,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      animation: 'gradient-shift',
      author: 'VERE',
      uses: 15200,
      trending: true,
      category: 'personal',
      tags: ['dark', 'neon', 'free'],
      config: {
        bgColor: '#0a0a0a',
        blockColor: '#1a1a1a',
        nameColor: '#00ff88',
        descColor: '#888888',
        fontFamily: '"Courier New", monospace'
      }
    },
    {
      id: 2,
      name: 'Pastel Dream',
      animated: true,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      animation: 'gradient-shift',
      author: 'VERE',
      uses: 28400,
      trending: true,
      category: 'personal',
      tags: ['aesthetic', 'free'],
      config: {
        bgColor: '#f5f5f5',
        blockColor: '#ffffff',
        nameColor: '#1a1a1a',
        descColor: '#666666',
        fontFamily: '"Inter", -apple-system, sans-serif'
      }
    },
    {
      id: 3,
      name: 'Deep Blue',
      animated: true,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      animation: 'gradient-shift',
      author: 'VERE',
      uses: 32100,
      trending: true,
      category: 'personal',
      tags: ['aesthetic', 'free'],
      config: {
        bgColor: '#ffffff',
        blockColor: '#f3f6f8',
        nameColor: '#0a66c2',
        descColor: '#191919',
        fontFamily: '"Segoe UI", -apple-system, sans-serif'
      }
    },
    {
      id: 4,
      name: 'Neon Cyberpunk',
      animated: true,
      gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a0ca3 100%)',
      animation: 'neon-pulse',
      author: 'VERE',
      uses: 18700,
      trending: false,
      category: 'personal',
      tags: ['dark', 'neon', 'free'],
      config: {
        bgColor: '#0d0221',
        blockColor: '#1a1a2e',
        nameColor: '#ff006e',
        descColor: '#8338ec',
        fontFamily: '"Orbitron", "Rajdhani", sans-serif'
      }
    },
    {
      id: 5,
      name: 'Minimalist White',
      animated: true,
      gradient: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
      animation: 'gradient-shift',
      author: 'VERE',
      uses: 21300,
      trending: false,
      category: 'personal',
      tags: ['aesthetic', 'free'],
      config: {
        bgColor: '#ffffff',
        blockColor: '#fafafa',
        nameColor: '#2d3436',
        descColor: '#636e72',
        fontFamily: '"Helvetica Neue", Arial, sans-serif'
      }
    },
    {
      id: 6,
      name: 'Dark Mode Pro',
      animated: true,
      gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
      animation: 'gradient-shift',
      author: 'VERE',
      uses: 25600,
      trending: true,
      category: 'personal',
      tags: ['dark', 'free'],
      config: {
        bgColor: '#121212',
        blockColor: '#1e1e1e',
        nameColor: '#ffffff',
        descColor: '#b3b3b3',
        fontFamily: '"SF Pro Display", -apple-system, sans-serif'
      }
    },
    {
      id: 7,
      name: 'Sunset Gradient',
      animated: true,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      animation: 'sunset-wave',
      author: 'VERE',
      uses: 19800,
      trending: false,
      category: 'personal',
      tags: ['aesthetic', 'free'],
      config: {
        bgColor: '#ff9a56',
        blockColor: '#ffffff',
        nameColor: '#ff4757',
        descColor: '#2f3542',
        fontFamily: '"Poppins", sans-serif'
      }
    },
    {
      id: 8,
      name: 'Sky Blue',
      animated: true,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      animation: 'ocean-wave',
      author: 'VERE',
      uses: 16400,
      trending: false,
      category: 'personal',
      tags: ['aesthetic', 'free'],
      config: {
        bgColor: '#0984e3',
        blockColor: '#ffffff',
        nameColor: '#0652dd',
        descColor: '#2d3436',
        fontFamily: '"Roboto", sans-serif'
      }
    },
    {
      id: 9,
      name: 'Matrix Code',
      animated: false,
      gifUrl: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2kzZ2Fwdm5odGRhNml2bGl0MzM4MXFrbjB6eWN5ZDJ3MjliZG8xbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3vRnoppYtfEbemBO/giphy.gif',
      author: 'VERE',
      uses: 8900,
      trending: true,
      category: 'personal',
      tags: ['dark', 'neon', 'free'],
      config: {
        bgColor: '#000000',
        blockColor: 'rgba(0, 0, 0, 0.8)',
        nameColor: '#00ff41',
        descColor: '#00ff41',
        fontFamily: '"Courier New", "Consolas", monospace'
      }
    },
    {
      id: 10,
      name: 'Pink Smoke',
      animated: false,
      gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGQ4MzU5cndrNXRzM3p3cTVlM3M4OGJkNGJ3bHR6eWk1ZHRhM2NkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BROrSHlmyzzHf3i/giphy.gif',
      author: 'VERE',
      uses: 12300,
      trending: true,
      category: 'personal',
      tags: ['dark', 'neon', 'aesthetic'],
      config: {
        bgColor: '#1a1a2e',
        blockColor: 'rgba(26, 26, 46, 0.9)',
        nameColor: '#ff006e',
        descColor: '#ffffff',
        fontFamily: '"Orbitron", "Exo 2", sans-serif'
      }
    },
    {
      id: 11,
      name: 'Underwater Dreams',
      animated: false,
      gifUrl: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjVmbzh3Zm1iZmptYjB6M205M3l2ZDRjaTljODBuN2gwZWpndGI0bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26mE6BdnQ4NeH4aQM/giphy.gif',
      author: 'VERE',
      uses: 15700,
      trending: true,
      category: 'personal',
      tags: ['aesthetic', 'neon', 'free'],
      config: {
        bgColor: '#2d1b69',
        blockColor: 'rgba(45, 27, 105, 0.85)',
        nameColor: '#a78bfa',
        descColor: '#e0e7ff',
        fontFamily: '"Orbitron", sans-serif'
      }
    },
    {
      id: 12,
      name: 'Code',
      animated: false,
      gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHhtcGY5M3puYjV3M2Jtd3psZnBraDdkOGVic3RoODZvd2VkOTVsZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9IgzoKnwFNmISR8I/giphy.gif',
      author: 'VERE',
      uses: 11200,
      trending: false,
      category: 'personal',
      tags: ['neon', 'aesthetic', 'free'],
      config: {
        bgColor: '#0a0e27',
        blockColor: 'rgba(10, 14, 39, 0.9)',
        nameColor: '#00ffff',
        descColor: '#ff00ff',
        fontFamily: '"Press Start 2P", "VT323", monospace'
      }
    },
    {
      id: 13,
      name: 'Digital Rain',
      animated: false,
      gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnN5bnB4cjJ2Ym5zYmFxbWFoNmJzOHh2ZGJ0NGJqZnFrOHVkZHM1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPtjElfqwMOTbH2/giphy.gif',
      author: 'VERE',
      uses: 9500,
      trending: false,
      category: 'personal',
      tags: ['dark', 'neon', 'free'],
      config: {
        bgColor: '#000000',
        blockColor: 'rgba(0, 0, 0, 0.85)',
        nameColor: '#39ff14',
        descColor: '#39ff14',
        fontFamily: '"Courier New", "Lucida Console", monospace'
      }
    },
    {
      id: 14,
      name: 'Retro Grid',
      animated: false,
      gifUrl: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWt6djBkbXVqNWJpZGowZTd5NXJtYzZkOWtndHZiY3J3a3I4ZWN2eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HU8V1CHKTUFtuFO/giphy.gif',
      author: 'VERE',
      uses: 13800,
      trending: true,
      category: 'personal',
      tags: ['neon', 'aesthetic', 'free'],
      config: {
        bgColor: '#1a0933',
        blockColor: 'rgba(26, 9, 51, 0.9)',
        nameColor: '#ff00ff',
        descColor: '#00ffff',
        fontFamily: '"Press Start 2P", "Orbitron", monospace'
      }
    },
    {
      id: 15,
      name: 'Dark Premium',
      animated: true,
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      animation: 'gradient-shift',
      author: 'VERE',
      uses: 24500,
      trending: true,
      category: 'personal',
      tags: ['dark', 'aesthetic', 'free'],
      config: {
        bgColor: '#0a0a0a',
        blockColor: 'rgba(20, 20, 20, 0.95)',
        nameColor: '#e5e5e5',
        descColor: '#a0a0a0',
        fontFamily: '"SF Pro Display", "Helvetica Neue", "Segoe UI", sans-serif'
      }
    },
    {
      id: 16,
      name: 'Gold Luxury',
      animated: true,
      gradient: 'linear-gradient(135deg, #0f0f0f 0%, #1a1410 50%, #0f0f0f 100%)',
      animation: 'gradient-shift',
      author: 'VERE',
      uses: 19800,
      trending: true,
      category: 'personal',
      tags: ['dark', 'aesthetic', 'free'],
      config: {
        bgColor: '#0a0a0a',
        blockColor: 'rgba(26, 20, 16, 0.9)',
        nameColor: '#d4af37',
        descColor: '#b8956a',
        fontFamily: '"Playfair Display", "Georgia", serif'
      }
    },
    {
      id: 17,
      name: 'Midnight Carbon',
      animated: true,
      gradient: 'linear-gradient(135deg, #141414 0%, #000000 50%, #1a1a1a 100%)',
      animation: 'gradient-shift',
      author: 'VERE',
      uses: 21300,
      trending: true,
      category: 'personal',
      tags: ['dark', 'aesthetic', 'free'],
      config: {
        bgColor: '#000000',
        blockColor: 'rgba(20, 20, 20, 0.85)',
        nameColor: '#ffffff',
        descColor: '#808080',
        fontFamily: '"Inter", -apple-system, sans-serif'
      }
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
        setToast({ show: true, message: 'No active profile found', theme: 'error' })
        setTimeout(() => setToast({ show: false, message: '', theme: '' }), 3000)
        return
      }

      const updates = {
        bgColor: theme.config.bgColor,
        blockColor: theme.config.blockColor,
        nameColor: theme.config.nameColor,
        descColor: theme.config.descColor,
        fontFamily: theme.config.fontFamily || '"Inter", sans-serif'
      }

      // If theme has GIF background, set it as bgImage
      if (theme.gifUrl) {
        updates.bgImage = theme.gifUrl
      }

      updateProfile(activeProfile.id, updates)
      
      setToast({ show: true, message: `${theme.name} applied!`, theme: 'success' })
      setTimeout(() => {
        navigate('/customize')
      }, 1500)
    } catch (err) {
      console.error('Failed to apply theme', err)
      setToast({ show: true, message: 'Failed to apply theme', theme: 'error' })
      setTimeout(() => setToast({ show: false, message: '', theme: '' }), 3000)
    }
  }

  // Filter themes by category (selectedTab) first, then by selectedFilter
  const categoryThemes = themes.filter(t => t.category === selectedTab)
  
  const filteredThemes = selectedFilter === 'all' 
    ? categoryThemes 
    : selectedFilter === 'gif'
    ? categoryThemes.filter(t => t.gifUrl)
    : selectedFilter === 'gradient'
    ? categoryThemes.filter(t => t.animated && !t.gifUrl)
    : selectedFilter === 'fonts'
    ? categoryThemes.filter(t => t.config.fontFamily && !t.config.fontFamily.includes('Inter'))
    : selectedFilter === 'trending'
    ? categoryThemes.filter(t => t.trending)
    : categoryThemes.filter(t => t.tags.includes(selectedFilter))

  return (
    <div className="dashboard-shell p-4">
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '16px 24px',
          borderRadius: '12px',
          background: toast.theme === 'success' 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <i className={`bi ${toast.theme === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`} 
             style={{ fontSize: '24px' }}></i>
          {toast.message}
        </div>
      )}
      
      <div className="dashboard-card d-flex">
        <Sidebar />

        <main className="dashboard-main p-4">
          <div className="themes-container">
            <div className="themes-header">
              <div>
                <h2 className="themes-title">
                  {selectedTab === 'personal' 
                    ? t('personal_profile_themes') || 'Personal Profile Themes'
                    : selectedTab === 'vtree'
                    ? t('vtree_link_themes') || 'Vtree Link Themes'
                    : t('resume_builder_themes') || 'Resume Builder Themes'
                  }
                </h2>
                <p className="themes-subtitle">
                  {selectedTab === 'personal'
                    ? t('discover_personal_themes') || 'Discover themes for your personal profile page'
                    : selectedTab === 'vtree'
                    ? t('discover_vtree_themes') || 'Beautiful themes for your Vtree link collection'
                    : t('discover_resume_themes') || 'Professional themes for your resume'
                  }
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="themes-tabs mb-4">
              <button
                className={`tab-btn ${selectedTab === 'personal' ? 'active' : ''}`}
                onClick={() => setSelectedTab('personal')}
              >
                <i className="bi bi-person-fill me-2"></i>
                {t('personal')}
              </button>
              <button
                className={`tab-btn ${selectedTab === 'vtree' ? 'active' : ''}`}
                onClick={() => setSelectedTab('vtree')}
              >
                <i className="bi bi-tree-fill me-2"></i>
                {t('vtree')}
              </button>
              <button
                className={`tab-btn ${selectedTab === 'resume' ? 'active' : ''}`}
                onClick={() => setSelectedTab('resume')}
              >
                <i className="bi bi-file-earmark-text-fill me-2"></i>
                {t('resume')}
              </button>
            </div>

            <div className="themes-filters">
              <button 
                className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                {t('all_themes') || 'All Themes'}
              </button>
              <button 
                className={`filter-btn ${selectedFilter === 'gif' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('gif')}
              >
                <i className="bi bi-film me-1"></i>
                {t('gif_backgrounds') || 'GIF Backgrounds'}
              </button>
              <button 
                className={`filter-btn ${selectedFilter === 'gradient' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('gradient')}
              >
                <i className="bi bi-palette me-1"></i>
                {t('animated_gradients') || 'Animated Gradients'}
              </button>
              <button 
                className={`filter-btn ${selectedFilter === 'fonts' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('fonts')}
              >
                <i className="bi bi-fonts me-1"></i>
                {t('custom_fonts') || 'Custom Fonts'}
              </button>
              <button 
                className={`filter-btn ${selectedFilter === 'trending' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('trending')}
              >
                <i className="bi bi-star-fill me-1"></i>
                {t('trending') || 'Trending'}
              </button>
            </div>

            {/* Themes Grid */}
            <div className="themes-grid">
                {filteredThemes.length === 0 ? (
                  <div className="no-themes">
                    <p>{t('no_themes_available') || 'No themes available yet. Check back soon!'}</p>
                  </div>
                ) : (
                  filteredThemes.map(theme => (
                    <div key={theme.id} className="theme-card">
                      <div 
                        className={`theme-preview ${theme.animated ? 'animated' : ''} ${theme.gifUrl ? 'gif-bg' : ''}`}
                        style={
                          theme.animated ? {
                            background: theme.gradient,
                            backgroundSize: '200% 200%'
                          } : theme.gifUrl ? {
                            backgroundImage: `url(${theme.gifUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          } : {}
                        }
                        data-animation={theme.animation}
                      >
                        {!theme.animated && !theme.gifUrl && <img src={theme.preview} alt={theme.name} />}
                        
                        {/* Preview Mockup */}
                        <div className="theme-mockup" style={{
                          fontFamily: theme.config.fontFamily || 'inherit'
                        }}>
                          <div className="mockup-avatar" style={{
                            background: theme.config.nameColor,
                            opacity: 0.9
                          }}>
                            <i className="bi bi-person-fill"></i>
                          </div>
                          <div className="mockup-name" style={{
                            color: theme.config.nameColor,
                            textShadow: theme.gifUrl ? '0 2px 8px rgba(0,0,0,0.8)' : 'none'
                          }}>
                            Your Name
                          </div>
                          <div className="mockup-desc" style={{
                            color: theme.config.descColor,
                            textShadow: theme.gifUrl ? '0 2px 8px rgba(0,0,0,0.8)' : 'none'
                          }}>
                            Your description here
                          </div>
                        </div>
                        
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
                          {t('apply')}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
