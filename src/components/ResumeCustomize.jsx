import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { generateCvPdf } from '../utils/exportCv'

function ResumeCustomize({ profile, onUpdate }) {
  const navigate = useNavigate()
  const themeMeta = profile?.themeMeta
  const themeTokens = profile?.themeTokens || {}
  const themeSourceLabel = themeMeta
    ? (
        {
          builtin: 'Official Library',
          community: 'Community Gallery',
          saved: 'My Themes'
        }[themeMeta.source] || 'Custom Theme'
      )
    : ''
  const onUpdateRef = useRef(onUpdate)

  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  // AI Generator Modal State
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiPrompt, setAIPrompt] = useState('')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showFontModal, setShowFontModal] = useState(false)
  const [showQuickStylesModal, setShowQuickStylesModal] = useState(false)

  // Section Order State for Drag & Drop
  const [sectionOrder, setSectionOrder] = useState([
    'header',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'languages',
    'interests'
  ])

  // Resume Data State
  const [resumeData, setResumeData] = useState({
    // Header
    fullName: profile?.fullName || '',
    title: profile?.title || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    location: profile?.location || '',
    linkedin: profile?.linkedin || '',
    twitter: profile?.twitter || '',
    medium: profile?.medium || '',
    website: profile?.website || '',
    profilePhoto: profile?.profilePhoto || '',
    headerBgColor: profile?.headerBgColor || themeTokens.sectionBg || themeTokens.blockColor || '#2c5f7c',
    titleColor: profile?.titleColor || themeTokens.nameColor || themeTokens.headingColor || '#f9a825',
    
    // Summary
    summary: profile?.summary || '',
    
    // Experience
    experiences: profile?.experiences || [],
    
    // Education
    education: profile?.education || [],
    
    // Skills
    skills: profile?.skills || [],
    
    // Projects (NEW)
    projects: profile?.projects || [],
    
    // Languages (NEW)
    languages: profile?.languages || [],
    
    // Interests (NEW)
    interests: profile?.interests || [],
    
    // Template & Styling
    template: profile?.template || 'modern',
    colorScheme: profile?.colorScheme || 'brown-beige',
    layout: profile?.layout || 'single-column',
    fontSize: profile?.fontSize || 'medium',
    fontFamily: profile?.fontFamily || themeTokens.fontFamily || 'Inter',
    spacing: profile?.spacing || 'normal',
    
    // Advanced Styling
    leftColumnBg: profile?.leftColumnBg || themeTokens.blockColor || '#2c5f7c',
    rightColumnBg: profile?.rightColumnBg || themeTokens.bgColor || '#f5f5f5',
    accentColor: profile?.accentColor || themeTokens.headingColor || themeTokens.nameColor || '#f9a825',
    showSectionIcons: profile?.showSectionIcons !== undefined ? profile.showSectionIcons : true,
    sectionIconStyle: profile?.sectionIconStyle || 'filled'
  })

  useEffect(() => {
    if (!themeMeta?.id) return
    const hasTokens = Object.keys(themeTokens).length > 0
    if (!hasTokens) return
    setResumeData(prev => {
      const themedValues = {
        headerBgColor: themeTokens.sectionBg || themeTokens.blockColor || prev.headerBgColor,
        leftColumnBg: themeTokens.blockColor || themeTokens.bgColor || prev.leftColumnBg,
        rightColumnBg: themeTokens.bgColor || prev.rightColumnBg,
        accentColor: themeTokens.headingColor || themeTokens.nameColor || themeTokens.accentColor || prev.accentColor,
        titleColor: themeTokens.nameColor || themeTokens.headingColor || prev.titleColor,
        fontFamily: themeTokens.fontFamily || prev.fontFamily,
        colorScheme: 'custom-theme'
      }
      const nextState = { ...prev, ...themedValues }
      onUpdateRef.current?.(themedValues)
      return nextState
    })
  }, [themeMeta?.id, themeTokens])

  // Active Tab State
  const [activeTab, setActiveTab] = useState('ai-generator')

  const buildExportPayload = () => {
    const skills = (resumeData.skills || [])
      .map((skill) => (typeof skill === 'string' ? skill : skill.name))
      .filter(Boolean)
    const experience = (resumeData.experiences || []).map((exp) => {
      const [periodStart = '', periodEnd = ''] = (exp.period || '')
        .split('-')
        .map((part) => part.trim())
      return {
        position: exp.position || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startDate || periodStart,
        endDate: exp.current ? '' : (exp.endDate || periodEnd),
        description: exp.description || exp.summary || '',
        bullets: Array.isArray(exp.bulletPoints) ? exp.bulletPoints.filter(Boolean) : []
      }
    })
    const education = (resumeData.education || []).map((edu) => ({
      school: edu.school || '',
      degree: edu.degree || '',
      location: edu.location || '',
      startDate: edu.startDate || '',
      endDate: edu.graduationDate || edu.endDate || ''
    }))

    return {
      username: profile?.username || '',
      displayName: resumeData.fullName || profile?.fullName || profile?.displayName || 'Resume',
      jobTitle: resumeData.title || profile?.title || '',
      description: resumeData.summary || '',
      skills,
      experience,
      education,
      contact: {
        email: resumeData.email || profile?.email || '',
        phone: resumeData.phone || profile?.phone || '',
        address: resumeData.location || profile?.location || '',
        links: profile?.contact?.links || []
      }
    }
  }

  const handleDownloadResumePdf = async () => {
    try {
      const payload = buildExportPayload()
      const slug = (payload.displayName || payload.username || 'resume')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
      await generateCvPdf(payload, { filename: `${slug || 'resume'}-cv.pdf` })
    } catch (error) {
      console.error('Failed to export resume PDF', error)
      window.alert('ไม่สามารถดาวน์โหลด Resume ได้ โปรดลองอีกครั้ง')
    }
  }

  // Template options
  const templates = [
    { id: 'modern', name: 'Modern', icon: '📱', description: 'Clean and contemporary' },
    { id: 'classic', name: 'Classic', icon: '📋', description: 'Traditional and professional' },
    { id: 'creative', name: 'Creative', icon: '🎨', description: 'Bold and artistic' },
    { id: 'minimal', name: 'Minimal', icon: '⚪', description: 'Simple and elegant' }
  ]

  // Layout options
  const layouts = [
    { id: 'single-column', name: 'Single Column', icon: '📄', description: 'Traditional one column' },
    { id: 'two-column', name: 'Two Column', icon: '📋', description: 'Modern split layout' }
  ]

  // Color schemes
  const colorSchemes = [
    { id: 'brown-beige', name: 'Brown & Beige', primary: '#A67C52', secondary: '#F5E6D3' },
    { id: 'blue-white', name: 'Blue & White', primary: '#1E6FB8', secondary: '#FFFFFF' },
    { id: 'navy-gold', name: 'Navy & Gold', primary: '#1a237e', secondary: '#d4af37' },
    { id: 'purple-pink', name: 'Purple & Pink', primary: '#7b1fa2', secondary: '#f48fb1' },
    { id: 'green-white', name: 'Green & White', primary: '#2e7d32', secondary: '#FFFFFF' },
    { id: 'black-white', name: 'Black & White', primary: '#000000', secondary: '#FFFFFF' }
  ]

  // Font list for modal
  const fonts = {
    suggested: [
      'Inter', 'Poppins', 'Roboto', 'Montserrat',
      'Open Sans', 'Lato', 'Raleway', 'Nunito',
      'Work Sans', 'DM Sans', 'Plus Jakarta Sans', 'Outfit',
      'Urbanist', 'Manrope', 'IBM Plex Sans', 'Archivo'
    ],
    other: [
      'Playfair Display', 'Merriweather', 'Crimson Text', 'Cormorant',
      'Bebas Neue', 'Righteous', 'Russo One', 'Bungee',
      'Pacifico', 'Dancing Script', 'Permanent Marker', 'Caveat',
      'Albert Sans', 'Space Grotesk', 'Epilogue', 'Red Hat Display',
      'Rubik', 'Syne', 'Karla', 'Jost',
      'IBM Plex Serif', 'Lora', 'Noto Serif', 'PT Serif',
      'IBM Plex Mono', 'Space Mono', 'JetBrains Mono', 'Fira Code'
    ]
  }

  // Font size options
  const fontSizes = [
    { id: 'small', name: 'Small', size: '0.9em' },
    { id: 'medium', name: 'Medium', size: '1em' },
    { id: 'large', name: 'Large', size: '1.1em' }
  ]

  // Spacing options
  const spacingOptions = [
    { id: 'compact', name: 'Compact', value: '0.8' },
    { id: 'normal', name: 'Normal', value: '1' },
    { id: 'relaxed', name: 'Relaxed', value: '1.2' }
  ]

  // Quick Style Presets
  const stylePresets = [
    {
      id: 'professional-blue',
      name: 'Professional',
      emoji: '💼',
      colors: { left: '#1e3a5f', right: '#f8f9fa', accent: '#2563eb', title: '#fbbf24' }
    },
    {
      id: 'creative-purple',
      name: 'Creative',
      emoji: '🎨',
      colors: { left: '#7c3aed', right: '#faf5ff', accent: '#a855f7', title: '#ffffff' }
    },
    {
      id: 'minimal-black',
      name: 'Minimal',
      emoji: '⚫',
      colors: { left: '#1f2937', right: '#ffffff', accent: '#000000', title: '#ffffff' }
    },
    {
      id: 'warm-brown',
      name: 'Warm',
      emoji: '☕',
      colors: { left: '#8b6f47', right: '#f5e6d3', accent: '#8b6f47', title: '#ffffff' }
    }
  ]

  // Quick apply style preset
  const applyStylePreset = (preset) => {
    const newData = {
      ...resumeData,
      leftColumnBg: preset.colors.left,
      rightColumnBg: preset.colors.right,
      accentColor: preset.colors.accent,
      titleColor: preset.colors.title,
      headerBgColor: preset.colors.left
    }
    setResumeData(newData)
    onUpdate?.(newData)
    setShowQuickStylesModal(false)
  }

  // Tabs Configuration
  const tabs = [
    { id: 'ai-generator', label: '🤖 AI Generator', icon: 'bi-magic', category: 'ai' },
    { id: 'template', label: '📐 Template & Layout', icon: 'bi-layout-text-window', category: 'design' },
    { id: 'header', label: '👤 Header & Contact', icon: 'bi-person-badge', category: 'content' },
    { id: 'summary', label: '📝 Summary', icon: 'bi-card-text', category: 'content' },
    { id: 'experience', label: '💼 Work Experience', icon: 'bi-briefcase', category: 'content' },
    { id: 'education', label: '🎓 Education', icon: 'bi-mortarboard', category: 'content' },
    { id: 'skills', label: '⚡ Skills', icon: 'bi-lightning', category: 'content' },
    { id: 'projects', label: '🚀 Projects', icon: 'bi-folder', category: 'content' },
    { id: 'languages', label: '🌐 Languages', icon: 'bi-translate', category: 'content' },
    { id: 'interests', label: '💡 Interests', icon: 'bi-heart', category: 'content' },
    { id: 'styling', label: '🎨 Colors & Style', icon: 'bi-palette', category: 'design' }
  ]

  // AI Resume Generator
  const generateResumeFromAI = () => {
    if (!aiPrompt.trim()) {
      alert('กรุณาใส่คำอธิบายเกี่ยวกับตัวคุณก่อนครับ')
      return
    }

    // Simple AI simulation - will be replaced with actual AI
    const prompt = aiPrompt.toLowerCase()
    
    // Detect field of study/work
    let detectedField = 'general'
    if (prompt.includes('วิศวกร') || prompt.includes('engineer') || prompt.includes('คอมพิวเตอร์')) {
      detectedField = 'engineering'
    } else if (prompt.includes('ธุรกิจ') || prompt.includes('business') || prompt.includes('การตลาด')) {
      detectedField = 'business'
    } else if (prompt.includes('ออกแบบ') || prompt.includes('design') || prompt.includes('creative')) {
      detectedField = 'creative'
    }

    // Generate resume data based on prompt
    const generatedData = {
      fullName: 'Your Name',
      title: detectedField === 'engineering' ? 'Software Engineer' :
             detectedField === 'business' ? 'Business Analyst' :
             detectedField === 'creative' ? 'UX/UI Designer' : 'Professional',
      summary: `Motivated ${detectedField} professional with strong skills and dedication to excellence. ${aiPrompt.substring(0, 100)}...`,
      template: detectedField === 'creative' ? 'creative' : 'modern',
      colorScheme: detectedField === 'engineering' ? 'blue-white' :
                   detectedField === 'business' ? 'navy-gold' :
                   detectedField === 'creative' ? 'purple-pink' : 'brown-beige',
      skills: detectedField === 'engineering' ? 
        [
          { name: 'Python', level: 80 },
          { name: 'JavaScript', level: 75 },
          { name: 'Problem Solving', level: 85 },
          { name: 'Teamwork', level: 90 }
        ] :
        detectedField === 'business' ?
        [
          { name: 'Business Analysis', level: 85 },
          { name: 'Excel & Data', level: 80 },
          { name: 'Communication', level: 90 },
          { name: 'Project Management', level: 75 }
        ] :
        [
          { name: 'Communication', level: 85 },
          { name: 'Problem Solving', level: 80 },
          { name: 'Teamwork', level: 90 },
          { name: 'Time Management', level: 75 }
        ]
    }

    setResumeData(prev => ({ ...prev, ...generatedData }))
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 3000)
    
    console.log('AI Generated Resume:', generatedData)
  }

  // Update resume data
  const updateResumeData = (field, value) => {
    const newData = { ...resumeData, [field]: value }
    setResumeData(newData)
    onUpdate?.(newData)
  }

  // Handle drag end for reordering sections
  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(sectionOrder)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSectionOrder(items)
  }

  // Render section based on type
  const renderSection = (sectionId, isWhiteText = false) => {
    const sectionStyles = {
      cursor: 'grab',
      marginBottom: '1.5rem',
      position: 'relative',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'scale(1.01)'
      }
    }

    const dragHandleStyle = {
      position: 'absolute',
      top: '8px',
      right: '8px',
      fontSize: '18px',
      color: isWhiteText ? 'rgba(255,255,255,0.5)' : '#999',
      cursor: 'grab',
      userSelect: 'none',
      padding: '4px',
      lineHeight: '1'
    }

    switch (sectionId) {
      case 'header':
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <div className={`mb-4 pb-4 ${resumeData.template === 'modern' ? 'text-center' : resumeData.template === 'creative' ? 'text-start' : 'text-center'}`} 
                 style={{ 
                   borderBottom: resumeData.template === 'minimal' ? 'none' : `2px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333'}`,
                   background: resumeData.headerBgColor || (resumeData.template === 'creative' ? `linear-gradient(135deg, ${colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#7b1fa2'}, ${colorSchemes.find(c => c.id === resumeData.colorScheme)?.secondary || '#f48fb1'})` : 'transparent'),
                   color: resumeData.template === 'creative' ? 'white' : 'inherit',
                   padding: resumeData.template === 'creative' ? '30px' : '0',
                   borderRadius: resumeData.template === 'creative' ? '12px' : '0',
                   marginBottom: '2rem'
                 }}>
              {resumeData.profilePhoto && (
                <div className="text-center mb-3">
                  <img 
                    src={resumeData.profilePhoto} 
                    alt="Profile" 
                    style={{
                      width: resumeData.template === 'creative' ? '100px' : '120px',
                      height: resumeData.template === 'creative' ? '100px' : '120px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: resumeData.template === 'creative' ? '4px solid white' : `3px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333'}`,
                      marginBottom: '10px'
                    }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              )}
              <h1 className="fw-bold" style={{ 
                fontSize: resumeData.template === 'minimal' ? '32px' : '36px',
                marginBottom: '8px',
                color: resumeData.template === 'creative' ? 'white' : (resumeData.titleColor || resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333')
              }}>
                {resumeData.fullName || 'Your Professional Name'}
              </h1>
              <p className="text-muted" style={{ 
                fontSize: resumeData.template === 'classic' ? '18px' : '16px',
                marginBottom: resumeData.template === 'creative' ? '20px' : '15px',
                color: resumeData.template === 'creative' ? 'rgba(255,255,255,0.9)' : '#666'
              }}>
                {resumeData.title || 'Your Professional Title'}
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center" style={{ fontSize: '14px', color: resumeData.template === 'creative' ? 'rgba(255,255,255,0.95)' : '#666' }}>
                {resumeData.phone && (
                  <span><i className="bi bi-telephone me-1"></i>{resumeData.phone}</span>
                )}
                {resumeData.email && (
                  <span><i className="bi bi-envelope me-1"></i>{resumeData.email}</span>
                )}
                {resumeData.location && (
                  <span><i className="bi bi-geo-alt me-1"></i>{resumeData.location}</span>
                )}
                {resumeData.linkedin && (
                  <span><i className="bi bi-linkedin me-1"></i>{resumeData.linkedin}</span>
                )}
                {resumeData.twitter && (
                  <span><i className="bi bi-twitter me-1"></i>{resumeData.twitter}</span>
                )}
                {resumeData.medium && (
                  <span><i className="bi bi-medium me-1"></i>{resumeData.medium}</span>
                )}
                {resumeData.website && (
                  <span><i className="bi bi-globe me-1"></i>{resumeData.website}</span>
                )}
              </div>
            </div>
          </div>
        )

      case 'summary':
        if (!resumeData.summary) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-2" style={{ 
              borderBottom: resumeData.template === 'minimal' ? '1px solid #ddd' : `2px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333'}`, 
              paddingBottom: '8px',
              color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333',
              fontSize: resumeData.template === 'classic' ? '20px' : '18px'
            }}>
              {resumeData.showSectionIcons && '📝 '}Professional Summary
            </h5>
            <p className="text-muted" style={{ lineHeight: '1.6' }}>{resumeData.summary}</p>
          </div>
        )

      case 'experience':
        if (resumeData.experiences.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ 
              borderBottom: resumeData.template === 'minimal' ? '1px solid #ddd' : `2px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333'}`, 
              paddingBottom: '8px',
              color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333',
              fontSize: resumeData.template === 'classic' ? '20px' : '18px'
            }}>
              {resumeData.showSectionIcons && '💼 '}Work Experience
            </h5>
            {resumeData.experiences.map((exp, idx) => (
              <div key={idx} className="mb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="fw-semibold mb-0" style={{ color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333' }}>
                      {exp.position || 'Position Title'}
                    </h6>
                    <p className="text-muted mb-0">{exp.company || 'Company Name'}</p>
                  </div>
                </div>
                {idx < resumeData.experiences.length - 1 && <hr className="my-2" style={{ opacity: 0.3 }} />}
              </div>
            ))}
          </div>
        )

      case 'education':
        if (resumeData.education.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ 
              borderBottom: resumeData.template === 'minimal' ? '1px solid #ddd' : `2px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333'}`, 
              paddingBottom: '8px',
              color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333',
              fontSize: resumeData.template === 'classic' ? '20px' : '18px'
            }}>
              {resumeData.showSectionIcons && '🎓 '}Education
            </h5>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="mb-3">
                <h6 className="fw-semibold mb-0" style={{ color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333' }}>
                  {edu.degree || 'Degree'}
                </h6>
                <p className="text-muted mb-0">{edu.school || 'School Name'}</p>
                {idx < resumeData.education.length - 1 && <hr className="my-2" style={{ opacity: 0.3 }} />}
              </div>
            ))}
          </div>
        )

      case 'skills':
        if (resumeData.skills.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ 
              borderBottom: resumeData.template === 'minimal' ? '1px solid #ddd' : `2px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333'}`, 
              paddingBottom: '8px',
              color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333',
              fontSize: resumeData.template === 'classic' ? '20px' : '18px'
            }}>
              {resumeData.showSectionIcons && '⚡ '}Skills
            </h5>
            {resumeData.skills.map((skill, idx) => (
              <div key={idx} className="mb-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold">{skill.name}</span>
                  <span className="text-muted small">{skill.level}%</span>
                </div>
                <div className="progress" style={{ height: resumeData.template === 'classic' ? '8px' : '6px', borderRadius: resumeData.template === 'minimal' ? '0' : '4px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'projects':
        if (resumeData.projects.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ 
              borderBottom: resumeData.template === 'minimal' ? '1px solid #ddd' : `2px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333'}`, 
              paddingBottom: '8px',
              color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333',
              fontSize: resumeData.template === 'classic' ? '20px' : '18px'
            }}>
              {resumeData.showSectionIcons && '🚀 '}Projects
            </h5>
            {resumeData.projects.map((project, idx) => (
              <div key={idx} className="mb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <h6 className="fw-semibold mb-1" style={{ color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333' }}>
                    {project.name || 'Project Name'}
                  </h6>
                  {project.period && (
                    <span className="text-muted small" style={{ fontStyle: 'italic' }}>
                      {project.period}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                    {project.description}
                  </p>
                )}
                {idx < resumeData.projects.length - 1 && <hr className="my-2" style={{ opacity: 0.3 }} />}
              </div>
            ))}
          </div>
        )

      case 'languages':
        if (resumeData.languages.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ 
              borderBottom: resumeData.template === 'minimal' ? '1px solid #ddd' : `2px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333'}`, 
              paddingBottom: '8px',
              color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333',
              fontSize: resumeData.template === 'classic' ? '20px' : '18px'
            }}>
              {resumeData.showSectionIcons && '🌐 '}Languages
            </h5>
            <div className="row g-2">
              {resumeData.languages.map((lang, idx) => (
                <div key={idx} className="col-6">
                  <div className="fw-semibold">{lang.name}</div>
                  <div className="text-muted small" style={{ fontStyle: 'italic' }}>
                    {lang.proficiency === 'native' && 'Native'}
                    {lang.proficiency === 'proficient' && 'Proficient'}
                    {lang.proficiency === 'working' && 'Working'}
                    {lang.proficiency === 'limited' && 'Limited'}
                    {lang.proficiency === 'elementary' && 'Elementary'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'interests':
        if (resumeData.interests.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ 
              borderBottom: resumeData.template === 'minimal' ? '1px solid #ddd' : `2px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333'}`, 
              paddingBottom: '8px',
              color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333',
              fontSize: resumeData.template === 'classic' ? '20px' : '18px'
            }}>
              {resumeData.showSectionIcons && '💡 '}Interests
            </h5>
            <div className="d-flex flex-wrap gap-2">
              {resumeData.interests.map((interest, idx) => (
                <span 
                  key={idx}
                  className="badge"
                  style={{ 
                    backgroundColor: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#333',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 'normal',
                    padding: '6px 12px'
                  }}
                >
                  {interest.icon} {interest.name}
                </span>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Render section for two-column layout (left column - white text)
  const renderSectionTwoColumnLeft = (sectionId) => {
    const sectionStyles = {
      cursor: 'grab',
      marginBottom: '1.5rem',
      position: 'relative'
    }

    const dragHandleStyle = {
      position: 'absolute',
      top: '8px',
      right: '8px',
      fontSize: '16px',
      color: 'rgba(255,255,255,0.5)',
      cursor: 'grab',
      userSelect: 'none',
      padding: '4px',
      lineHeight: '1'
    }

    switch (sectionId) {
      case 'summary':
        if (!resumeData.summary) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-2" style={{ fontSize: '16px', color: 'white', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '8px' }}>
              {resumeData.showSectionIcons && '📝 '}Professional Summary
            </h5>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(255,255,255,0.95)' }}>
              {resumeData.summary}
            </p>
          </div>
        )

      case 'skills':
        if (resumeData.skills.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ fontSize: '16px', color: 'white', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '8px' }}>
              {resumeData.showSectionIcons && '⚡ '}Key Skills
            </h5>
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{skill.name}</span>
                </div>
                <div className="progress" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: 'rgba(255,255,255,0.9)'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'languages':
        if (resumeData.languages.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ fontSize: '16px', color: 'white', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '8px' }}>
              {resumeData.showSectionIcons && '🌐 '}Languages
            </h5>
            {resumeData.languages.map((lang, index) => (
              <div key={index} className="mb-2" style={{ fontSize: '13px' }}>
                <div className="fw-semibold">{lang.name}</div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'rgba(255,255,255,0.8)',
                  fontStyle: 'italic'
                }}>
                  {lang.proficiency === 'native' && 'Native or Bilingual'}
                  {lang.proficiency === 'proficient' && 'Full Professional'}
                  {lang.proficiency === 'working' && 'Professional Working'}
                  {lang.proficiency === 'limited' && 'Limited Working'}
                  {lang.proficiency === 'elementary' && 'Elementary'}
                </div>
              </div>
            ))}
          </div>
        )

      case 'interests':
        if (resumeData.interests.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ fontSize: '16px', color: 'white', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '8px' }}>
              {resumeData.showSectionIcons && '💡 '}Interests
            </h5>
            <div className="d-flex flex-wrap gap-2">
              {resumeData.interests.map((interest, index) => (
                <span 
                  key={index} 
                  style={{ 
                    fontSize: '12px',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  {interest.icon} {interest.name}
                </span>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Render section for two-column layout (right column - dark text)
  const renderSectionTwoColumnRight = (sectionId) => {
    const sectionStyles = {
      cursor: 'grab',
      marginBottom: '1.5rem',
      position: 'relative'
    }

    const dragHandleStyle = {
      position: 'absolute',
      top: '8px',
      right: '8px',
      fontSize: '16px',
      color: '#999',
      cursor: 'grab',
      userSelect: 'none',
      padding: '4px',
      lineHeight: '1'
    }

    switch (sectionId) {
      case 'experience':
        if (resumeData.experiences.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ 
              fontSize: '18px',
              color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52',
              borderBottom: `2px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52'}`,
              paddingBottom: '8px'
            }}>
              {resumeData.showSectionIcons && '💼 '}Professional Experience
            </h5>
            {resumeData.experiences.map((exp, index) => (
              <div key={index} className="mb-3">
                <h6 className="fw-semibold mb-0" style={{ 
                  fontSize: '15px',
                  color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52' 
                }}>
                  {exp.position || 'Position Title'}
                </h6>
                <p className="mb-2" style={{ fontSize: '13px', color: '#666' }}>
                  <em>{exp.company || 'Company Name'}</em>
                </p>
                {index < resumeData.experiences.length - 1 && <hr style={{ opacity: 0.3, margin: '15px 0' }} />}
              </div>
            ))}
          </div>
        )

      case 'education':
        if (resumeData.education.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ 
              fontSize: '18px',
              color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52',
              borderBottom: `2px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52'}`,
              paddingBottom: '8px'
            }}>
              {resumeData.showSectionIcons && '🎓 '}Education
            </h5>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <h6 className="fw-semibold mb-0" style={{ 
                  fontSize: '15px',
                  color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52' 
                }}>
                  {edu.degree || 'Degree'}
                </h6>
                <p className="mb-0" style={{ fontSize: '13px', color: '#666' }}>
                  {edu.school || 'School Name'}
                </p>
                {index < resumeData.education.length - 1 && <hr style={{ opacity: 0.3, margin: '15px 0' }} />}
              </div>
            ))}
          </div>
        )

      case 'projects':
        if (resumeData.projects.length === 0) return null
        return (
          <div style={sectionStyles}>
            <span style={dragHandleStyle}>⋮⋮</span>
            <h5 className="fw-bold mb-3" style={{ 
              fontSize: '18px',
              color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52',
              borderBottom: `2px solid ${resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52'}`,
              paddingBottom: '8px'
            }}>
              {resumeData.showSectionIcons && '🚀 '}Projects
            </h5>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <h6 className="fw-semibold mb-1" style={{ 
                    fontSize: '15px',
                    color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52' 
                  }}>
                    {project.name || 'Project Name'}
                  </h6>
                  {project.period && (
                    <span style={{ 
                      fontSize: '12px', 
                      color: resumeData.accentColor || colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52',
                      fontStyle: 'italic'
                    }}>
                      {project.period}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '0' }}>
                    {project.description}
                  </p>
                )}
                {index < resumeData.projects.length - 1 && <hr style={{ opacity: 0.3, margin: '15px 0' }} />}
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="resume-customize" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Font Modal */}
      {showFontModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 2100,
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
              <h5 className="mb-0">Select Font</h5>
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

            {/* Font List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {/* Suggested */}
              <h6 className="mb-3">Suggested</h6>
              <div className="row g-2 mb-4">
                {fonts.suggested.map(font => (
                  <div key={font} className="col-6">
                    <button
                      className={`btn w-100 ${resumeData.fontFamily === font ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => {
                        updateResumeData('fontFamily', font)
                        setShowFontModal(false)
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
                      className={`btn w-100 ${resumeData.fontFamily === font ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => {
                        updateResumeData('fontFamily', font)
                        setShowFontModal(false)
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

      {/* Quick Styles Modal */}
      {showQuickStylesModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowQuickStylesModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '500px',
              padding: '24px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-bold">🎨 Quick Styles</h5>
              <button
                onClick={() => setShowQuickStylesModal(false)}
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>
            <p className="text-muted small mb-4">
              เลือกชุดสีสำเร็จรูปเพื่อเปลี่ยนรูปลักษณ์ Resume ของคุณได้ทันที
            </p>
            <div className="row g-3">
              {stylePresets.map(preset => (
                <div key={preset.id} className="col-6">
                  <button
                    onClick={() => applyStylePreset(preset)}
                    className="btn w-100 p-3 text-start"
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      backgroundColor: 'white',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#000'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e9ecef'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div className="text-center mb-2" style={{ fontSize: '32px' }}>
                      {preset.emoji}
                    </div>
                    <div className="fw-bold mb-1" style={{ fontSize: '14px' }}>
                      {preset.name}
                    </div>
                    <div className="d-flex gap-1 mt-2">
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        backgroundColor: preset.colors.left
                      }}></div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        backgroundColor: preset.colors.right
                      }}></div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        backgroundColor: preset.colors.accent
                      }}></div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes spin {
              from { transform: translate(-50%, -50%) rotate(0deg); }
              to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
          `}</style>
          
          <div style={{
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.1)',
            textAlign: 'center',
            minWidth: '320px',
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
            animation: showSuccessNotification ? 'fadeIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s' : 'none'
          }}>
            {/* V Logo with spinning arc */}
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 20px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="120" height="120" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#888888', stopOpacity: 0.8 }} />
                  </linearGradient>
                </defs>
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#arcGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="140 180"
                  style={{
                    position: 'absolute',
                    animation: 'spin 2s linear infinite',
                    transformOrigin: 'center'
                  }}
                  filter="drop-shadow(0 0 8px rgba(255,255,255,0.8))"
                />
              </svg>
              
              <svg width="120" height="120" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="vGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#888888', stopOpacity: 0.8 }} />
                  </linearGradient>
                </defs>
                <text
                  x="60"
                  y="75"
                  fontSize="80"
                  fontWeight="bold"
                  fontFamily="Arial, sans-serif"
                  fill="url(#vGradient)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
                >
                  V
                </text>
              </svg>
            </div>

            <h4 style={{ color: 'white', marginBottom: '8px', fontWeight: '600' }}>
              สร้าง Resume สำเร็จ! 🎉
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '14px' }}>
              AI ได้สร้างโครงสร้าง Resume ให้คุณแล้ว
            </p>
          </div>
        </div>
      )}

      {/* AI Generator Modal */}
      {showAIModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '85vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
              padding: '24px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(255,255,255,0.1)'
            }}>
              {/* Shine effect */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                animation: 'shine 3s infinite',
                pointerEvents: 'none'
              }} />
              <style>{`
                @keyframes shine {
                  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                }
              `}</style>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1" style={{ fontWeight: '700' }}>🤖 AI Resume Generator</h4>
                  <p className="mb-0" style={{ opacity: 0.9, fontSize: '14px' }}>บอก AI เกี่ยวกับตัวคุณแล้วเราจะสร้าง Resume ให้</p>
                </div>
                <button 
                  onClick={() => setShowAIModal(false)}
                  style={{
                    border: 'none',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div className="mb-4">
                <label className="form-label fw-semibold mb-2">
                  อธิบายเกี่ยวกับตัวคุณ
                </label>
                <textarea
                  className="form-control"
                  rows="6"
                  placeholder="ตัวอย่าง: ผมเป็นนักศึกษาวิศวกรรมคอมพิวเตอร์ปี 4 มี GPA 3.5 เคยทำ project จบเกี่ยวกับ AI chatbot และเคยฝึกงานที่บริษัท ABC เป็นเวลา 3 เดือน มีทักษะด้าน Python, JavaScript และชอบทำงานเป็นทีม..."
                  value={aiPrompt}
                  onChange={(e) => setAIPrompt(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    padding: '12px',
                    fontSize: '14px'
                  }}
                />
                <small className="text-muted d-block mt-2">
                  💡 ยิ่งอธิบายละเอียด AI จะสร้าง Resume ได้ดีและเหมาะสมกับคุณมากขึ้น
                </small>
              </div>

              <button
                onClick={generateResumeFromAI}
                className="btn btn-dark w-100 py-3"
                style={{
                  background: 'linear-gradient(135deg, #000000 0%, #2a2a2a 50%, #000000 100%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                ✨ สร้าง Resume ด้วย AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="container-fluid" style={{ padding: '20px' }}>
        {/* Quick Actions Bar */}
        <div className="card shadow-sm mb-3" style={{ borderRadius: '16px', border: 'none' }}>
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={() => setShowAIModal(true)}
                  className="btn btn-dark btn-sm"
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-magic me-1"></i> AI Generate
                </button>
                <button
                  onClick={() => setShowQuickStylesModal(true)}
                  className="btn btn-outline-dark btn-sm"
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-palette me-1"></i> Quick Styles
                </button>
                <button
                  onClick={() => setShowFontModal(true)}
                  className="btn btn-outline-secondary btn-sm"
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-fonts me-1"></i> Fonts
                </button>
              </div>
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted">
                  <i className="bi bi-clock-history me-1"></i>
                  Auto-saved
                </small>
                <button
                  className="btn btn-outline-primary btn-sm"
                  style={{ borderRadius: '8px' }}
                  onClick={handleDownloadResumePdf}
                >
                  <i className="bi bi-download me-1"></i> Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          {/* Left Panel - Controls */}
          <div className="col-lg-5 col-xl-4">
            <div className="card shadow-sm" style={{ borderRadius: '16px', border: 'none' }}>
              {/* Header with AI Button */}
              <div className="card-header bg-white border-0 p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-bold">Resume Customize</h5>
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-sm btn-outline-secondary"
                    style={{ borderRadius: '8px' }}
                  >
                    <i className="bi bi-arrow-left me-1"></i> Back
                  </button>
                </div>
                
                {/* AI Generator Button */}
                <button
                  onClick={() => setShowAIModal(true)}
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '14px',
                    fontWeight: '700',
                    fontSize: '15px',
                    boxShadow: '0 0 30px rgba(255, 255, 255, 0.4)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Shine effect */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'aiButtonShine 3s infinite',
                    pointerEvents: 'none'
                  }} />
                  <style>{`
                    @keyframes aiButtonShine {
                      0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                      100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                    }
                  `}</style>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                  <span style={{ position: 'relative', zIndex: 1 }}>สร้าง Resume ด้วย AI</span>
                </button>
                {themeMeta && (
                  <div
                    className="mt-3"
                    style={{
                      borderRadius: '14px',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      color: '#f8fafc',
                      boxShadow: '0 10px 25px rgba(15,23,42,0.25)'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="text-uppercase small" style={{ letterSpacing: '0.08em', opacity: 0.65 }}>
                          Active Theme
                        </div>
                        <div className="fw-semibold" style={{ fontSize: '16px' }}>{themeMeta.name}</div>
                        <div className="small" style={{ opacity: 0.7 }}>{themeSourceLabel}</div>
                        <div className="d-flex gap-2 mt-2">
                          {[themeTokens.bgColor, themeTokens.blockColor, themeTokens.headingColor]
                            .filter(Boolean)
                            .map((color, idx) => (
                              <span
                                key={`${color}-${idx}`}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '6px',
                                  backgroundColor: color,
                                  border: '1px solid rgba(255,255,255,0.3)'
                                }}
                              ></span>
                            ))}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/themes')}
                        className="btn btn-sm btn-light"
                        style={{ borderRadius: '8px', fontWeight: 600 }}
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="card-body p-0">
                <div className="nav nav-pills flex-column" style={{ padding: '12px' }}>
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`nav-link text-start d-flex align-items-center gap-2 mb-1 ${
                        activeTab === tab.id ? 'active' : ''
                      }`}
                      style={{
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontWeight: activeTab === tab.id ? '600' : '500',
                        fontSize: '14px',
                        backgroundColor: activeTab === tab.id ? '#000' : 'transparent',
                        color: activeTab === tab.id ? '#fff' : '#666',
                        border: 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      <i className={`bi ${tab.icon}`}></i>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div style={{ padding: '20px', minHeight: '400px' }}>
                  {activeTab === 'ai-generator' && (
                    <div>
                      <h6 className="fw-bold mb-3">🤖 AI Tools</h6>
                      <div className="alert alert-info" style={{ borderRadius: '12px' }}>
                        <i className="bi bi-lightbulb me-2"></i>
                        คลิกปุ่ม "สร้าง Resume ด้วย AI" ด้านบนเพื่อให้ AI ช่วยสร้าง Resume ให้คุณอัตโนมัติ
                      </div>
                      <p className="text-muted small">
                        AI จะช่วยคุณ:
                      </p>
                      <ul className="small text-muted">
                        <li>เลือก Template ที่เหมาะสม</li>
                        <li>เขียน Professional Summary</li>
                        <li>แนะนำ Skills ที่ควรมี</li>
                        <li>จัดรูปแบบให้สวยงามทันที</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === 'template' && (
                    <div>
                      <h6 className="fw-bold mb-3">Template & Layout</h6>
                      <p className="text-muted small mb-3">เลือกรูปแบบ Resume ที่คุณชอบ</p>
                      
                      {/* Template Selection */}
                      <div className="mb-4">
                        <label className="form-label small fw-semibold mb-2">Resume Template</label>
                        <div className="row g-2">
                          {templates.map(template => (
                            <div key={template.id} className="col-6">
                              <button
                                onClick={() => updateResumeData('template', template.id)}
                                className="btn w-100 text-start p-3"
                                style={{
                                  borderRadius: '12px',
                                  border: resumeData.template === template.id ? '2px solid #000' : '2px solid #e9ecef',
                                  backgroundColor: resumeData.template === template.id ? '#f8f9fa' : 'white',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <span style={{ fontSize: '20px' }}>{template.icon}</span>
                                  <strong className="small">{template.name}</strong>
                                </div>
                                <small className="text-muted d-block">{template.description}</small>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Color Scheme Selection */}
                      <div className="mb-4">
                        <label className="form-label small fw-semibold mb-2">Color Scheme</label>
                        <div className="d-flex flex-wrap gap-2">
                          {colorSchemes.map(scheme => (
                            <button
                              key={scheme.id}
                              onClick={() => updateResumeData('colorScheme', scheme.id)}
                              className="btn btn-sm"
                              style={{
                                borderRadius: '8px',
                                border: resumeData.colorScheme === scheme.id ? '2px solid #000' : '2px solid #e9ecef',
                                backgroundColor: 'white',
                                padding: '8px 12px'
                              }}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <div style={{
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  backgroundColor: scheme.primary
                                }}></div>
                                <small className="fw-semibold">{scheme.name}</small>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Layout Selection */}
                      <div className="mb-3">
                        <label className="form-label small fw-semibold mb-2">Layout</label>
                        <div className="row g-2">
                          {layouts.map(layout => (
                            <div key={layout.id} className="col-6">
                              <button
                                onClick={() => updateResumeData('layout', layout.id)}
                                className="btn w-100 text-start p-3"
                                style={{
                                  borderRadius: '12px',
                                  border: resumeData.layout === layout.id ? '2px solid #000' : '2px solid #e9ecef',
                                  backgroundColor: resumeData.layout === layout.id ? '#f8f9fa' : 'white',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <span style={{ fontSize: '18px' }}>{layout.icon}</span>
                                  <strong className="small">{layout.name}</strong>
                                </div>
                                <small className="text-muted d-block">{layout.description}</small>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'header' && (
                    <div>
                      <h6 className="fw-bold mb-3">Header Information</h6>
                      
                      {/* Profile Photo */}
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Profile Photo URL</label>
                        <input
                          type="text"
                          className="form-control"
                          value={resumeData.profilePhoto}
                          onChange={(e) => updateResumeData('profilePhoto', e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          style={{ borderRadius: '8px', fontSize: '13px' }}
                        />
                        <small className="text-muted">Optional: Add a profile photo (recommended for 2-column layout)</small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Full Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={resumeData.fullName}
                          onChange={(e) => updateResumeData('fullName', e.target.value)}
                          placeholder="Your Full Name"
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Professional Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={resumeData.title}
                          onChange={(e) => updateResumeData('title', e.target.value)}
                          placeholder="e.g., Software Engineer"
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <label className="form-label small fw-semibold">Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={resumeData.phone}
                            onChange={(e) => updateResumeData('phone', e.target.value)}
                            placeholder="(555) 123-4567"
                            style={{ borderRadius: '8px' }}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-semibold">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={resumeData.email}
                            onChange={(e) => updateResumeData('email', e.target.value)}
                            placeholder="your@email.com"
                            style={{ borderRadius: '8px' }}
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          value={resumeData.location}
                          onChange={(e) => updateResumeData('location', e.target.value)}
                          placeholder="City, State"
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">LinkedIn URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={resumeData.linkedin}
                          onChange={(e) => updateResumeData('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/yourprofile"
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                      
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <label className="form-label small fw-semibold">Twitter</label>
                          <input
                            type="text"
                            className="form-control"
                            value={resumeData.twitter}
                            onChange={(e) => updateResumeData('twitter', e.target.value)}
                            placeholder="@username"
                            style={{ borderRadius: '8px' }}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-semibold">Medium</label>
                          <input
                            type="text"
                            className="form-control"
                            value={resumeData.medium}
                            onChange={(e) => updateResumeData('medium', e.target.value)}
                            placeholder="medium.com/@username"
                            style={{ borderRadius: '8px' }}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Website</label>
                        <input
                          type="url"
                          className="form-control"
                          value={resumeData.website}
                          onChange={(e) => updateResumeData('website', e.target.value)}
                          placeholder="yourwebsite.com"
                          style={{ borderRadius: '8px' }}
                        />
                      </div>

                      <hr className="my-4" />

                      <h6 className="fw-bold mb-3">Header Styling</h6>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label small fw-semibold">Background Color</label>
                          <input
                            type="color"
                            className="form-control form-control-color w-100"
                            value={resumeData.headerBgColor}
                            onChange={(e) => updateResumeData('headerBgColor', e.target.value)}
                            style={{ height: '45px', borderRadius: '8px' }}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-semibold">Title Color</label>
                          <input
                            type="color"
                            className="form-control form-control-color w-100"
                            value={resumeData.titleColor}
                            onChange={(e) => updateResumeData('titleColor', e.target.value)}
                            style={{ height: '45px', borderRadius: '8px' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'summary' && (
                    <div>
                      <h6 className="fw-bold mb-3">Professional Summary</h6>
                      <p className="text-muted small mb-2">
                        เขียนย่อหน้าสั้นๆ เกี่ยวกับตัวคุณ ความสามารถ และสิ่งที่ต้องการทำ
                      </p>
                      <textarea
                        className="form-control mb-2"
                        rows="6"
                        value={resumeData.summary}
                        onChange={(e) => updateResumeData('summary', e.target.value)}
                        placeholder="ตัวอย่าง: Experienced software engineer with 5+ years in web development. Skilled in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams..."
                        style={{ borderRadius: '8px', fontSize: '14px' }}
                      />
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {resumeData.summary.length} characters
                        </small>
                        <button 
                          className="btn btn-sm btn-outline-dark"
                          style={{ borderRadius: '6px' }}
                          onClick={() => {
                            // Placeholder for AI enhance
                            alert('AI Enhance feature coming soon!')
                          }}
                        >
                          <i className="bi bi-magic me-1"></i>
                          AI Enhance
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'experience' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">💼 Work Experience</h6>
                        <button
                          className="btn btn-sm btn-dark"
                          style={{ borderRadius: '8px' }}
                          onClick={() => {
                            const newExperience = {
                              id: Date.now(),
                              position: '',
                              company: '',
                              location: '',
                              startDate: '',
                              endDate: '',
                              current: false,
                              bulletPoints: ['']
                            }
                            setResumeData(prev => ({
                              ...prev,
                              experiences: [...prev.experiences, newExperience]
                            }))
                          }}
                        >
                          <i className="bi bi-plus-circle me-1"></i> Add Experience
                        </button>
                      </div>

                      {resumeData.experiences.length === 0 ? (
                        <div className="alert alert-secondary text-center" style={{ borderRadius: '12px' }}>
                          <i className="bi bi-briefcase me-2"></i>
                          No experience added yet
                        </div>
                      ) : (
                        resumeData.experiences.map((exp, index) => (
                          <div key={exp.id} className="card mb-3" style={{ borderRadius: '12px' }}>
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <strong className="small">Experience #{index + 1}</strong>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  style={{ borderRadius: '6px', padding: '2px 8px' }}
                                  onClick={() => {
                                    setResumeData(prev => ({
                                      ...prev,
                                      experiences: prev.experiences.filter(e => e.id !== exp.id)
                                    }))
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                              <div className="mb-2">
                                <input
                                  type="text"
                                  className="form-control form-control-sm mb-1"
                                  placeholder="Position Title"
                                  value={exp.position}
                                  onChange={(e) => {
                                    const newExps = [...resumeData.experiences]
                                    newExps[index].position = e.target.value
                                    setResumeData(prev => ({ ...prev, experiences: newExps }))
                                  }}
                                  style={{ borderRadius: '6px', fontSize: '13px' }}
                                />
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Company Name"
                                  value={exp.company}
                                  onChange={(e) => {
                                    const newExps = [...resumeData.experiences]
                                    newExps[index].company = e.target.value
                                    setResumeData(prev => ({ ...prev, experiences: newExps }))
                                  }}
                                  style={{ borderRadius: '6px', fontSize: '13px' }}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'education' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">🎓 Education</h6>
                        <button
                          className="btn btn-sm btn-dark"
                          style={{ borderRadius: '8px' }}
                          onClick={() => {
                            const newEducation = {
                              id: Date.now(),
                              degree: '',
                              school: '',
                              location: '',
                              graduationDate: '',
                              gpa: '',
                              coursework: []
                            }
                            setResumeData(prev => ({
                              ...prev,
                              education: [...prev.education, newEducation]
                            }))
                          }}
                        >
                          <i className="bi bi-plus-circle me-1"></i> Add Education
                        </button>
                      </div>

                      {resumeData.education.length === 0 ? (
                        <div className="alert alert-secondary text-center" style={{ borderRadius: '12px' }}>
                          <i className="bi bi-mortarboard me-2"></i>
                          No education added yet
                        </div>
                      ) : (
                        resumeData.education.map((edu, index) => (
                          <div key={edu.id} className="card mb-3" style={{ borderRadius: '12px' }}>
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <strong className="small">Education #{index + 1}</strong>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  style={{ borderRadius: '6px', padding: '2px 8px' }}
                                  onClick={() => {
                                    setResumeData(prev => ({
                                      ...prev,
                                      education: prev.education.filter(e => e.id !== edu.id)
                                    }))
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                              <div className="mb-2">
                                <input
                                  type="text"
                                  className="form-control form-control-sm mb-1"
                                  placeholder="Degree / Certificate"
                                  value={edu.degree}
                                  onChange={(e) => {
                                    const newEdu = [...resumeData.education]
                                    newEdu[index].degree = e.target.value
                                    setResumeData(prev => ({ ...prev, education: newEdu }))
                                  }}
                                  style={{ borderRadius: '6px', fontSize: '13px' }}
                                />
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="School Name"
                                  value={edu.school}
                                  onChange={(e) => {
                                    const newEdu = [...resumeData.education]
                                    newEdu[index].school = e.target.value
                                    setResumeData(prev => ({ ...prev, education: newEdu }))
                                  }}
                                  style={{ borderRadius: '6px', fontSize: '13px' }}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'skills' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">⚡ Skills</h6>
                        <button
                          className="btn btn-sm btn-dark"
                          style={{ borderRadius: '8px' }}
                          onClick={() => {
                            const newSkill = { name: '', level: 50 }
                            setResumeData(prev => ({
                              ...prev,
                              skills: [...prev.skills, newSkill]
                            }))
                          }}
                        >
                          <i className="bi bi-plus-circle me-1"></i> Add Skill
                        </button>
                      </div>

                      {resumeData.skills.length === 0 ? (
                        <div className="alert alert-secondary text-center" style={{ borderRadius: '12px' }}>
                          <i className="bi bi-lightning me-2"></i>
                          No skills added yet
                        </div>
                      ) : (
                        resumeData.skills.map((skill, index) => (
                          <div key={index} className="card mb-3 p-3" style={{ borderRadius: '12px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <input
                                type="text"
                                className="form-control form-control-sm me-2"
                                placeholder="Skill name"
                                value={skill.name}
                                onChange={(e) => {
                                  const newSkills = [...resumeData.skills]
                                  newSkills[index].name = e.target.value
                                  setResumeData(prev => ({ ...prev, skills: newSkills }))
                                }}
                                style={{ borderRadius: '6px', fontSize: '13px', flex: 1 }}
                              />
                              <button
                                className="btn btn-sm btn-outline-danger"
                                style={{ borderRadius: '6px', padding: '2px 8px' }}
                                onClick={() => {
                                  setResumeData(prev => ({
                                    ...prev,
                                    skills: prev.skills.filter((_, i) => i !== index)
                                  }))
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                            <div>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <small className="text-muted">Level</small>
                                <small className="fw-semibold">{skill.level}%</small>
                              </div>
                              <input
                                type="range"
                                className="form-range"
                                min="0"
                                max="100"
                                value={skill.level}
                                onChange={(e) => {
                                  const newSkills = [...resumeData.skills]
                                  newSkills[index].level = parseInt(e.target.value)
                                  setResumeData(prev => ({ ...prev, skills: newSkills }))
                                }}
                              />
                              <div className="progress mt-1" style={{ height: '6px', borderRadius: '3px' }}>
                                <div 
                                  className="progress-bar bg-dark" 
                                  style={{ width: `${skill.level}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'projects' && (
                    <div>
                      <h6 className="fw-bold mb-3">Personal Projects</h6>
                      <button
                        className="btn btn-sm btn-dark w-100 mb-3"
                        style={{ borderRadius: '8px' }}
                        onClick={() => {
                          const newProject = { 
                            id: Date.now(), 
                            name: '', 
                            period: '', 
                            description: '' 
                          }
                          setResumeData(prev => ({
                            ...prev,
                            projects: [...prev.projects, newProject]
                          }))
                        }}
                      >
                        <i className="bi bi-plus-circle me-1"></i> Add Project
                      </button>

                      {resumeData.projects.length === 0 ? (
                        <div className="alert alert-secondary text-center" style={{ borderRadius: '12px' }}>
                          <i className="bi bi-folder me-2"></i>
                          No projects added yet
                        </div>
                      ) : (
                        resumeData.projects.map((project, index) => (
                          <div key={project.id} className="card mb-3 p-3" style={{ borderRadius: '12px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <input
                                type="text"
                                className="form-control form-control-sm me-2"
                                placeholder="Project Name"
                                value={project.name}
                                onChange={(e) => {
                                  const newProjects = [...resumeData.projects]
                                  newProjects[index].name = e.target.value
                                  setResumeData(prev => ({ ...prev, projects: newProjects }))
                                }}
                                style={{ borderRadius: '6px', fontSize: '13px' }}
                              />
                              <button
                                className="btn btn-sm btn-outline-danger"
                                style={{ borderRadius: '6px', padding: '2px 8px' }}
                                onClick={() => {
                                  setResumeData(prev => ({
                                    ...prev,
                                    projects: prev.projects.filter((_, i) => i !== index)
                                  }))
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                            <input
                              type="text"
                              className="form-control form-control-sm mb-2"
                              placeholder="Period (e.g., 2017 - Present)"
                              value={project.period}
                              onChange={(e) => {
                                const newProjects = [...resumeData.projects]
                                newProjects[index].period = e.target.value
                                setResumeData(prev => ({ ...prev, projects: newProjects }))
                              }}
                              style={{ borderRadius: '6px', fontSize: '13px' }}
                            />
                            <textarea
                              className="form-control form-control-sm"
                              placeholder="Project description..."
                              rows="3"
                              value={project.description}
                              onChange={(e) => {
                                const newProjects = [...resumeData.projects]
                                newProjects[index].description = e.target.value
                                setResumeData(prev => ({ ...prev, projects: newProjects }))
                              }}
                              style={{ borderRadius: '6px', fontSize: '13px' }}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'languages' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">🌐 Languages</h6>
                        <button
                          className="btn btn-sm btn-dark"
                          style={{ borderRadius: '8px' }}
                          onClick={() => {
                            const newLanguage = { 
                              id: Date.now(), 
                              name: '', 
                              proficiency: 'proficient' 
                            }
                            setResumeData(prev => ({
                              ...prev,
                              languages: [...prev.languages, newLanguage]
                            }))
                          }}
                        >
                          <i className="bi bi-plus-circle me-1"></i> Add Language
                        </button>
                      </div>

                      {resumeData.languages.length === 0 ? (
                        <div className="alert alert-secondary text-center" style={{ borderRadius: '12px' }}>
                          <i className="bi bi-translate me-2"></i>
                          No languages added yet
                        </div>
                      ) : (
                        resumeData.languages.map((lang, index) => (
                          <div key={lang.id} className="card mb-3 p-3" style={{ borderRadius: '12px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <input
                                type="text"
                                className="form-control form-control-sm me-2"
                                placeholder="Language name"
                                value={lang.name}
                                onChange={(e) => {
                                  const newLanguages = [...resumeData.languages]
                                  newLanguages[index].name = e.target.value
                                  setResumeData(prev => ({ ...prev, languages: newLanguages }))
                                }}
                                style={{ borderRadius: '6px', fontSize: '13px', flex: 1 }}
                              />
                              <button
                                className="btn btn-sm btn-outline-danger"
                                style={{ borderRadius: '6px', padding: '2px 8px' }}
                                onClick={() => {
                                  setResumeData(prev => ({
                                    ...prev,
                                    languages: prev.languages.filter((_, i) => i !== index)
                                  }))
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                            <select
                              className="form-select form-select-sm"
                              value={lang.proficiency}
                              onChange={(e) => {
                                const newLanguages = [...resumeData.languages]
                                newLanguages[index].proficiency = e.target.value
                                setResumeData(prev => ({ ...prev, languages: newLanguages }))
                              }}
                              style={{ borderRadius: '6px', fontSize: '13px' }}
                            >
                              <option value="native">Native or Bilingual Proficiency</option>
                              <option value="proficient">Full Professional Proficiency</option>
                              <option value="working">Professional Working Proficiency</option>
                              <option value="limited">Limited Working Proficiency</option>
                              <option value="elementary">Elementary Proficiency</option>
                            </select>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'interests' && (
                    <div>
                      <h6 className="fw-bold mb-3">Interests & Hobbies</h6>
                      <button
                        className="btn btn-sm btn-dark w-100 mb-3"
                        style={{ borderRadius: '8px' }}
                        onClick={() => {
                          const newInterest = { 
                            id: Date.now(), 
                            name: '', 
                            icon: '🎯' 
                          }
                          setResumeData(prev => ({
                            ...prev,
                            interests: [...prev.interests, newInterest]
                          }))
                        }}
                      >
                        <i className="bi bi-plus-circle me-1"></i> Add Interest
                      </button>

                      {resumeData.interests.length === 0 ? (
                        <div className="alert alert-secondary text-center" style={{ borderRadius: '12px' }}>
                          <i className="bi bi-heart me-2"></i>
                          No interests added yet
                        </div>
                      ) : (
                        resumeData.interests.map((interest, index) => (
                          <div key={interest.id} className="card mb-3 p-3" style={{ borderRadius: '12px' }}>
                            <div className="d-flex justify-content-between align-items-center gap-2">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Interest name"
                                value={interest.name}
                                onChange={(e) => {
                                  const newInterests = [...resumeData.interests]
                                  newInterests[index].name = e.target.value
                                  setResumeData(prev => ({ ...prev, interests: newInterests }))
                                }}
                                style={{ borderRadius: '6px', fontSize: '13px', flex: 1 }}
                              />
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Icon"
                                value={interest.icon}
                                onChange={(e) => {
                                  const newInterests = [...resumeData.interests]
                                  newInterests[index].icon = e.target.value
                                  setResumeData(prev => ({ ...prev, interests: newInterests }))
                                }}
                                style={{ borderRadius: '6px', fontSize: '13px', width: '60px', textAlign: 'center' }}
                              />
                              <button
                                className="btn btn-sm btn-outline-danger"
                                style={{ borderRadius: '6px', padding: '2px 8px' }}
                                onClick={() => {
                                  setResumeData(prev => ({
                                    ...prev,
                                    interests: prev.interests.filter((_, i) => i !== index)
                                  }))
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                      <small className="text-muted">
                        💡 Tip: ใช้ emoji เป็นไอคอน เช่น ⚽ 🎨 📚 🎸 ✈️
                      </small>
                    </div>
                  )}

                  {activeTab === 'styling' && (
                    <div>
                      <h6 className="fw-bold mb-3">🎨 Colors & Styling</h6>
                      
                      {/* Column Colors (for 2-column layout) */}
                      <div className="mb-4">
                        <label className="form-label small fw-semibold mb-2">Column Colors</label>
                        <div className="row g-2">
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">Left Column</small>
                            <input
                              type="color"
                              className="form-control form-control-color w-100"
                              value={resumeData.leftColumnBg}
                              onChange={(e) => updateResumeData('leftColumnBg', e.target.value)}
                              style={{ height: '45px', borderRadius: '8px' }}
                            />
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">Right Column</small>
                            <input
                              type="color"
                              className="form-control form-control-color w-100"
                              value={resumeData.rightColumnBg}
                              onChange={(e) => updateResumeData('rightColumnBg', e.target.value)}
                              style={{ height: '45px', borderRadius: '8px' }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Accent Color */}
                      <div className="mb-4">
                        <label className="form-label small fw-semibold mb-2">Accent Color</label>
                        <p className="text-muted small mb-2">ใช้กับวันที่, bullet points, highlights</p>
                        <input
                          type="color"
                          className="form-control form-control-color w-100"
                          value={resumeData.accentColor}
                          onChange={(e) => updateResumeData('accentColor', e.target.value)}
                          style={{ height: '45px', borderRadius: '8px' }}
                        />
                      </div>

                      <hr className="my-4" />

                      {/* Section Icons Toggle */}
                      <div className="mb-4">
                        <label className="form-label small fw-semibold mb-2">Section Icons</label>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="sectionIconsToggle"
                            checked={resumeData.showSectionIcons}
                            onChange={(e) => updateResumeData('showSectionIcons', e.target.checked)}
                            style={{ cursor: 'pointer' }}
                          />
                          <label className="form-check-label text-muted small" htmlFor="sectionIconsToggle" style={{ cursor: 'pointer' }}>
                            แสดง emoji ที่หัวข้อแต่ละ section (📝 💼 🎓 ⚡ 🚀 🌐 💡)
                          </label>
                        </div>
                      </div>

                      <hr className="my-4" />

                      {/* Font Family */}
                      <div className="mb-4">
                        <label className="form-label small fw-semibold mb-2">Font Family</label>
                        <button
                          onClick={() => setShowFontModal(true)}
                          className="btn btn-outline-dark w-100 text-start d-flex justify-content-between align-items-center"
                          style={{ borderRadius: '12px', padding: '12px 16px' }}
                        >
                          <span style={{ fontFamily: resumeData.fontFamily }}>{resumeData.fontFamily}</span>
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </div>

                      {/* Font Size */}
                      <div className="mb-4">
                        <label className="form-label small fw-semibold mb-2">Font Size</label>
                        <div className="btn-group w-100" role="group">
                          {fontSizes.map(size => (
                            <button
                              key={size.id}
                              onClick={() => updateResumeData('fontSize', size.id)}
                              className={`btn ${resumeData.fontSize === size.id ? 'btn-dark' : 'btn-outline-secondary'}`}
                              style={{ borderRadius: '8px' }}
                            >
                              {size.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Spacing */}
                      <div className="mb-4">
                        <label className="form-label small fw-semibold mb-2">Line Spacing</label>
                        <div className="btn-group w-100" role="group">
                          {spacingOptions.map(spacing => (
                            <button
                              key={spacing.id}
                              onClick={() => updateResumeData('spacing', spacing.id)}
                              className={`btn ${resumeData.spacing === spacing.id ? 'btn-dark' : 'btn-outline-secondary'}`}
                              style={{ borderRadius: '8px' }}
                            >
                              {spacing.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="alert alert-light" style={{ borderRadius: '12px', fontSize: '13px' }}>
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Tip:</strong> ดูผลลัพธ์ได้ที่ Preview panel ทางขวา
                      </div>
                    </div>
                  )}

                  {/* Other tabs content */}
                  {!['ai-generator', 'template', 'header', 'summary', 'experience', 'education', 'skills', 'projects', 'languages', 'interests', 'styling'].includes(activeTab) && (
                    <div className="alert alert-secondary" style={{ borderRadius: '12px' }}>
                      Content for {activeTab} coming soon...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="col-lg-7 col-xl-8">
            <div className="card shadow-sm" style={{ borderRadius: '16px', border: 'none', minHeight: '800px' }}>
              <div className="card-header bg-white border-0 p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Preview</h5>
                  <button
                    className="btn btn-outline-dark btn-sm"
                    style={{ borderRadius: '8px' }}
                    onClick={handleDownloadResumePdf}
                  >
                    <i className="bi bi-download me-1"></i> Export PDF
                  </button>
                </div>
              </div>
              <div className="card-body" style={{ backgroundColor: '#f8f9fa', padding: '40px' }}>
                {/* Resume Preview */}
                <div style={{
                  backgroundColor: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: resumeData.template === 'minimal' ? '0px' : resumeData.template === 'creative' ? '20px' : '8px',
                  maxWidth: '800px',
                  margin: '0 auto',
                  minHeight: '1000px',
                  fontFamily: resumeData.fontFamily || 'Inter',
                  fontSize: fontSizes.find(s => s.id === resumeData.fontSize)?.size || '1em',
                  lineHeight: spacingOptions.find(s => s.id === resumeData.spacing)?.value || '1',
                  overflow: 'hidden'
                }}>
                  {resumeData.layout === 'two-column' ? (
                    <div className="row g-0">
                      {/* Left Column - Header & Summary */}
                      <div className="col-5" style={{
                        background: resumeData.leftColumnBg || `linear-gradient(180deg, ${colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52'}, ${colorSchemes.find(c => c.id === resumeData.colorScheme)?.primary || '#A67C52'})`,
                        color: 'white',
                        padding: `${60 * parseFloat(spacingOptions.find(s => s.id === resumeData.spacing)?.value || '1')}px 40px`
                      }}>
                        {/* Profile Photo */}
                        {resumeData.profilePhoto && (
                          <div className="text-center mb-4">
                            <img 
                              src={resumeData.profilePhoto} 
                              alt="Profile" 
                              style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '5px solid rgba(255,255,255,0.3)',
                                marginBottom: '20px'
                              }}
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          </div>
                        )}

                        {/* Name & Title */}
                        <div className="text-center mb-4">
                          <h2 className="fw-bold mb-2" style={{ fontSize: '28px', color: resumeData.titleColor || 'white' }}>
                            {resumeData.fullName || 'Your Name'}
                          </h2>
                          <p className="mb-3" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                            {resumeData.title || 'Your Professional Title'}
                          </p>
                        </div>

                        {/* Contact Info */}
                        <div className="mb-4" style={{ fontSize: '13px' }}>
                          {resumeData.location && (
                            <div className="mb-2"><i className="bi bi-geo-alt me-2"></i>{resumeData.location}</div>
                          )}
                          {resumeData.phone && (
                            <div className="mb-2"><i className="bi bi-telephone me-2"></i>{resumeData.phone}</div>
                          )}
                          {resumeData.email && (
                            <div className="mb-2"><i className="bi bi-envelope me-2"></i>{resumeData.email}</div>
                          )}
                          {resumeData.linkedin && (
                            <div className="mb-2"><i className="bi bi-linkedin me-2"></i>{resumeData.linkedin}</div>
                          )}
                          {resumeData.twitter && (
                            <div className="mb-2"><i className="bi bi-twitter me-2"></i>{resumeData.twitter}</div>
                          )}
                          {resumeData.medium && (
                            <div className="mb-2"><i className="bi bi-medium me-2"></i>{resumeData.medium}</div>
                          )}
                          {resumeData.website && (
                            <div className="mb-2"><i className="bi bi-globe me-2"></i>{resumeData.website}</div>
                          )}
                        </div>

                        {/* Draggable Left Column Sections */}
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="left-column-sections">
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.droppableProps}>
                                {['summary', 'skills', 'languages', 'interests'].map((sectionId, index) => {
                                  const sectionContent = renderSectionTwoColumnLeft(sectionId)
                                  if (!sectionContent) return null
                                  
                                  return (
                                    <Draggable key={sectionId} draggableId={`left-${sectionId}`} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging ? 0.8 : 1,
                                            backgroundColor: snapshot.isDragging ? 'rgba(255,255,255,0.1)' : 'transparent',
                                            borderRadius: snapshot.isDragging ? '8px' : '0',
                                            padding: snapshot.isDragging ? '10px' : '0',
                                            border: snapshot.isDragging ? '2px dashed rgba(255,255,255,0.5)' : 'none'
                                          }}
                                        >
                                          {sectionContent}
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                                })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>

                      {/* Right Column - Experience & Education */}
                      <div className="col-7" style={{
                        backgroundColor: resumeData.rightColumnBg || colorSchemes.find(c => c.id === resumeData.colorScheme)?.secondary || '#F5E6D3',
                        padding: `${60 * parseFloat(spacingOptions.find(s => s.id === resumeData.spacing)?.value || '1')}px 40px`
                      }}>
                        {/* Draggable Right Column Sections */}
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="right-column-sections">
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.droppableProps}>
                                {['experience', 'education', 'projects'].map((sectionId, index) => {
                                  const sectionContent = renderSectionTwoColumnRight(sectionId)
                                  if (!sectionContent) return null
                                  
                                  return (
                                    <Draggable key={sectionId} draggableId={`right-${sectionId}`} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging ? 0.8 : 1,
                                            backgroundColor: snapshot.isDragging ? '#f8f9fa' : 'transparent',
                                            borderRadius: snapshot.isDragging ? '8px' : '0',
                                            padding: snapshot.isDragging ? '10px' : '0',
                                            border: snapshot.isDragging ? '2px dashed #333' : 'none'
                                          }}
                                        >
                                          {sectionContent}
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                                })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      padding: `${60 * parseFloat(spacingOptions.find(s => s.id === resumeData.spacing)?.value || '1')}px`
                    }}>
                      {/* Draggable Sections */}
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="resume-sections">
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                              {sectionOrder.map((sectionId, index) => {
                                const sectionContent = renderSection(sectionId)
                                if (!sectionContent) return null
                                
                                return (
                                  <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          ...provided.draggableProps.style,
                                          opacity: snapshot.isDragging ? 0.8 : 1,
                                          backgroundColor: snapshot.isDragging ? '#f8f9fa' : 'transparent',
                                          borderRadius: snapshot.isDragging ? '8px' : '0',
                                          padding: snapshot.isDragging ? '10px' : '0',
                                          border: snapshot.isDragging ? '2px dashed #333' : 'none'
                                        }}
                                      >
                                        {sectionContent}
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeCustomize
