import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

const SectionManager = ({ sections = [], onChange }) => {
  const [editingSection, setEditingSection] = useState(null)

  // Section templates
  const sectionTemplates = {
    text: {
      type: 'text',
      title: 'Text Section',
      icon: 'bi-text-paragraph',
      content: ''
    },
    bullets: {
      type: 'bullets',
      title: 'Bullet Points',
      icon: 'bi-list-ul',
      items: []
    },
    contact: {
      type: 'contact',
      title: 'Contact Information',
      icon: 'bi-envelope',
      address: '',
      phone: '',
      email: '',
      website: ''
    },
    imageText: {
      type: 'imageText',
      title: 'Image + Text',
      icon: 'bi-card-image',
      image: null,
      content: ''
    }
  }

  const addSection = (templateType) => {
    const template = sectionTemplates[templateType]
    const newSection = {
      id: `section_${Date.now()}`,
      ...template,
      order: sections.length
    }
    onChange([...sections, newSection])
  }

  const removeSection = (sectionId) => {
    onChange(sections.filter(s => s.id !== sectionId))
  }

  const updateSection = (sectionId, updates) => {
    onChange(sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    ))
  }

  const moveSection = (sectionId, direction) => {
    const index = sections.findIndex(s => s.id === sectionId)
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sections.length - 1)
    ) {
      return
    }

    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    
    onChange(newSections.map((s, i) => ({ ...s, order: i })))
  }

  const renderSectionEditor = (section) => {
    switch (section.type) {
      case 'text':
        return (
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control mb-2"
              value={section.title}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              placeholder="Section Title"
            />
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              rows="4"
              value={section.content}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Write your content here..."
            />
          </div>
        )

      case 'bullets':
        return (
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control mb-2"
              value={section.title}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              placeholder="Section Title"
            />
            <label className="form-label">Bullet Points</label>
            {(section.items || []).map((item, idx) => (
              <div key={idx} className="d-flex gap-2 mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...section.items]
                    newItems[idx] = e.target.value
                    updateSection(section.id, { items: newItems })
                  }}
                  placeholder="Bullet point"
                />
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    const newItems = section.items.filter((_, i) => i !== idx)
                    updateSection(section.id, { items: newItems })
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                updateSection(section.id, { items: [...(section.items || []), ''] })
              }}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add Bullet Point
            </button>
          </div>
        )

      case 'contact':
        return (
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control mb-3"
              value={section.title}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              placeholder="Contact Us"
            />
            
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label small">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={section.address || ''}
                  onChange={(e) => updateSection(section.id, { address: e.target.value })}
                  placeholder="192 Road, City, State"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={section.phone || ''}
                  onChange={(e) => updateSection(section.id, { phone: e.target.value })}
                  placeholder="(555) 000-0000"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={section.email || ''}
                  onChange={(e) => updateSection(section.id, { email: e.target.value })}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small">Website</label>
                <input
                  type="text"
                  className="form-control"
                  value={section.website || ''}
                  onChange={(e) => updateSection(section.id, { website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        )

      case 'imageText':
        return (
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control mb-2"
              value={section.title}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              placeholder="Section Title"
            />
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control mb-2"
              value={section.image || ''}
              onChange={(e) => updateSection(section.id, { image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              rows="3"
              value={section.content || ''}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Write your content here..."
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="section-manager">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">
          <i className="bi bi-stack me-2"></i>
          Profile Sections
        </h6>
        <div className="dropdown">
          <button
            className="btn btn-sm btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-plus-circle me-1"></i>
            Add Section
          </button>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => addSection('text')}>
                <i className="bi bi-text-paragraph me-2"></i>
                Text Section
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => addSection('bullets')}>
                <i className="bi bi-list-ul me-2"></i>
                Bullet Points
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => addSection('contact')}>
                <i className="bi bi-envelope me-2"></i>
                Contact Info
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => addSection('imageText')}>
                <i className="bi bi-card-image me-2"></i>
                Image + Text
              </button>
            </li>
          </ul>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="text-center p-4 border rounded bg-light">
          <i className="bi bi-inbox" style={{ fontSize: '32px', color: '#ccc' }}></i>
          <p className="text-muted mt-2 mb-0">No sections yet. Click "Add Section" to start!</p>
        </div>
      ) : (
        <div className="sections-list">
          {sections.map((section, index) => (
            <div key={section.id} className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <i className={sectionTemplates[section.type]?.icon || 'bi-file-text'}></i>
                  <strong>{section.title || `Section ${index + 1}`}</strong>
                  <span className="badge bg-secondary small">{section.type}</span>
                </div>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={index === 0}
                  >
                    <i className="bi bi-arrow-up"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={index === sections.length - 1}
                  >
                    <i className="bi bi-arrow-down"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                  >
                    <i className={`bi bi-${editingSection === section.id ? 'chevron-up' : 'pencil'}`}></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeSection(section.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              
              {editingSection === section.id && (
                <div className="card-body">
                  {renderSectionEditor(section)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <small className="text-muted">
        <i className="bi bi-info-circle me-1"></i>
        Sections will appear on your profile in this order
      </small>
    </div>
  )
}

export default SectionManager
