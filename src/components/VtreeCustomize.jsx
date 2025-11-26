import React, { useState } from 'react'

/**
 * VtreeCustomize: Linktree-style customization interface
 * Features: Header, Theme, Wallpaper, Text, Buttons, Colors
 */
export default function VtreeCustomize({ 
  profile,
  onUpdate,
  profiles = [],
  currentProfileId,
  onProfileSwitch,
  navigate
}) {
  const [activeTab, setActiveTab] = useState('header')
  const [showFontModal, setShowFontModal] = useState(false)
  const [fontModalType, setFontModalType] = useState('title') // 'title' or 'page'

  // Profile settings state
  const [profileImage, setProfileImage] = useState(profile.profileImage || '')
  const [profileImageLayout, setProfileImageLayout] = useState(profile.profileImageLayout || 'classic')
  const [titleStyle, setTitleStyle] = useState(profile.titleStyle || 'text')
  const [titleText, setTitleText] = useState(profile.displayName || '@username')
  const [titleFont, setTitleFont] = useState(profile.titleFont || 'DM Sans')
  const [titleColor, setTitleColor] = useState(profile.nameColor || '#ffffff')
  const [titleSize, setTitleSize] = useState(profile.titleSize || 'small')
  
  // Wallpaper settings
  const [wallpaperStyle, setWallpaperStyle] = useState(profile.wallpaperStyle || 'fill')
  const [wallpaperColor, setWallpaperColor] = useState(profile.bgColor || '#808080')
  const [wallpaperImage, setWallpaperImage] = useState(profile.wallpaperImage || '')
  const [overlayOpacity, setOverlayOpacity] = useState(profile.overlayOpacity || 0)
  
  // Text settings
  const [pageFont, setPageFont] = useState(profile.pageFont || 'DM Sans')
  const [pageTextColor, setPageTextColor] = useState(profile.pageTextColor || '#ffffff')
  const [buttonTextColor, setButtonTextColor] = useState(profile.buttonTextColor || '#000000')
  
  // Button settings
  const [buttonStyle, setButtonStyle] = useState(profile.buttonStyle || 'solid')
  const [buttonCorners, setButtonCorners] = useState(profile.buttonCorners || 'round')
  const [buttonShadow, setButtonShadow] = useState(profile.buttonShadow || 'none')
  const [buttonColor, setButtonColor] = useState(profile.buttonColor || '#ffffff')
  
  // Links settings
  const socialLinks = profile.socialLinks || {}

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
        handleUpdate({ profileImage: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    { id: 'links', icon: 'bi-link-45deg', label: 'Links' },
    { id: 'header', icon: 'bi-card-heading', label: 'Header' },
    { id: 'wallpaper', icon: 'bi-image', label: 'Wallpaper' },
    { id: 'text', icon: 'bi-fonts', label: 'Text' },
    { id: 'buttons', icon: 'bi-ui-checks', label: 'Buttons' },
    { id: 'colors', icon: 'bi-palette2', label: 'Colors' }
  ]

  const handleUpdate = (updates) => {
    onUpdate({
      ...profile,
      ...updates
    })
  }

  const fonts = {
    suggested: [
      'Inter', 'Poppins', 'Roboto', 'Montserrat',
      'Open Sans', 'Lato', 'Raleway', 'Nunito',
      'Work Sans', 'DM Sans', 'Plus Jakarta Sans', 'Outfit',
      'Urbanist', 'Manrope', 'IBM Plex Sans', 'Archivo',
      'Playfair Display', 'Merriweather', 'Crimson Text', 'Cormorant',
      'Bebas Neue', 'Righteous', 'Russo One', 'Bungee',
      'Pacifico', 'Dancing Script', 'Permanent Marker', 'Caveat'
    ],
    other: [
      'Albert Sans', 'Space Grotesk', 'Epilogue', 'Red Hat Display',
      'Rubik', 'Syne', 'Karla', 'Jost',
      'Barlow', 'Figtree', 'Quicksand', 'Lexend',
      'IBM Plex Serif', 'Lora', 'Noto Serif', 'PT Serif',
      'Roboto Serif', 'Source Serif Pro', 'Bitter', 'Spectral',
      'IBM Plex Mono', 'Space Mono', 'JetBrains Mono', 'Fira Code',
      'Orbitron', 'Exo 2', 'Audiowide', 'Press Start 2P'
    ]
  }

  return (
    <div className="vtree-customize">
      {/* Font Modal */}
      {showFontModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowFontModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h5 className="mb-0">Title Font</h5>
              <button 
                onClick={() => setShowFontModal(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px'
                }}
              >
                ×
              </button>
            </div>

            {/* Customize title font toggle */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Customize title font</span>
              <div className="form-check form-switch mb-0">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>

            {/* Font List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {/* Suggested */}
              <h6 className="mb-3">Suggested</h6>
              <div className="row g-2 mb-4">
                {fonts.suggested.map(font => (
                  <div key={font} className="col-6">
                    <button
                      className={`btn w-100 ${(fontModalType === 'title' ? titleFont : pageFont) === font ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => {
                        if (fontModalType === 'title') {
                          setTitleFont(font)
                          handleUpdate({ titleFont: font })
                        } else {
                          setPageFont(font)
                          handleUpdate({ pageFont: font })
                        }
                      }}
                      style={{ 
                        borderRadius: '12px',
                        padding: '12px',
                        fontFamily: font,
                        textAlign: 'left'
                      }}
                    >
                      {font}
                    </button>
                  </div>
                ))}
              </div>

              {/* Other */}
              <h6 className="mb-3">Other</h6>
              <div className="row g-2">
                {fonts.other.map(font => (
                  <div key={font} className="col-6">
                    <button
                      className={`btn w-100 ${(fontModalType === 'title' ? titleFont : pageFont) === font ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => {
                        if (fontModalType === 'title') {
                          setTitleFont(font)
                          handleUpdate({ titleFont: font })
                        } else {
                          setPageFont(font)
                          handleUpdate({ pageFont: font })
                        }
                      }}
                      style={{ 
                        borderRadius: '12px',
                        padding: '12px',
                        fontFamily: font,
                        textAlign: 'left'
                      }}
                    >
                      {font}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <div className="vtree-nav bg-white border-bottom" style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        padding: '12px 0'
      }}>
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center" style={{ position: 'relative' }}>
            {/* Center: Tab Navigation */}
            <div className="d-flex gap-2 overflow-auto" style={{
              flexWrap: 'nowrap',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn btn-sm d-flex align-items-center gap-2 ${
                    activeTab === tab.id ? 'btn-dark' : 'btn-outline-secondary'
                  }`}
                  style={{ 
                    whiteSpace: 'nowrap',
                    padding: '8px 16px',
                    borderRadius: '8px'
                  }}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            {/* Right: Profile Selector */}
            {profiles && profiles.length > 0 && (
              <div className="d-flex align-items-center gap-2 ms-auto" style={{ zIndex: 10 }}>
                <label className="mb-0 small text-muted">Editing:</label>
                <select 
                  className="form-select form-select-sm" 
                  style={{ width: 'auto', minWidth: '200px' }}
                  value={currentProfileId || ''}
                  onChange={(e) => onProfileSwitch && onProfileSwitch(e)}
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.type})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="vtree-content p-4" style={{ paddingBottom: '100px' }}>
        <div className="row g-4">
          {/* Left Column: Settings */}
          <div className="col-lg-6"style={{ paddingLeft: '40px' }}>
          
          {/* Header Tab */}
          {activeTab === 'header' && (
            <div className="vtree-section">
              <h5 className="mb-3" style={{ color: '#666' }}>Header</h5>
              <div className="bg-white rounded p-4" style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              
              {/* Profile Image Upload */}
              <div className="mb-4">
                <label className="form-label">Profile image</label>
                <div className="d-flex align-items-center gap-3">
                  {/* Profile Image Preview */}
                  <div 
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }} 
                      />
                    ) : (
                      <i className="bi bi-person-fill" style={{ fontSize: '40px', color: '#999' }}></i>
                    )}
                  </div>

                  {/* Add Button */}
                  <label 
                    className="btn btn-dark rounded-pill px-4"
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Profile Image Layout */}
              <div className="mb-4">
                <label className="form-label">Profile image layout</label>
                <div className="d-flex gap-3">
                  <button
                    className={`btn ${profileImageLayout === 'classic' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                    onClick={() => {
                      setProfileImageLayout('classic')
                      handleUpdate({ profileImageLayout: 'classic' })
                    }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    Classic
                  </button>
                  <button
                    className={`btn ${profileImageLayout === 'vfull' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                    onClick={() => {
                      setProfileImageLayout('vfull')
                      handleUpdate({ profileImageLayout: 'vfull' })
                    }}
                  >
                    <i className="bi bi-image me-2"></i>
                    Vfull
                  </button>
                </div>
              </div>

              {/* Title Section */}
              <div className="mb-4">
                <h6 className="mb-3">Title</h6>
                
                {/* Title Style */}
                <div className="mb-3">
                  <label className="form-label">Title style</label>
                  <div className="d-flex gap-3">
                    <button
                      className={`btn ${titleStyle === 'text' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                      onClick={() => {
                        setTitleStyle('text')
                        handleUpdate({ titleStyle: 'text' })
                      }}
                    >
                      <i className="bi bi-fonts me-2"></i>
                      Text
                    </button>
                    <button
                      className={`btn ${titleStyle === 'logo' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                      onClick={() => {
                        setTitleStyle('logo')
                        handleUpdate({ titleStyle: 'logo' })
                      }}
                    >
                      <i className="bi bi-image me-2"></i>
                      Logo
                    </button>
                  </div>
                </div>

                {/* Title Text */}
                <div className="mb-3">
                  <label className="form-label">Title text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={titleText}
                    onChange={(e) => {
                      setTitleText(e.target.value)
                      handleUpdate({ displayName: e.target.value })
                    }}
                    placeholder="@username"
                  />
                </div>

                {/* Title Font */}
                <div className="mb-3">
                  <label className="form-label">Title font</label>
                  <button 
                    className="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
                    onClick={() => {
                      setFontModalType('title')
                      setShowFontModal(true)
                    }}
                  >
                    <span>{titleFont}</span>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>

                {/* Title Color */}
                <div className="mb-3">
                  <label className="form-label">Title color</label>
                  <input
                    type="color"
                    className="form-control form-control-color w-100"
                    value={titleColor}
                    onChange={(e) => {
                      setTitleColor(e.target.value)
                      handleUpdate({ nameColor: e.target.value })
                    }}
                    style={{ height: '50px' }}
                  />
                </div>

                {/* Title Size */}
                <div className="mb-3">
                  <label className="form-label">Title size</label>
                  <div className="d-flex gap-3">
                    <button
                      className={`btn ${titleSize === 'small' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                      onClick={() => {
                        setTitleSize('small')
                        handleUpdate({ titleSize: 'small' })
                      }}
                    >
                      Small
                    </button>
                    <button
                      className={`btn ${titleSize === 'large' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                      onClick={() => {
                        setTitleSize('large')
                        handleUpdate({ titleSize: 'large' })
                      }}
                    >
                      Large
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* Wallpaper Tab */}
          {activeTab === 'wallpaper' && (
            <div className="vtree-section">
              <h5 className="mb-3" style={{ color: '#666' }}>Wallpaper</h5>
              <div className="bg-white rounded p-4" style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                
                {/* Wallpaper Style */}
                <div className="mb-4">
                  <label className="form-label">Wallpaper style</label>
                  <div className="d-flex gap-3 flex-wrap">
                    {/* Fill */}
                    <button
                      className={`btn ${wallpaperStyle === 'fill' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => {
                        setWallpaperStyle('fill')
                        handleUpdate({ wallpaperStyle: 'fill' })
                      }}
                      style={{ width: '80px', height: '100px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                    >
                      <div style={{
                        width: '100%',
                        height: '60px',
                        backgroundColor: '#808080',
                        borderRadius: '8px',
                        border: '2px solid #333'
                      }}></div>
                      <span style={{ fontSize: '12px' }}>Fill</span>
                    </button>

                    {/* Gradient */}
                    <button
                      className={`btn ${wallpaperStyle === 'gradient' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => {
                        setWallpaperStyle('gradient')
                        handleUpdate({ wallpaperStyle: 'gradient' })
                      }}
                      style={{ width: '80px', height: '100px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                    >
                      <div style={{
                        width: '100%',
                        height: '60px',
                        background: 'linear-gradient(180deg, #999 0%, #666 100%)',
                        borderRadius: '8px',
                        border: '2px solid #333'
                      }}></div>
                      <span style={{ fontSize: '12px' }}>Gradient</span>
                    </button>

                    {/* Blur */}
                    <button
                      className={`btn ${wallpaperStyle === 'blur' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => {
                        setWallpaperStyle('blur')
                        handleUpdate({ wallpaperStyle: 'blur' })
                      }}
                      style={{ width: '80px', height: '100px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                    >
                      <div style={{
                        width: '100%',
                        height: '60px',
                        backgroundColor: '#999',
                        borderRadius: '8px',
                        border: '2px solid #333',
                        filter: 'blur(4px)'
                      }}></div>
                      <span style={{ fontSize: '12px' }}>Blur</span>
                    </button>

                    {/* Image */}
                    <label
                      className={`btn ${wallpaperStyle === 'image' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      style={{ width: '80px', height: '100px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      <div style={{
                        width: '100%',
                        height: '60px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px',
                        border: '2px solid #333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="bi bi-image" style={{ fontSize: '24px', color: '#666' }}></i>
                        {wallpaperStyle === 'image' && (
                          <div style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="bi bi-plus" style={{ fontSize: '10px', color: 'white' }}></i>
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '12px' }}>Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setWallpaperImage(reader.result)
                              setWallpaperStyle('image')
                              handleUpdate({ 
                                wallpaperStyle: 'image',
                                wallpaperImage: reader.result,
                                bgColor: reader.result
                              })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {/* Video */}
                    <label
                      className={`btn ${wallpaperStyle === 'video' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      style={{ width: '80px', height: '100px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      <div style={{
                        width: '100%',
                        height: '60px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px',
                        border: '2px solid #333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <i className="bi bi-play-circle" style={{ fontSize: '24px', color: '#666' }}></i>
                        {wallpaperStyle === 'video' && (
                          <div style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="bi bi-plus" style={{ fontSize: '10px', color: 'white' }}></i>
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '12px' }}>Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setWallpaperStyle('video')
                              handleUpdate({ 
                                wallpaperStyle: 'video',
                                wallpaperVideo: reader.result
                              })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                {/* Overlay Opacity (for Image/Video) */}
                {(wallpaperStyle === 'image' || wallpaperStyle === 'video') && (
                  <div className="mb-4">
                    <label className="form-label">Overlay</label>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="100"
                      value={overlayOpacity}
                      onChange={(e) => {
                        setOverlayOpacity(Number(e.target.value))
                        handleUpdate({ overlayOpacity: Number(e.target.value) })
                      }}
                    />
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">0%</small>
                      <small className="text-muted">{overlayOpacity}%</small>
                      <small className="text-muted">100%</small>
                    </div>
                  </div>
                )}

                {/* Color Picker (for Fill/Gradient) */}
                {(wallpaperStyle === 'fill' || wallpaperStyle === 'gradient') && (
                  <div className="mb-4">
                    <label className="form-label">Color</label>
                    <div className="d-flex gap-2 mb-3">
                      {/* Suggested Colors */}
                      <button
                        onClick={() => {
                          setWallpaperColor('#808080')
                          handleUpdate({ bgColor: '#808080' })
                        }}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#808080',
                          border: wallpaperColor === '#808080' ? '3px solid #333' : '2px solid #ddd',
                          cursor: 'pointer'
                        }}
                      ></button>
                      <button
                        onClick={() => {
                          setWallpaperColor('#ffffff')
                          handleUpdate({ bgColor: '#ffffff' })
                        }}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          border: wallpaperColor === '#ffffff' ? '3px solid #333' : '2px solid #ddd',
                          cursor: 'pointer'
                        }}
                      ></button>
                      <button
                        onClick={() => {
                          setWallpaperColor('#000000')
                          handleUpdate({ bgColor: '#000000' })
                        }}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#000000',
                          border: wallpaperColor === '#000000' ? '3px solid #333' : '2px solid #ddd',
                          cursor: 'pointer'
                        }}
                      ></button>
                    </div>
                    <p className="text-muted small mb-2">Suggested colors are based on your profile image</p>
                    
                    {/* Custom Color Picker */}
                    <input
                      type="color"
                      className="form-control form-control-color w-100"
                      value={wallpaperColor}
                      onChange={(e) => {
                        setWallpaperColor(e.target.value)
                        handleUpdate({ bgColor: e.target.value })
                      }}
                      style={{ height: '50px' }}
                    />
                  </div>
                )}
                
              </div>
            </div>
          )}

          {/* Text Tab */}
          {activeTab === 'text' && (
            <div className="vtree-section">
              <h5 className="mb-3" style={{ color: '#666' }}>Text</h5>
              <div className="bg-white rounded p-4" style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                
                {/* Title Font */}
                <div className="mb-3">
                  <label className="form-label">Title font</label>
                  <button 
                    className="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
                    onClick={() => {
                      setFontModalType('title')
                      setShowFontModal(true)
                    }}
                  >
                    <span>{titleFont}</span>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>

                {/* Title Color */}
                <div className="mb-3">
                  <label className="form-label">Title color</label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={titleColor}
                      onChange={(e) => {
                        setTitleColor(e.target.value)
                        handleUpdate({ nameColor: e.target.value })
                      }}
                      style={{ width: '50px', height: '50px' }}
                    />
                    <div 
                      className="flex-fill d-flex align-items-center justify-content-center"
                      style={{ 
                        height: '50px', 
                        borderRadius: '8px', 
                        border: '1px solid #ddd',
                        backgroundColor: '#fff'
                      }}
                    >
                      <div 
                        style={{ 
                          width: '30px', 
                          height: '30px', 
                          borderRadius: '50%', 
                          backgroundColor: titleColor,
                          border: '1px solid #ddd'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Title Size */}
                <div className="mb-4">
                  <label className="form-label">Title size</label>
                  <div className="d-flex gap-3">
                    <button
                      className={`btn ${titleSize === 'small' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                      onClick={() => {
                        setTitleSize('small')
                        handleUpdate({ titleSize: 'small' })
                      }}
                    >
                      Small
                    </button>
                    <button
                      className={`btn ${titleSize === 'large' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                      onClick={() => {
                        setTitleSize('large')
                        handleUpdate({ titleSize: 'large' })
                      }}
                    >
                      Large
                    </button>
                  </div>
                </div>

                {/* Page and Buttons Section */}
                <h6 className="mb-3">Page and buttons</h6>

                {/* Font */}
                <div className="mb-3">
                  <label className="form-label">Font</label>
                  <button 
                    className="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
                    onClick={() => {
                      setFontModalType('page')
                      setShowFontModal(true)
                    }}
                  >
                    <span>{pageFont}</span>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>

                {/* Page Text Color */}
                <div className="mb-3">
                  <label className="form-label">Page text color</label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={pageTextColor}
                      onChange={(e) => {
                        setPageTextColor(e.target.value)
                        handleUpdate({ pageTextColor: e.target.value })
                      }}
                      style={{ width: '50px', height: '50px' }}
                    />
                    <div 
                      className="flex-fill d-flex align-items-center justify-content-center"
                      style={{ 
                        height: '50px', 
                        borderRadius: '8px', 
                        border: '1px solid #ddd',
                        backgroundColor: '#fff'
                      }}
                    >
                      <div 
                        style={{ 
                          width: '30px', 
                          height: '30px', 
                          borderRadius: '50%', 
                          backgroundColor: pageTextColor,
                          border: '1px solid #ddd'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Button Text Color */}
                <div className="mb-3">
                  <label className="form-label">Button text color</label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={buttonTextColor}
                      onChange={(e) => {
                        setButtonTextColor(e.target.value)
                        handleUpdate({ buttonTextColor: e.target.value })
                      }}
                      style={{ width: '50px', height: '50px' }}
                    />
                    <div 
                      className="flex-fill d-flex align-items-center justify-content-center"
                      style={{ 
                        height: '50px', 
                        borderRadius: '8px', 
                        border: '1px solid #ddd',
                        backgroundColor: '#fff'
                      }}
                    >
                      <div 
                        style={{ 
                          width: '30px', 
                          height: '30px', 
                          borderRadius: '50%', 
                          backgroundColor: buttonTextColor,
                          border: '1px solid #ddd'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Buttons Tab */}
          {activeTab === 'buttons' && (
            <div className="vtree-section">
              <h5 className="mb-3" style={{ color: '#666' }}>Buttons</h5>
              <div className="bg-white rounded p-4" style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                
                {/* Button Style */}
                <div className="mb-4">
                  <label className="form-label">Button style</label>
                  <div className="d-flex gap-3">
                    <button
                      className={`btn ${buttonStyle === 'solid' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                      onClick={() => {
                        setButtonStyle('solid')
                        handleUpdate({ buttonStyle: 'solid' })
                      }}
                      style={{ 
                        height: '60px',
                        backgroundColor: buttonStyle === 'solid' ? '#333' : '#e0e0e0',
                        color: buttonStyle === 'solid' ? 'white' : '#666',
                        border: buttonStyle === 'solid' ? '2px solid #333' : '1px solid #ddd',
                        borderRadius: '12px'
                      }}
                    >
                      Solid
                    </button>
                    <button
                      className={`btn flex-fill`}
                      onClick={() => {
                        setButtonStyle('glass')
                        handleUpdate({ buttonStyle: 'glass' })
                      }}
                      style={{ 
                        height: '60px',
                        backgroundColor: buttonStyle === 'glass' ? 'rgba(255,255,255,0.3)' : '#f5f5f5',
                        color: '#666',
                        border: buttonStyle === 'glass' ? '2px solid #333' : '1px solid #ddd',
                        borderRadius: '12px',
                        backdropFilter: buttonStyle === 'glass' ? 'blur(10px)' : 'none'
                      }}
                    >
                      Glass
                      {buttonStyle === 'glass' && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#ccc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="bi bi-lock" style={{ fontSize: '10px', color: 'white' }}></i>
                        </div>
                      )}
                    </button>
                    <button
                      className={`btn flex-fill`}
                      onClick={() => {
                        setButtonStyle('outline')
                        handleUpdate({ buttonStyle: 'outline' })
                      }}
                      style={{ 
                        height: '60px',
                        backgroundColor: 'transparent',
                        color: '#666',
                        border: buttonStyle === 'outline' ? '2px solid #333' : '2px solid #ddd',
                        borderRadius: '12px'
                      }}
                    >
                      Outline
                    </button>
                  </div>
                </div>

                {/* Button Options */}
                <h6 className="mb-3">Button Options</h6>

                {/* Corners */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0">Corners</label>
                    <div className="d-flex gap-2">
                      <small className="text-muted">Square</small>
                      <small className="text-muted" style={{ marginLeft: '120px' }}>Round</small>
                    </div>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="100"
                    value={buttonCorners === 'square' ? 0 : buttonCorners === 'smooth' ? 50 : 100}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      let cornerValue = 'square'
                      if (val < 33) cornerValue = 'square'
                      else if (val < 67) cornerValue = 'smooth'
                      else cornerValue = 'rounded'
                      setButtonCorners(cornerValue)
                      handleUpdate({ buttonCorners: cornerValue })
                    }}
                  />
                </div>

                {/* Shadow */}
                <div className="mb-4">
                  <label className="form-label">Shadow</label>
                  <div className="d-flex gap-2">
                    <button
                      className={`btn ${buttonShadow === 'none' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                      onClick={() => {
                        setButtonShadow('none')
                        handleUpdate({ buttonShadow: 'none' })
                      }}
                      style={{ borderRadius: '20px' }}
                    >
                      None
                    </button>
                    <button
                      className={`btn ${buttonShadow === 'subtle' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                      onClick={() => {
                        setButtonShadow('subtle')
                        handleUpdate({ buttonShadow: 'subtle' })
                      }}
                      style={{ borderRadius: '20px' }}
                    >
                      Subtle
                    </button>
                    <button
                      className={`btn ${buttonShadow === 'strong' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                      onClick={() => {
                        setButtonShadow('strong')
                        handleUpdate({ buttonShadow: 'strong' })
                      }}
                      style={{ borderRadius: '20px' }}
                    >
                      Strong
                    </button>
                    <button
                      className={`btn ${buttonShadow === 'hard' ? 'btn-dark' : 'btn-outline-secondary'} flex-fill`}
                      onClick={() => {
                        setButtonShadow('hard')
                        handleUpdate({ buttonShadow: 'hard' })
                      }}
                      style={{ borderRadius: '20px' }}
                    >
                      Hard
                    </button>
                  </div>
                </div>

                {/* Colors */}
                <h6 className="mb-3">Colors</h6>

                {/* Button Color */}
                <div className="mb-3" style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label mb-0">Button color</label>
                    <div 
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: buttonColor,
                        border: '2px solid #ddd',
                        cursor: 'pointer'
                      }}
                      onClick={() => document.getElementById('buttonColorPicker').click()}
                    ></div>
                    <input
                      id="buttonColorPicker"
                      type="color"
                      value={buttonColor}
                      onChange={(e) => {
                        setButtonColor(e.target.value)
                        handleUpdate({ buttonColor: e.target.value })
                      }}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div className="mb-3" style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label mb-0">Text color</label>
                    <div 
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: buttonTextColor,
                        border: '2px solid #ddd',
                        cursor: 'pointer'
                      }}
                      onClick={() => document.getElementById('buttonTextColorPicker').click()}
                    ></div>
                    <input
                      id="buttonTextColorPicker"
                      type="color"
                      value={buttonTextColor}
                      onChange={(e) => {
                        setButtonTextColor(e.target.value)
                        handleUpdate({ buttonTextColor: e.target.value })
                      }}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="vtree-section">
              <h5 className="mb-3" style={{ color: '#666' }}>Colors</h5>
              <div className="bg-white rounded p-4" style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                
                {/* Wallpaper */}
                <div className="mb-3" style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label mb-0">Wallpaper</label>
                    <div 
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: wallpaperColor,
                        border: '2px solid #ddd',
                        cursor: 'pointer'
                      }}
                      onClick={() => document.getElementById('wallpaperColorPicker').click()}
                    ></div>
                    <input
                      id="wallpaperColorPicker"
                      type="color"
                      value={wallpaperColor}
                      onChange={(e) => {
                        setWallpaperColor(e.target.value)
                        handleUpdate({ bgColor: e.target.value })
                      }}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="mb-3" style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label mb-0">Title</label>
                    <div 
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: titleColor,
                        border: '2px solid #ddd',
                        cursor: 'pointer'
                      }}
                      onClick={() => document.getElementById('titleColorPicker2').click()}
                    ></div>
                    <input
                      id="titleColorPicker2"
                      type="color"
                      value={titleColor}
                      onChange={(e) => {
                        setTitleColor(e.target.value)
                        handleUpdate({ nameColor: e.target.value })
                      }}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Page text */}
                <div className="mb-3" style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label mb-0">Page text</label>
                    <div 
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: pageTextColor,
                        border: '2px solid #ddd',
                        cursor: 'pointer'
                      }}
                      onClick={() => document.getElementById('pageTextColorPicker2').click()}
                    ></div>
                    <input
                      id="pageTextColorPicker2"
                      type="color"
                      value={pageTextColor}
                      onChange={(e) => {
                        setPageTextColor(e.target.value)
                        handleUpdate({ pageTextColor: e.target.value })
                      }}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="mb-3" style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label mb-0">Buttons</label>
                    <div 
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: buttonColor,
                        border: '2px solid #ddd',
                        cursor: 'pointer'
                      }}
                      onClick={() => document.getElementById('buttonColorPicker2').click()}
                    ></div>
                    <input
                      id="buttonColorPicker2"
                      type="color"
                      value={buttonColor}
                      onChange={(e) => {
                        setButtonColor(e.target.value)
                        handleUpdate({ buttonColor: e.target.value })
                      }}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Button text */}
                <div className="mb-3" style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label mb-0">Button text</label>
                    <div 
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: buttonTextColor,
                        border: '2px solid #ddd',
                        cursor: 'pointer'
                      }}
                      onClick={() => document.getElementById('buttonTextColorPicker2').click()}
                    ></div>
                    <input
                      id="buttonTextColorPicker2"
                      type="color"
                      value={buttonTextColor}
                      onChange={(e) => {
                        setButtonTextColor(e.target.value)
                        handleUpdate({ buttonTextColor: e.target.value })
                      }}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Links Tab */}
          {activeTab === 'links' && (
            <div className="vtree-section">
              <div className="bg-white rounded p-4" style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                
                {/* Profile Header */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e0e0',
                    overflow: 'hidden'
                  }}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <i className="bi bi-person-fill" style={{ fontSize: '32px', color: '#999' }}></i>
                      </div>
                    )}
                  </div>
                  <div className="flex-fill">
                    <h6 className="mb-1">{titleText}</h6>
                  </div>
                </div>

                {/* Add Button */}
                <button 
                  className="btn w-100 mb-3" 
                  onClick={() => navigate && navigate('/links')}
                  style={{ 
                    backgroundColor: '#8b5cf6', 
                    color: 'white',
                    borderRadius: '24px',
                    padding: '12px',
                    fontWeight: '500'
                  }}
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Add
                </button>

                {/* Add collection & View archive */}
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <button className="btn btn-sm btn-link text-dark text-decoration-none">
                    <i className="bi bi-folder-plus me-1"></i>
                    Add collection
                  </button>
                  <button className="btn btn-sm btn-link text-dark text-decoration-none">
                    View archive
                    <i className="bi bi-chevron-right ms-1"></i>
                  </button>
                </div>

                {/* Links List */}
                {socialLinks && Object.keys(socialLinks).length > 0 && (
                  <div>
                    {Object.entries(socialLinks).map(([platform, url]) => {
                      if (!url || url.trim() === '') return null
                      
                      const platformNames = {
                        ig: 'Instagram',
                        facebook: 'Facebook',
                        x: 'X (Twitter)',
                        spotify: 'Spotify',
                        discord: 'Discord',
                        google: 'Google',
                        line: 'Line',
                        tiktok: 'TikTok',
                        github: 'GitHub'
                      }
                      
                      const platformIcons = {
                        ig: 'instagram',
                        facebook: 'facebook',
                        x: 'twitter-x',
                        spotify: 'spotify',
                        discord: 'discord',
                        google: 'google',
                        line: 'line',
                        tiktok: 'tiktok',
                        github: 'github'
                      }
                      
                      return (
                        <div key={platform} className="border rounded p-3 mb-3" style={{ backgroundColor: 'white' }}>
                          <div className="d-flex align-items-start">
                            <div className="flex-fill">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center gap-2">
                                  <i className={`bi bi-${platformIcons[platform] || 'link'}`} style={{ fontSize: '20px' }}></i>
                                  <div>
                                    <h6 className="mb-0">
                                      {platformNames[platform] || platform}
                                    </h6>
                                    <small className="text-primary">{url}</small>
                                  </div>
                                </div>
                                <div className="form-check form-switch">
                                  <input className="form-check-input" type="checkbox" defaultChecked />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

              </div>
            </div>
          )}

          </div>

          {/* Right Column: Mobile Preview */}
          <div className="col-lg-6 d-flex justify-content-center align-items-start" style={{ position: 'sticky', top: '20px', paddingTop: '0' }}>
            <div style={{
              width: '380px',
              height: '760px',
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              marginTop: '0'
            }}>
              {/* Background Layer */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: wallpaperStyle === 'gradient' 
                  ? `linear-gradient(180deg, ${wallpaperColor} 0%, ${wallpaperColor}dd 100%)`
                  : wallpaperStyle === 'image' && wallpaperImage
                  ? `url(${wallpaperImage}) center/cover`
                  : wallpaperColor,
                backgroundColor: wallpaperStyle === 'fill' ? wallpaperColor : undefined,
                filter: wallpaperStyle === 'blur' ? 'blur(8px)' : 'none',
                transform: wallpaperStyle === 'blur' ? 'scale(1.1)' : 'none'
              }}></div>

              {/* Overlay Layer */}
              {(wallpaperStyle === 'image' || wallpaperStyle === 'video') && overlayOpacity > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
                  zIndex: 0
                }}></div>
              )}

              {/* Content Layer (Not blurred) */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100%',
                overflow: 'auto'
              }}>
                <div className="d-flex flex-column align-items-center" style={{ minHeight: '100%' }}>
                  
                  {/* Profile Image - Vfull or Classic */}
                  {profileImageLayout === 'vfull' ? (
                    // Vfull Layout
                    <>
                      <div style={{
                        width: '100%',
                        position: 'relative'
                      }}>
                        {/* Profile Image */}
                        <div style={{
                          width: '100%',
                          height: '300px',
                          backgroundColor: '#e0e0e0',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          {profileImage ? (
                            <img 
                              src={profileImage} 
                              alt="Profile" 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }} 
                            />
                          ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                              <i className="bi bi-person-fill" style={{ fontSize: '64px', color: '#999' }}></i>
                            </div>
                          )}
                        </div>

                        {/* Rounded bottom gradient overlay */}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '150px',
                          background: `radial-gradient(ellipse 120% 100% at 50% 0%, transparent 0%, transparent 40%, ${wallpaperColor}88 70%, ${wallpaperColor} 100%)`,
                          pointerEvents: 'none'
                        }}></div>
                      </div>
                      
                      {/* Profile Name */}
                      <h5 style={{ 
                        color: titleColor,
                        marginTop: '20px',
                        marginBottom: '16px',
                        fontSize: titleSize === 'large' ? '24px' : '18px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontFamily: titleFont
                      }}>
                        {titleText}
                      </h5>
                    </>
                  ) : (
                    // Classic Layout
                    <>
                      <div style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e0e0',
                        marginTop: '60px',
                        marginBottom: '16px',
                        overflow: 'hidden'
                      }}>
                        {profileImage ? (
                          <img 
                            src={profileImage} 
                            alt="Profile" 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }} 
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <i className="bi bi-person-fill" style={{ fontSize: '48px', color: '#999' }}></i>
                          </div>
                        )}
                      </div>

                      {/* Profile Name for Classic */}
                      <h5 style={{ 
                        color: titleColor,
                        marginBottom: '16px',
                        fontSize: titleSize === 'large' ? '24px' : '18px',
                        fontWeight: 'bold',
                        fontFamily: titleFont
                      }}>
                        {titleText}
                      </h5>
                    </>
                  )}

                  {/* Social Links Buttons - Add padding */}
                  <div className="px-3 w-100" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: pageFont }}>
                  {profile.socialLinks && Object.entries(profile.socialLinks).map(([platform, url]) => {
                    if (!url) return null
                    
                    const platformNames = {
                      ig: 'Instagram',
                      facebook: 'Facebook',
                      x: 'X',
                      spotify: 'Spotify',
                      discord: 'Discord',
                      google: 'Google',
                      line: 'Line',
                      tiktok: 'TikTok',
                      github: 'GitHub'
                    }

                    const platformIcons = {
                      ig: 'instagram',
                      facebook: 'facebook',
                      x: 'twitter-x',
                      spotify: 'spotify',
                      discord: 'discord',
                      google: 'google',
                      line: 'line',
                      tiktok: 'tiktok',
                      github: 'github'
                    }

                    const getButtonStyle = () => {
                      const baseStyle = {
                        width: '100%',
                        padding: '12px 20px',
                        marginBottom: '12px',
                        border: 'none',
                        borderRadius: buttonCorners === 'rounded' ? '24px' : buttonCorners === 'smooth' ? '12px' : '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }

                      const getShadow = () => {
                        if (buttonShadow === 'none') return 'none'
                        if (buttonShadow === 'subtle') return '0 2px 4px rgba(0,0,0,0.1)'
                        if (buttonShadow === 'strong') return '0 4px 12px rgba(0,0,0,0.2)'
                        if (buttonShadow === 'hard') return '0 6px 20px rgba(0,0,0,0.3)'
                        return 'none'
                      }

                      if (buttonStyle === 'solid') {
                        return {
                          ...baseStyle,
                          backgroundColor: buttonColor,
                          color: buttonTextColor,
                          boxShadow: getShadow()
                        }
                      } else if (buttonStyle === 'glass') {
                        return {
                          ...baseStyle,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: buttonTextColor,
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.3)',
                          boxShadow: getShadow()
                        }
                      } else { // outline
                        return {
                          ...baseStyle,
                          backgroundColor: 'transparent',
                          color: buttonTextColor,
                          border: `2px solid ${buttonColor}`,
                          boxShadow: getShadow()
                        }
                      }
                    }

                    return (
                      <button 
                        key={platform} 
                        style={getButtonStyle()}
                        onClick={() => window.open(url, '_blank')}
                      >
                        <i className={`bi bi-${platformIcons[platform] || 'link'}`}></i>
                        {platformNames[platform] || platform}
                      </button>
                    )
                  })}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                    VERE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
