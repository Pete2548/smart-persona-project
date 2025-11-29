import React from 'react'
import './profileview.css'

function VtreePublicView({ profile }) {
  // Profile settings
  const profileImage = profile.profileImage || ''
  const profileImageLayout = profile.profileImageLayout || 'classic'
  // const titleStyle = profile.titleStyle || 'text' // unused
  const titleText = profile.displayName || profile.username || '@username'
  const titleFont = profile.titleFont || 'DM Sans'
  const titleColor = profile.nameColor || '#ffffff'
  const titleSize = profile.titleSize || 'small'
  
  const wallpaperStyle = profile.wallpaperStyle || 'fill'
  const wallpaperColor = profile.bgColor || '#808080'
  const wallpaperImage = profile.wallpaperImage || ''
  const overlayOpacity = profile.overlayOpacity || 0
  
  const pageFont = profile.pageFont || 'DM Sans'
  const pageTextColor = profile.pageTextColor || '#ffffff'
  const buttonTextColor = profile.buttonTextColor || '#000000'
  
  const buttonStyle = profile.buttonStyle || 'solid'
  const buttonCorners = profile.buttonCorners || 'round'
  const buttonShadow = profile.buttonShadow || 'none'
  const buttonColor = profile.buttonColor || '#ffffff'
  
  const socialLinks = profile.socialLinks || {}

  // Get background style
  const getBackgroundStyle = () => {
    const baseStyle = {
      minHeight: '100vh',
      fontFamily: pageFont,
      position: 'relative',
      overflow: 'hidden'
    }

    if (wallpaperImage && wallpaperStyle === 'fill') {
      return {
        ...baseStyle,
        backgroundImage: `url(${wallpaperImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    } else if (wallpaperImage && wallpaperStyle === 'tile') {
      return {
        ...baseStyle,
        backgroundImage: `url(${wallpaperImage})`,
        backgroundSize: 'auto',
        backgroundPosition: 'top left',
        backgroundRepeat: 'repeat'
      }
    } else {
      return {
        ...baseStyle,
        backgroundColor: wallpaperColor
      }
    }
  }

  // Get button style
  const getButtonStyle = (isLink = false) => {
    const baseStyle = {
      display: 'block',
      width: '100%',
      padding: '16px 24px',
      marginBottom: '12px',
      textAlign: 'center',
      textDecoration: 'none',
      fontFamily: pageFont,
      fontSize: '16px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: isLink ? buttonTextColor : pageTextColor
    }

    // Border radius
    if (buttonCorners === 'sharp') {
      baseStyle.borderRadius = '0px'
    } else if (buttonCorners === 'round') {
      baseStyle.borderRadius = '8px'
    } else if (buttonCorners === 'pill') {
      baseStyle.borderRadius = '50px'
    }

    // Shadow
    if (buttonShadow === 'soft') {
      baseStyle.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
    } else if (buttonShadow === 'hard') {
      baseStyle.boxShadow = '4px 4px 0 rgba(0,0,0,0.2)'
    }

    // Button style
    if (isLink) {
      if (buttonStyle === 'solid') {
        baseStyle.backgroundColor = buttonColor
        baseStyle.border = 'none'
      } else if (buttonStyle === 'outline') {
        baseStyle.backgroundColor = 'transparent'
        baseStyle.border = `2px solid ${buttonColor}`
        baseStyle.color = buttonColor
      } else if (buttonStyle === 'shadow') {
        baseStyle.backgroundColor = buttonColor
        baseStyle.border = 'none'
        baseStyle.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
      }
    }

    return baseStyle
  }

  // Get title size
  const getTitleFontSize = () => {
    if (titleSize === 'small') return '24px'
    if (titleSize === 'medium') return '32px'
    if (titleSize === 'large') return '40px'
    return '32px'
  }

  // Get active social links
  const activeSocialLinks = Object.entries(socialLinks).filter(([, url]) => url && url.trim() !== '')

  return (
    <div style={getBackgroundStyle()}>
      {/* Overlay */}
      {wallpaperImage && overlayOpacity > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'black',
          opacity: overlayOpacity / 100,
          zIndex: 1
        }} />
      )}

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '600px',
        margin: '0 auto',
        padding: '60px 20px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Profile Image */}
        {profileImage && (
          <div style={{ marginBottom: '24px' }}>
            {profileImageLayout === 'classic' && (
              <img 
                src={profileImage} 
                alt="Profile" 
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid rgba(255,255,255,0.3)'
                }}
              />
            )}
            {profileImageLayout === 'rounded' && (
              <img 
                src={profileImage} 
                alt="Profile" 
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  border: '4px solid rgba(255,255,255,0.3)'
                }}
              />
            )}
          </div>
        )}

        {/* Title */}
        <h1 style={{
          fontFamily: titleFont,
          fontSize: getTitleFontSize(),
          fontWeight: '700',
          color: titleColor,
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          {titleText}
        </h1>

        {/* Bio/Description */}
        {profile.description && (
          <p style={{
            color: pageTextColor,
            fontSize: '16px',
            lineHeight: '1.6',
            textAlign: 'center',
            marginBottom: '32px',
            maxWidth: '500px'
          }}>
            {profile.description}
          </p>
        )}

        {/* Links */}
        <div style={{ width: '100%', maxWidth: '500px' }}>
          {profile.sections && profile.sections.map((section, idx) => {
            if (section.type === 'link' && section.url) {
              return (
                <a
                  key={idx}
                  href={section.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={getButtonStyle(true)}
                >
                  {section.title || 'Link'}
                </a>
              )
            }
            return null
          })}
        </div>

        {/* Social Links */}
        {activeSocialLinks.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '32px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {activeSocialLinks.map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: pageTextColor,
                  fontSize: '24px',
                  opacity: 0.8,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.8'}
              >
                <i className={`bi bi-${key === 'ig' ? 'instagram' : key === 'x' ? 'twitter-x' : key}`}></i>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VtreePublicView
