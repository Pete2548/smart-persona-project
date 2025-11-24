import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getAllProfiles } from '../services/profileManager'
import './profileview.css'

// IndexedDB helper
const getAudioFromDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ProfileDB', 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('audio')) {
        resolve(null)
        return
      }
      const transaction = db.transaction(['audio'], 'readonly')
      const store = transaction.objectStore('audio')
      const getRequest = store.get('userAudio')
      getRequest.onsuccess = () => resolve(getRequest.result)
      getRequest.onerror = () => reject(getRequest.error)
    }
  })
}

const ProfileView = () => {
  const { username, profileType } = useParams()
  const [profile, setProfile] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const audioRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    // load saved profile
    const loadProfile = async () => {
      try {
        // Try to load from multi-profile system first
        const allProfiles = getAllProfiles()
        if (allProfiles && allProfiles.length > 0) {
          let targetProfile = null
          
          // If profileType is specified, find matching profile
          if (profileType) {
            targetProfile = allProfiles.find(p => 
              p.data.username === username && p.type === profileType
            )
          } else {
            // Otherwise, find first profile matching username
            targetProfile = allProfiles.find(p => 
              p.data.username === username
            )
          }
          
          if (targetProfile) {
            setProfile(targetProfile.data)
            
            // Load audio from IndexedDB if exists
            if (targetProfile.data.hasAudio) {
              try {
                const audioData = await getAudioFromDB()
                setAudioFile(audioData)
              } catch (err) {
                console.warn('Failed to load audio from DB', err)
                setAudioFile(null)
              }
            } else {
              setAudioFile(null)
            }
            return
          }
        }
        
        // Fallback: try old single profile system
        const raw = localStorage.getItem('user_profile')
        if (raw) {
          const p = JSON.parse(raw)
          if (!username || p.username === username) {
            setProfile(p)
            
            // Load audio from IndexedDB if exists
            if (p.hasAudio) {
              try {
                const audioData = await getAudioFromDB()
                setAudioFile(audioData)
              } catch (err) {
                console.warn('Failed to load audio from DB', err)
                setAudioFile(null)
              }
            } else {
              setAudioFile(null)
            }
            return
          }
        }
      } catch (err) {
        console.warn('Failed to load profile', err)
      }
      setProfile(null)
      setAudioFile(null)
    }
    loadProfile()
  }, [username, profileType])

  // Handle audio playback with start/end time
  useEffect(() => {
    if (audioRef.current && audioFile && profile) {
      const audio = audioRef.current
      const startTime = profile.audioStartTime || 0
      const endTime = profile.audioEndTime || 0
      
      console.log('Audio setup:', { audioFile: !!audioFile, startTime, endTime, isMuted })
      
      const handleLoadedMetadata = () => {
        console.log('Audio loaded, duration:', audio.duration)
        audio.volume = isMuted ? 0 : 1
        audio.currentTime = startTime
        console.log('Attempting to play, volume:', audio.volume)
        audio.play()
          .then(() => console.log('Audio playing successfully'))
          .catch(err => console.log('Autoplay prevented:', err))
      }
      
      const handleVolumeChange = () => {
        console.log('Volume changed to:', audio.volume)
      }
      
      const handleTimeUpdate = () => {
        if (endTime > 0 && audio.currentTime >= endTime) {
          audio.currentTime = startTime
        }
      }
      
      const handleEnded = () => {
        audio.currentTime = startTime
        audio.play().catch(err => console.log('Loop play prevented:', err))
      }
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('volumechange', handleVolumeChange)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      
      // Try to load
      audio.load()
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('volumechange', handleVolumeChange)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [audioFile, profile, isMuted])

  // Separate effect for volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 1
    }
  }, [isMuted])

  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    if (audioRef.current) {
      audioRef.current.volume = newMutedState ? 0 : 1
    }
  }

  if (!profile) {
    return (
      <div className="profile-view-wrapper">
        <div className="profile-empty-card">Profile not found</div>
      </div>
    )
  }
  const cardStyle = {
    background: profile.bgImage ? 'transparent' : (profile.blockColor || undefined),
  }

  // helper to create rgba shadow from hex
  const hexToRgba = (hex, alpha) => {
    if (!hex) return `rgba(30,111,184,${alpha})`
    const h = hex.replace('#','')
    const normalized = h.length === 3 ? h.split('').map(c=>c+c).join('') : h
    const bigint = parseInt(normalized, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r},${g},${b},${alpha})`
  }

  // build a multi-layered glow (strong neon / soft halo) from hex color
  const buildTextGlow = (hex) => {
    const c1 = hexToRgba(hex, 0.95) // inner bright
    const c2 = hexToRgba(hex, 0.6)  // mid glow
    const c3 = hexToRgba(hex, 0.35) // outer glow
    const dark1 = 'rgba(0,0,0,0.7)'
    const dark2 = 'rgba(0,0,0,0.45)'
    return [
      `0 2px 0 ${dark1}`,
      `0 6px 14px ${dark2}`,
      `0 0 6px ${c1}`,
      `0 0 18px ${c2}`,
      `0 0 40px ${c3}`,
      `0 0 90px ${c3}`,
    ].join(', ')
  }

  // compute relative luminance of a hex color (0..1)
  const hexLuminance = (hex) => {
    if (!hex) return 0
    const h = hex.replace('#','')
    const normalized = h.length === 3 ? h.split('').map(c=>c+c).join('') : h
    const bigint = parseInt(normalized, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    // sRGB luminance
    const srgb = [r,g,b].map(v => {
      const s = v/255
      return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4)
    })
    return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2]
  }

  const usernameStyle = {
    color: profile.nameColor || undefined,
    textShadow: buildTextGlow(profile.nameColor)
  }

  // description color: use saved descColor if present, otherwise pick dark or light based on page background luminance
  const bg = profile.bgColor || '#050505'
  const descColor = profile.descColor ? profile.descColor : (hexLuminance(bg) > 0.6 ? 'rgba(17,24,39,0.9)' : 'rgba(255,255,255,0.85)')


  const wrapperStyle = profile && profile.bgImage ? (() => {
    const overlay = typeof profile.bgOverlay === 'number' ? profile.bgOverlay : 0.3
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,${overlay}), rgba(0,0,0,${overlay})), url(${profile.bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      padding: '48px 16px'
    }
  })() : { background: profile.bgColor || '#050505' }

  // Get layout type from profile or default
  const layoutType = profile.layout || 'default'
  const layoutSettings = profile.layoutSettings || {}
  const vereElements = profile.vereElements || []

  // If vere elements exist, render vere layout
  if (vereElements.length > 0) {
    return (
      <div className="profile-view-wrapper" style={wrapperStyle}>
        {audioFile && (
          <div style={{
            position: 'fixed',
            top: 20,
            left: 20,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            padding: '12px 16px',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <button 
              onClick={toggleMute}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                fontSize: 14
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 8}}>
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                  Muted
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 8}}>
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                  Playing
                </>
              )}
            </button>
          </div>
        )}

        {/* Render Vere Elements */}
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
          {vereElements.map(element => (
            <div
              key={element.id}
              style={{
                position: 'absolute',
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                ...element.style
              }}
            >
              {element.type === 'text' && (
                <div style={{ 
                  width: '100%', 
                  height: '100%',
                  overflow: 'hidden',
                  wordWrap: 'break-word'
                }}>
                  {element.content}
                </div>
              )}
              {element.type === 'image' && element.content && (
                <img 
                  src={element.content} 
                  alt="element" 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: element.style.objectFit || 'cover'
                  }}
                />
              )}
              {element.type === 'shape' && (
                <div style={{ width: '100%', height: '100%' }}></div>
              )}
            </div>
          ))}
        </div>

        {audioFile && (
          <audio ref={audioRef} preload="auto" style={{display: 'none'}}>
            <source src={audioFile} type="audio/mpeg" />
            <source src={audioFile} type="video/mp4" />
          </audio>
        )}
      </div>
    )
  }

  // Render different layouts based on type
  const renderLayout = () => {
    const commonAudioControl = audioFile && (
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '12px 16px',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        <button 
          onClick={toggleMute}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            fontSize: 14
          }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 8}}>
                <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
              Muted
            </>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 8}}>
                <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              Playing
            </>
          )}
        </button>
      </div>
    )

    const commonAudioElement = audioFile && (
      <audio ref={audioRef} preload="auto" style={{display: 'none'}}>
        <source src={audioFile} type="audio/mpeg" />
        <source src={audioFile} type="video/mp4" />
      </audio>
    )

    // Default Card Layout
    if (layoutType === 'default') {
      const cardStyle = {
        background: profile.bgImage ? 'transparent' : (profile.blockColor || undefined),
      }
      
      return (
        <>
          {commonAudioControl}
          <div className="profile-card" style={cardStyle}>
            <div className="profile-center">
              {profile.avatar && (
                <img src={profile.avatar} alt="avatar" className="avatar-circle" style={{
                  boxShadow: `0 12px 36px ${hexToRgba(profile.nameColor, 0.28)}`,
                  border: `4px solid ${hexToRgba(profile.nameColor, 0.12)}`
                }} />
              )}
              <div className="username-glow" style={usernameStyle}>{profile.username}</div>
              <div className="profile-description" style={{color: descColor, marginTop: 8, fontSize: 16, textAlign: 'center'}}>{profile.description}</div>
              {commonAudioElement}
            </div>
          </div>
        </>
      )
    }

    // Linktree Style Layout - Centered minimal design
    if (layoutType === 'linktree') {
      return (
        <>
          {commonAudioControl}
          <div style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            {profile.avatar && (
              <img 
                src={profile.avatar} 
                alt="avatar" 
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: 20,
                  border: `3px solid ${profile.nameColor || '#fff'}`
                }} 
              />
            )}
            <h1 style={{
              fontSize: 24,
              fontWeight: 700,
              color: profile.nameColor || '#fff',
              marginBottom: 8
            }}>
              {profile.displayName || profile.username}
            </h1>
            <p style={{
              fontSize: 15,
              color: descColor,
              marginBottom: 32,
              maxWidth: 480,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              {profile.description}
            </p>
            {/* Placeholder for link buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxWidth: 480,
              margin: '0 auto'
            }}>
              <div style={{
                background: profile.blockColor || '#fff',
                padding: '16px 24px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                color: profile.nameColor || '#000'
              }}>
                Link Button Example
              </div>
            </div>
            {commonAudioElement}
          </div>
        </>
      )
    }

    // LinkedIn Professional Layout
    if (layoutType === 'linkedin') {
      return (
        <>
          {commonAudioControl}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px'
          }}>
            {/* Header Card */}
            <div style={{
              background: profile.blockColor || '#fff',
              borderRadius: 12,
              padding: '32px',
              marginBottom: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{display: 'flex', gap: 24, alignItems: 'flex-start'}}>
                {profile.avatar && (
                  <img 
                    src={profile.avatar} 
                    alt="avatar" 
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `4px solid ${profile.nameColor || '#0a66c2'}`
                    }} 
                  />
                )}
                <div style={{flex: 1}}>
                  <h1 style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: profile.nameColor || '#000',
                    marginBottom: 4
                  }}>
                    {profile.displayName || profile.username}
                  </h1>
                  <p style={{
                    fontSize: 16,
                    color: descColor,
                    marginBottom: 16,
                    lineHeight: 1.5
                  }}>
                    {profile.description}
                  </p>
                </div>
              </div>
            </div>
            {/* Content Section Placeholder */}
            <div style={{
              background: profile.blockColor || '#fff',
              borderRadius: 12,
              padding: '24px 32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontSize: 20,
                fontWeight: 600,
                color: profile.nameColor || '#000',
                marginBottom: 16
              }}>
                About
              </h2>
              <p style={{
                fontSize: 15,
                color: descColor,
                lineHeight: 1.6
              }}>
                Professional profile section
              </p>
            </div>
            {commonAudioElement}
          </div>
        </>
      )
    }

    // Guns.lol Neon Style
    if (layoutType === 'guns') {
      return (
        <>
          {commonAudioControl}
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            position: 'relative'
          }}>
            {profile.avatar && (
              <div style={{
                display: 'inline-block',
                position: 'relative',
                marginBottom: 32
              }}>
                <img 
                  src={profile.avatar} 
                  alt="avatar" 
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `4px solid ${profile.nameColor || '#00ff88'}`,
                    boxShadow: `0 0 40px ${hexToRgba(profile.nameColor, 0.6)}, 0 0 80px ${hexToRgba(profile.nameColor, 0.3)}`
                  }} 
                />
              </div>
            )}
            <h1 style={{
              fontSize: 48,
              fontWeight: 700,
              color: profile.nameColor || '#00ff88',
              textShadow: buildTextGlow(profile.nameColor),
              marginBottom: 16,
              letterSpacing: 2
            }}>
              {profile.displayName || profile.username}
            </h1>
            <p style={{
              fontSize: 18,
              color: descColor,
              marginBottom: 48,
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}>
              {profile.description}
            </p>
            {commonAudioElement}
          </div>
        </>
      )
    }

    // Minimal Clean Layout
    if (layoutType === 'minimal') {
      return (
        <>
          {commonAudioControl}
          <div style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: '100px 20px',
            textAlign: 'left'
          }}>
            {profile.avatar && (
              <img 
                src={profile.avatar} 
                alt="avatar" 
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: 24
                }} 
              />
            )}
            <h1 style={{
              fontSize: 32,
              fontWeight: 300,
              color: profile.nameColor || '#000',
              marginBottom: 12,
              letterSpacing: '-0.5px'
            }}>
              {profile.displayName || profile.username}
            </h1>
            <p style={{
              fontSize: 16,
              color: descColor,
              lineHeight: 1.7,
              maxWidth: 560
            }}>
              {profile.description}
            </p>
            {commonAudioElement}
          </div>
        </>
      )
    }

    // Custom Advanced Layout
    if (layoutType === 'custom') {
      const settings = {
        avatarAlignment: layoutSettings.avatarAlignment || 'center',
        avatarSize: layoutSettings.avatarSize || 120,
        avatarVisible: layoutSettings.avatarVisible !== false,
        nameAlignment: layoutSettings.nameAlignment || 'center',
        nameFontSize: layoutSettings.nameFontSize || 32,
        nameVisible: layoutSettings.nameVisible !== false,
        descAlignment: layoutSettings.descAlignment || 'center',
        descFontSize: layoutSettings.descFontSize || 16,
        descVisible: layoutSettings.descVisible !== false,
        contentVerticalAlign: layoutSettings.contentVerticalAlign || 'center',
        contentPadding: layoutSettings.contentPadding || 48,
        elementSpacing: layoutSettings.elementSpacing || 16
      }

      const getJustifyContent = (align) => {
        if (align === 'left') return 'flex-start'
        if (align === 'right') return 'flex-end'
        return 'center'
      }

      const getTextAlign = (align) => align

      return (
        <>
          {commonAudioControl}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: settings.contentVerticalAlign === 'top' ? 'flex-start' : 
                           settings.contentVerticalAlign === 'bottom' ? 'flex-end' : 'center',
            minHeight: '100vh',
            padding: `${settings.contentPadding}px 20px`
          }}>
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              width: '100%'
            }}>
              {/* Avatar */}
              {settings.avatarVisible && profile.avatar && (
                <div style={{
                  display: 'flex',
                  justifyContent: getJustifyContent(settings.avatarAlignment),
                  marginBottom: settings.elementSpacing
                }}>
                  <img 
                    src={profile.avatar} 
                    alt="avatar" 
                    style={{
                      width: settings.avatarSize,
                      height: settings.avatarSize,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `3px solid ${profile.nameColor || '#fff'}`
                    }} 
                  />
                </div>
              )}

              {/* Name */}
              {settings.nameVisible && (
                <h1 style={{
                  fontSize: settings.nameFontSize,
                  fontWeight: 600,
                  color: profile.nameColor || '#fff',
                  marginBottom: settings.elementSpacing,
                  textAlign: getTextAlign(settings.nameAlignment),
                  textShadow: buildTextGlow(profile.nameColor)
                }}>
                  {profile.displayName || profile.username}
                </h1>
              )}

              {/* Description */}
              {settings.descVisible && profile.description && (
                <p style={{
                  fontSize: settings.descFontSize,
                  color: descColor,
                  lineHeight: 1.6,
                  textAlign: getTextAlign(settings.descAlignment),
                  margin: 0
                }}>
                  {profile.description}
                </p>
              )}
            </div>
            {commonAudioElement}
          </div>
        </>
      )
    }

    // Fallback to default if unknown layout
    return renderLayout.call({ layoutType: 'default' })
  }

  return (
    <div className="profile-view-wrapper" style={wrapperStyle}>
      {renderLayout()}
    </div>
  )
}

export default ProfileView
