import React from 'react'
import './profileview.css'

function ResumePublicView({ profile }) {
  // Resume data
  const resumeData = {
    fullName: profile.fullName || profile.displayName || 'Your Name',
    title: profile.title || 'Professional Title',
    phone: profile.phone || '',
    email: profile.email || '',
    location: profile.location || '',
    linkedin: profile.linkedin || '',
    website: profile.website || '',
    profilePhoto: profile.profilePhoto || profile.avatar || '',
    summary: profile.summary || '',
    experiences: profile.experiences || [],
    education: profile.education || [],
    skills: profile.skills || [],
    projects: profile.projects || [],
    languages: profile.languages || [],
    interests: profile.interests || [],
    highlights: profile.highlights || [],
    headerBgColor: profile.headerBgColor || '#2c5f7c',
    titleColor: profile.titleColor || '#f9a825',
    template: profile.template || 'modern',
    fontFamily: profile.fontFamily || 'Inter',
    fontSize: profile.fontSize || 'medium',
    layout: profile.layout || 'single-column'
  }

  const fontSizeMap = {
    small: '0.9em',
    medium: '1em',
    large: '1.1em'
  }

  const actualFontSize = fontSizeMap[resumeData.fontSize] || '1em'

  // Render single column layout
  const renderSingleColumn = () => {
    return (
      <div style={{ fontFamily: resumeData.fontFamily, fontSize: actualFontSize }}>
        {/* Header */}
        <div style={{
          backgroundColor: resumeData.headerBgColor,
          color: 'white',
          padding: '40px',
          textAlign: 'center'
        }}>
          {resumeData.profilePhoto && (
            <img 
              src={resumeData.profilePhoto} 
              alt="Profile" 
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid rgba(255,255,255,0.3)',
                marginBottom: '20px'
              }}
            />
          )}
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            marginBottom: '8px',
            color: resumeData.titleColor
          }}>
            {resumeData.fullName}
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '16px' }}>
            {resumeData.title}
          </p>
          <div style={{ fontSize: '14px', opacity: 0.85 }}>
            {resumeData.phone && <span>{resumeData.phone} • </span>}
            {resumeData.email && <span>{resumeData.email} • </span>}
            {resumeData.location && <span>{resumeData.location}</span>}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          {/* Summary */}
          {resumeData.summary && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: resumeData.headerBgColor,
                borderBottom: `2px solid ${resumeData.headerBgColor}`,
                paddingBottom: '8px'
              }}>
                Professional Summary
              </h2>
              <p style={{ lineHeight: '1.6', color: '#444' }}>
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Highlights */}
          {resumeData.highlights && resumeData.highlights.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: resumeData.headerBgColor,
                borderBottom: `2px solid ${resumeData.headerBgColor}`,
                paddingBottom: '8px'
              }}>
                Highlights
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {resumeData.highlights.map((highlight, idx) => (
                  <div key={idx} style={{
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <div style={{ fontWeight: '600', color: resumeData.headerBgColor, marginBottom: '4px' }}>
                      {highlight.title}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {highlight.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {resumeData.experiences && resumeData.experiences.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: resumeData.headerBgColor,
                borderBottom: `2px solid ${resumeData.headerBgColor}`,
                paddingBottom: '8px'
              }}>
                Work Experience
              </h2>
              {resumeData.experiences.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>
                        {exp.position}
                      </div>
                      <div style={{ color: '#666', fontSize: '16px' }}>
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </div>
                    </div>
                    <div style={{ color: '#999', fontSize: '14px', textAlign: 'right' }}>
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '8px' }}>
                      {exp.description}
                    </p>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul style={{ marginLeft: '20px', color: '#555' }}>
                      {exp.bullets.map((bullet, bidx) => (
                        <li key={bidx} style={{ marginBottom: '4px' }}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: resumeData.headerBgColor,
                borderBottom: `2px solid ${resumeData.headerBgColor}`,
                paddingBottom: '8px'
              }}>
                Education
              </h2>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>
                        {edu.degree}
                      </div>
                      <div style={{ color: '#666', fontSize: '16px' }}>
                        {edu.school} {edu.location && `• ${edu.location}`}
                      </div>
                    </div>
                    <div style={{ color: '#999', fontSize: '14px', textAlign: 'right' }}>
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: resumeData.headerBgColor,
                borderBottom: `2px solid ${resumeData.headerBgColor}`,
                paddingBottom: '8px'
              }}>
                Skills
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {resumeData.skills.map((skill, idx) => (
                  <span key={idx} style={{
                    padding: '6px 16px',
                    backgroundColor: resumeData.headerBgColor,
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: resumeData.headerBgColor,
                borderBottom: `2px solid ${resumeData.headerBgColor}`,
                paddingBottom: '8px'
              }}>
                Projects
              </h2>
              {resumeData.projects.map((project, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '600', fontSize: '18px', color: '#333', marginBottom: '4px' }}>
                    {project.name}
                  </div>
                  {project.description && (
                    <p style={{ color: '#555', lineHeight: '1.6' }}>
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: resumeData.headerBgColor,
                borderBottom: `2px solid ${resumeData.headerBgColor}`,
                paddingBottom: '8px'
              }}>
                Languages
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {resumeData.languages.map((lang, idx) => (
                  <div key={idx}>
                    <span style={{ fontWeight: '600', color: '#333' }}>{lang.name}</span>
                    {lang.level && <span style={{ color: '#666' }}> - {lang.level}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        backgroundColor: 'white',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {renderSingleColumn()}
      </div>
    </div>
  )
}

export default ResumePublicView
