import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'
import './customize.css';
import './dashboard.css'

// IndexedDB helper functions
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ProfileDB', 1)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
        request.onupgradeneeded = (event) => {
            const db = event.target.result
            if (!db.objectStoreNames.contains('audio')) {
                db.createObjectStore('audio')
            }
        }
    })
}

const saveAudioToDB = async (audioData) => {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['audio'], 'readwrite')
        const store = transaction.objectStore('audio')
        const request = store.put(audioData, 'userAudio')
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}

const getAudioFromDB = async () => {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['audio'], 'readonly')
        const store = transaction.objectStore('audio')
        const request = store.get('userAudio')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

const deleteAudioFromDB = async () => {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['audio'], 'readwrite')
        const store = transaction.objectStore('audio')
        const request = store.delete('userAudio')
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}

const Customize = () => {
    const [username, setUsername] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [description, setDescription] = useState('')
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [bgImage, setBgImage] = useState(null)
    const [bgOverlay, setBgOverlay] = useState(0.3)
    const [nameColor, setNameColor] = useState('#1E6FB8')
    const [blockColor, setBlockColor] = useState('#ffffff')
    const [bgColor, setBgColor] = useState('#050505')
    const [descColor, setDescColor] = useState('#ffffff')
    const [audioFile, setAudioFile] = useState(null)
    const [audioFileName, setAudioFileName] = useState('')
    const [audioStartTime, setAudioStartTime] = useState(0)
    const [audioEndTime, setAudioEndTime] = useState(0)
    const [audioDuration, setAudioDuration] = useState(0)

    // Helper to format seconds to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const raw = localStorage.getItem('user_profile')
                if (raw) {
                    const p = JSON.parse(raw)
                    setUsername(p.username || '')
                    setDisplayName(p.displayName || '')
                    setDescription(p.description || '')
                    setAvatarPreview(p.avatar || null)
                    setBgImage(p.bgImage || null)
                    setBgOverlay(typeof p.bgOverlay === 'number' ? p.bgOverlay : 0.3)
                    setNameColor(p.nameColor || '#1E6FB8')
                    setBlockColor(p.blockColor || '#ffffff')
                    setBgColor(p.bgColor || '#050505')
                    setDescColor(p.descColor || '#ffffff')
                    setAudioFileName(p.audioFileName || '')
                    setAudioStartTime(p.audioStartTime || 0)
                    setAudioEndTime(p.audioEndTime || 0)
                    
                    // Load audio from IndexedDB
                    if (p.hasAudio) {
                        const audioData = await getAudioFromDB()
                        if (audioData) {
                            setAudioFile(audioData)
                            // Get duration again
                            const audio = new Audio(audioData)
                            audio.addEventListener('loadedmetadata', () => {
                                setAudioDuration(Math.floor(audio.duration))
                            })
                        }
                    }
                }
            } catch (err) {
                console.warn('Failed to load user_profile', err)
            }
        }
        loadProfile()
    }, [])

    const handleProfileUpload = (e) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            setAvatarPreview(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const handleBgUpload = (e) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            setBgImage(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const clearBgImage = () => {
        setBgImage(null)
    }

    const handleAudioUpload = (e) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            const audioUrl = reader.result
            setAudioFile(audioUrl)
            setAudioFileName(file.name)
            // Load audio to get duration
            const audio = new Audio(audioUrl)
            audio.addEventListener('loadedmetadata', () => {
                const duration = Math.floor(audio.duration)
                setAudioDuration(duration)
                setAudioStartTime(0)
                setAudioEndTime(duration)
            })
        }
        reader.readAsDataURL(file)
    }

    const clearAudio = async () => {
        try {
            await deleteAudioFromDB()
        } catch (err) {
            console.warn('Failed to delete audio from DB', err)
        }
        setAudioFile(null)
        setAudioFileName('')
        setAudioStartTime(0)
        setAudioEndTime(0)
        setAudioDuration(0)
    }

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

    const hexLuminance = (hex) => {
        if (!hex) return 0
        const h = hex.replace('#','')
        const normalized = h.length === 3 ? h.split('').map(c=>c+c).join('') : h
        const bigint = parseInt(normalized, 16)
        const r = (bigint >> 16) & 255
        const g = (bigint >> 8) & 255
        const b = bigint & 255
        const srgb = [r,g,b].map(v => {
            const s = v/255
            return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4)
        })
        return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2]
    }

    const buildTextGlow = (hex) => {
        const c1 = hexToRgba(hex, 0.95)
        const c2 = hexToRgba(hex, 0.6)
        const c3 = hexToRgba(hex, 0.35)
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

    const saveProfile = async () => {
        try {
            // Save audio to IndexedDB first
            if (audioFile) {
                await saveAudioToDB(audioFile)
            }
            
            const profile = {
                username: username.trim() || 'me',
                displayName,
                description,
                avatar: avatarPreview || null,
                bgImage: bgImage || null,
                bgOverlay: bgOverlay,
                nameColor,
                blockColor,
                bgColor,
                descColor,
                hasAudio: !!audioFile,
                audioFileName: audioFileName || '',
                audioStartTime: audioStartTime || 0,
                audioEndTime: audioEndTime || 0,
            }
            
            localStorage.setItem('user_profile', JSON.stringify(profile))
            alert('Profile saved — click View Profile to open it')
        } catch (err) {
            if (err.name === 'QuotaExceededError') {
                alert('Error: Storage quota exceeded. Please use smaller images.')
            } else {
                alert('Error saving profile: ' + err.message)
            }
            console.error('Save error:', err)
        }
    }

    // preview wrapper style depends on optional bgImage (image) or bgColor
    const previewWrapperStyle = bgImage ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 10,
        padding: 20
    } : { background: bgColor || '#0b0b0b', borderRadius:10, padding:20 }

    return (
        <div className="dashboard-shell p-4">
            <div className="dashboard-card d-flex">
                <Sidebar />

                <main className="dashboard-main p-4">
                    <div className="customize-container">
                        <h2 className="customize-title">Customization</h2>

                        <div className="customize-card mb-4">
                            <div className="customize-row">
                                <div className="form-group">
                                    <label className="form-label">Username (public)</label>
                                    <input value={username} onChange={e => setUsername(e.target.value)} className="form-control neutral-input" placeholder="your-username" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Displayname</label>
                                    <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="form-control neutral-input" placeholder="this is my name" />
                                </div>

                                <div className="form-group w-100">
                                    <label className="form-label">Description</label>
                                    <input value={description} onChange={e => setDescription(e.target.value)} className="form-control neutral-input" placeholder="this is my Description" />
                                </div>
                            </div>

                            <div className="customize-row mt-3">
                                <div className="form-group">
                                    <label className="form-label">Name color</label>
                                    <div className="d-flex align-items-center gap-2">
                                        <input type="color" value={nameColor} onChange={e => setNameColor(e.target.value)} className="form-control form-control-color" style={{width:56, height:36, padding:4}} />
                                        <input type="text" value={nameColor} onChange={e => setNameColor(e.target.value)} className="form-control neutral-input" style={{maxWidth:140}} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Block background</label>
                                    <div className="d-flex align-items-center gap-2">
                                        <input type="color" value={blockColor} onChange={e => setBlockColor(e.target.value)} className="form-control form-control-color" style={{width:56, height:36, padding:4}} />
                                        <input type="text" value={blockColor} onChange={e => setBlockColor(e.target.value)} className="form-control neutral-input" style={{maxWidth:140}} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description color</label>
                                    <div className="d-flex align-items-center gap-2">
                                        <input type="color" value={descColor} onChange={e => setDescColor(e.target.value)} className="form-control form-control-color" style={{width:56, height:36, padding:4}} />
                                        <input type="text" value={descColor} onChange={e => setDescColor(e.target.value)} className="form-control neutral-input" style={{maxWidth:140}} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Page background</label>
                                    <div className="d-flex align-items-center gap-2">
                                        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="form-control form-control-color" style={{width:56, height:36, padding:4}} />
                                        <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="form-control neutral-input" style={{maxWidth:140}} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 d-flex justify-content-end">
                                <button className="btn btn-dark" onClick={saveProfile}>Save Profile</button>
                            </div>
                        </div>

                        <h3 className="customize-title">Assets Uploader</h3>
                        <div className="customize-card assets-grid">
                            <div className="asset-item">
                                <label className="asset-box" htmlFor="bg-upload">
                                    {bgImage ? (
                                        <img src={bgImage} alt="background preview" className="asset-bg-thumb" />
                                    ) : (
                                    <>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                    <div className="asset-label">upload a file</div>
                                    </>
                                    )}
                                </label>
                                <div className="d-flex align-items-center" style={{gap:8, marginTop:8}}>
                                    <div className="asset-title">Background</div>
                                    {bgImage && (
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearBgImage} style={{marginLeft:8}}>Remove</button>
                                    )}
                                </div>
                                <input id="bg-upload" onChange={handleBgUpload} type="file" accept="image/*" className="d-none" />
                            </div>

                            <div className="asset-item">
                                <label className="asset-box" htmlFor="audio-upload">
                                    {audioFile ? (
                                        <div style={{padding:12, textAlign:'center'}}>
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#4CAF50" stroke="#4CAF50" strokeWidth="2" aria-hidden>
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="10 8 16 12 10 16 10 8" fill="white"></polyline>
                                            </svg>
                                            <div className="asset-label" style={{fontSize:11, marginTop:4, wordBreak:'break-word'}}>{audioFileName}</div>
                                        </div>
                                    ) : (
                                        <>
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                            <div className="asset-label">upload audio file</div>
                                        </>
                                    )}
                                </label>
                                <div className="d-flex align-items-center" style={{gap:8, marginTop:8}}>
                                    <div className="asset-title">Audio</div>
                                    {audioFile && (
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearAudio} style={{marginLeft:8}}>Remove</button>
                                    )}
                                </div>
                                <input id="audio-upload" onChange={handleAudioUpload} type="file" accept="audio/*,video/mp4" className="d-none" />
                                {audioFile && audioDuration > 0 && (
                                    <div style={{marginTop:12, fontSize:12}}>
                                        <div style={{marginBottom:6}}>
                                            <label style={{display:'block', marginBottom:4}}>Start: {formatTime(audioStartTime)}</label>
                                            <input type="range" min="0" max={audioDuration} value={audioStartTime} onChange={(e) => {
                                                const val = Number(e.target.value)
                                                if (val < audioEndTime) setAudioStartTime(val)
                                            }} style={{width:'100%'}} />
                                        </div>
                                        <div>
                                            <label style={{display:'block', marginBottom:4}}>End: {formatTime(audioEndTime)}</label>
                                            <input type="range" min="0" max={audioDuration} value={audioEndTime} onChange={(e) => {
                                                const val = Number(e.target.value)
                                                if (val > audioStartTime) setAudioEndTime(val)
                                            }} style={{width:'100%'}} />
                                        </div>
                                        <div style={{marginTop:4, color:'#666'}}>Duration: {formatTime(audioEndTime - audioStartTime)} / {formatTime(audioDuration)}</div>
                                    </div>
                                )}
                            </div>

                            <div className="asset-item">
                                <label className="asset-box profile-box" htmlFor="profile-upload">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="avatar preview" className="avatar-preview" />
                                    ) : (
                                        <>
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                            <div className="asset-label">upload a file</div>
                                        </>
                                    )}
                                </label>
                                <div className="asset-title">Profile</div>
                                <input id="profile-upload" onChange={handleProfileUpload} type="file" accept="image/*" className="d-none" />
                            </div>
                        </div>

                            <div className="customize-card mt-4">
                            <h4 className="mb-3">Preview</h4>
                            <div className="d-flex align-items-center" style={{gap:12, marginBottom:8}}>
                                <div style={{display:'flex', alignItems:'center', gap:12}}>
                                    <label className="form-label mb-0 ">Background overlay</label>
                                    <input type="range" min={0} max={100} value={Math.round(bgOverlay*100)} onChange={e => setBgOverlay(Number(e.target.value)/100)} />
                                    <div style={{minWidth:42, textAlign:'center'}}>{Math.round(bgOverlay*100)}%</div>
                                </div>
                            </div>
                            <div className="preview-wrapper" style={previewWrapperStyle}>
                                <div className="preview-content" style={{
                                    width:'100%',
                                    maxWidth:760,
                                    padding: bgImage ? 24 : 12,
                                    background: bgImage ? 'transparent' : (blockColor || '#ffffff'),
                                    borderRadius: bgImage ? 0 : 8,
                                    textAlign:'center'
                                }}>
                                    {avatarPreview && (
                                        <img src={avatarPreview} alt="avatar preview" className="avatar-preview-large avatar-circle" style={{
                                            boxShadow: `0 10px 30px ${hexToRgba(nameColor,0.28)}`,
                                            border: `4px solid ${hexToRgba(nameColor,0.12)}`
                                        }} />
                                    )}
                                    <div className="preview-username" style={{
                                            fontSize:28,
                                            fontWeight:700,
                                            color: nameColor || '#ffffff',
                                            textShadow: buildTextGlow(nameColor || '#ffffff')
                                    }}>
                                        {username || 'username'}
                                    </div>
                                    <div className="preview-description" style={{color: descColor || (hexLuminance(bgColor || '#050505') > 0.6 ? '#111' : '#fff')}}>{description}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Customize;