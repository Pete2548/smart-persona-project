import React from 'react'

/**
 * SectionRenderer: Renders profile sections in ProfileView
 * Supports: text, bullets, contact, imageText
 */
export default function SectionRenderer({ sections = [], theme = {} }) {
    if (!sections || sections.length === 0) {
        return null
    }

    const {
        nameColor = '#1E6FB8',
        descColor = '#ffffff',
        blockColor = '#ffffff'
    } = theme

    // Sort sections by order
    const sortedSections = [...sections].sort((a, b) => a.order - b.order)

    const renderSection = (section) => {
        switch (section.type) {
            case 'text':
                return (
                    <div key={section.id} className="section-text mb-4">
                        {section.title && (
                            <h3 style={{ color: nameColor, marginBottom: '16px', fontSize: '1.5rem' }}>
                                {section.title}
                            </h3>
                        )}
                        {section.content && (
                            <p style={{ color: descColor, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                {section.content}
                            </p>
                        )}
                    </div>
                )

            case 'bullets':
                return (
                    <div key={section.id} className="section-bullets mb-4">
                        {section.title && (
                            <h3 style={{ color: nameColor, marginBottom: '16px', fontSize: '1.5rem' }}>
                                {section.title}
                            </h3>
                        )}
                        {section.items && section.items.length > 0 && (
                            <ul style={{ color: descColor, paddingLeft: '24px', lineHeight: '1.8' }}>
                                {section.items.filter(item => item.trim()).map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: '8px' }}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )

            case 'contact':
                return (
                    <div key={section.id} className="section-contact mb-4">
                        {section.title && (
                            <h3 style={{ color: nameColor, marginBottom: '16px', fontSize: '1.5rem' }}>
                                {section.title}
                            </h3>
                        )}
                        <div className="contact-info" style={{ color: descColor }}>
                            {section.address && (
                                <div className="contact-item mb-3 d-flex align-items-start">
                                    <i className="bi bi-geo-alt-fill me-2" style={{ color: nameColor, fontSize: '1.2rem', marginTop: '2px' }}></i>
                                    <span style={{ lineHeight: '1.6' }}>{section.address}</span>
                                </div>
                            )}
                            {section.phone && (
                                <div className="contact-item mb-3 d-flex align-items-center">
                                    <i className="bi bi-telephone-fill me-2" style={{ color: nameColor, fontSize: '1.2rem' }}></i>
                                    <a href={`tel:${section.phone}`} style={{ color: descColor, textDecoration: 'none' }}>
                                        {section.phone}
                                    </a>
                                </div>
                            )}
                            {section.email && (
                                <div className="contact-item mb-3 d-flex align-items-center">
                                    <i className="bi bi-envelope-fill me-2" style={{ color: nameColor, fontSize: '1.2rem' }}></i>
                                    <a href={`mailto:${section.email}`} style={{ color: descColor, textDecoration: 'none' }}>
                                        {section.email}
                                    </a>
                                </div>
                            )}
                            {section.website && (
                                <div className="contact-item mb-3 d-flex align-items-center">
                                    <i className="bi bi-globe me-2" style={{ color: nameColor, fontSize: '1.2rem' }}></i>
                                    <a href={section.website} target="_blank" rel="noopener noreferrer" style={{ color: descColor, textDecoration: 'none' }}>
                                        {section.website}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )

            case 'imageText':
                return (
                    <div key={section.id} className="section-image-text mb-4">
                        {section.title && (
                            <h3 style={{ color: nameColor, marginBottom: '16px', fontSize: '1.5rem' }}>
                                {section.title}
                            </h3>
                        )}
                        <div className="row align-items-center">
                            {section.imageUrl && (
                                <div className="col-md-5 mb-3 mb-md-0">
                                    <img 
                                        src={section.imageUrl} 
                                        alt={section.title || 'Section image'} 
                                        style={{ 
                                            width: '100%', 
                                            borderRadius: '8px',
                                            border: `2px solid ${blockColor}20`
                                        }} 
                                    />
                                </div>
                            )}
                            {section.content && (
                                <div className={section.imageUrl ? 'col-md-7' : 'col-12'}>
                                    <p style={{ color: descColor, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                        {section.content}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="profile-sections" style={{ marginTop: '24px' }}>
            {sortedSections.map(section => renderSection(section))}
        </div>
    )
}
