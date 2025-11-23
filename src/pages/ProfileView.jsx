import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
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
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const audioRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    // load saved profile
    const loadProfile = async () => {
      try {
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
  }, [username])

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
            {audioFile && (
              <audio ref={audioRef} preload="auto" style={{display: 'none'}}>
                <source src={audioFile} type="audio/mpeg" />
                <source src={audioFile} type="video/mp4" />
              </audio>
            )}
        </div>
        {/* profile-right removed per user request (no copy link) */}
      </div>
    </div>
  )
}

export default ProfileView
