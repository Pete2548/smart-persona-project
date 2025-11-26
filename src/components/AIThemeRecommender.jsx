import React, { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const AIThemeRecommender = ({ profileType = 'professional', onThemeApplied }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const navigate = useNavigate()

  // AI Theme recommendations based on profile type
  const themeDatabase = {
    professional: [
      { id: 1, name: 'Ocean Blue', colors: { nameColor: '#1E6FB8', bgColor: '#0a1929', descColor: '#90caf9' }, reason: 'Professional and trustworthy' },
      { id: 8, name: 'Midnight', colors: { nameColor: '#ffffff', bgColor: '#000814', descColor: '#a9a9a9' }, reason: 'Sleek and modern' },
      { id: 15, name: 'Dark Premium', colors: { nameColor: '#e5e5e5', bgColor: '#0a0a0a', descColor: '#a0a0a0' }, reason: 'Premium business look' }
    ],
    freelance: [
      { id: 3, name: 'Sunset Vibes', colors: { nameColor: '#ff6b6b', bgColor: '#2d1b4e', descColor: '#ffd93d' }, reason: 'Creative and vibrant' },
      { id: 5, name: 'Emerald Dream', colors: { nameColor: '#00ff87', bgColor: '#0a3d2e', descColor: '#c7f0bd' }, reason: 'Fresh and creative' },
      { id: 16, name: 'Gold Luxury', colors: { nameColor: '#d4af37', bgColor: '#0f0f0f', descColor: '#b8956a' }, reason: 'Luxurious freelancer brand' }
    ],
    personal: [
      { id: 2, name: 'Purple Dream', colors: { nameColor: '#e056fd', bgColor: '#1e1138', descColor: '#d4b4ff' }, reason: 'Personal and expressive' },
      { id: 4, name: 'Mint Fresh', colors: { nameColor: '#39ff14', bgColor: '#0d1b2a', descColor: '#b9fbc0' }, reason: 'Fresh personal vibe' },
      { id: 6, name: 'Rose Gold', colors: { nameColor: '#ff6b9d', bgColor: '#1a0a14', descColor: '#ffc2d1' }, reason: 'Warm and personal' }
    ],
    creative: [
      { id: 3, name: 'Sunset Vibes', colors: { nameColor: '#ff6b6b', bgColor: '#2d1b4e', descColor: '#ffd93d' }, reason: 'Bold creative expression' },
      { id: 7, name: 'Neon City', colors: { nameColor: '#ff00ff', bgColor: '#0a0e27', descColor: '#00ffff' }, reason: 'Vibrant creative energy' },
      { id: 5, name: 'Emerald Dream', colors: { nameColor: '#00ff87', bgColor: '#0a3d2e', descColor: '#c7f0bd' }, reason: 'Unique creative style' }
    ],
    business: [
      { id: 1, name: 'Ocean Blue', colors: { nameColor: '#1E6FB8', bgColor: '#0a1929', descColor: '#90caf9' }, reason: 'Professional business presence' },
      { id: 15, name: 'Dark Premium', colors: { nameColor: '#e5e5e5', bgColor: '#0a0a0a', descColor: '#a0a0a0' }, reason: 'Corporate excellence' },
      { id: 16, name: 'Gold Luxury', colors: { nameColor: '#d4af37', bgColor: '#0f0f0f', descColor: '#b8956a' }, reason: 'Premium business brand' }
    ]
  }

  const analyzeAndRecommend = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const recommendedThemes = themeDatabase[profileType] || themeDatabase.professional
    setRecommendations(recommendedThemes)
    setIsAnalyzing(false)
  }

  const applyTheme = (theme) => {
    if (onThemeApplied) {
      onThemeApplied(theme.colors)
    }
  }

  return (
    <div className="ai-theme-recommender p-4 border rounded" style={{ 
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white'
    }}>
      <div className="d-flex align-items-center gap-2 mb-3">
        <i className="bi bi-palette-fill" style={{ fontSize: '28px' }}></i>
        <div>
          <h5 className="mb-0">AI Theme Recommender</h5>
          <small style={{ opacity: 0.9 }}>Get personalized theme suggestions</small>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center">
          <p className="mb-3">
            Let AI analyze your profile type and recommend the perfect themes for you!
          </p>
          <Button
            variant="light"
            onClick={analyzeAndRecommend}
            disabled={isAnalyzing}
            className="px-4"
          >
            {isAnalyzing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Analyzing...
              </>
            ) : (
              <>
                <i className="bi bi-magic me-2"></i>
                Get AI Recommendations
              </>
            )}
          </Button>
          <div className="mt-3" style={{ fontSize: '12px', opacity: 0.9 }}>
            <i className="bi bi-info-circle me-1"></i>
            Based on profile type: <strong>{profileType}</strong>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-3">
            <i className="bi bi-check-circle-fill me-2"></i>
            Here are {recommendations.length} themes perfect for your <strong>{profileType}</strong> profile:
          </p>
          
          <div className="d-flex flex-column gap-2">
            {recommendations.map((theme) => (
              <div 
                key={theme.id}
                className="p-3 rounded"
                style={{ 
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h6 className="mb-0">{theme.name}</h6>
                    <small style={{ opacity: 0.9 }}>{theme.reason}</small>
                  </div>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => applyTheme(theme)}
                  >
                    <i className="bi bi-brush me-1"></i>
                    Apply
                  </Button>
                </div>
                
                <div className="d-flex gap-2 mt-2">
                  <div 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px',
                      background: theme.colors.nameColor,
                      border: '2px solid white'
                    }}
                    title="Name Color"
                  />
                  <div 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px',
                      background: theme.colors.bgColor,
                      border: '2px solid white'
                    }}
                    title="Background Color"
                  />
                  <div 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px',
                      background: theme.colors.descColor,
                      border: '2px solid white'
                    }}
                    title="Description Color"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 text-center">
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => navigate('/themes')}
            >
              <i className="bi bi-grid-3x3 me-2"></i>
              Browse All Themes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIThemeRecommender
