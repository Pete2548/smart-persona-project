import React, { useState, useRef, useEffect } from 'react'
import './VisualEditor.css'

const VisualEditor = ({ profile, onSave }) => {
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const vereRef = useRef(null)

  // Sync elements with profile changes
  useEffect(() => {
    if (!profile) return
    
    // If vere elements exist, use them
    if (profile.vereElements && profile.vereElements.length > 0) {
      setElements(profile.vereElements)
    } else {
      // Create default elements from current profile data
      const defaultElements = []
      
      // Add avatar if exists
      if (profile.avatar) {
        defaultElements.push({
          id: `element_${Date.now()}_1`,
          type: 'image',
          content: profile.avatar,
          x: 50,
          y: 50,
          width: 120,
          height: 120,
          style: {
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #fff'
          }
        })
      }
      
      // Add name
      if (profile.displayName || profile.username) {
        defaultElements.push({
          id: `element_${Date.now()}_2`,
          type: 'text',
          content: profile.displayName || profile.username,
          x: 50,
          y: 200,
          width: 300,
          height: 50,
          style: {
            fontSize: '32px',
            fontWeight: 'bold',
            color: profile.nameColor || '#fff',
            textAlign: 'left'
          }
        })
      }
      
      // Add description
      if (profile.description) {
        defaultElements.push({
          id: `element_${Date.now()}_3`,
          type: 'text',
          content: profile.description,
          x: 50,
          y: 270,
          width: 400,
          height: 80,
          style: {
            fontSize: '16px',
            color: profile.descColor || '#ccc',
            textAlign: 'left',
            lineHeight: '1.5'
          }
        })
      }
      
      setElements(defaultElements)
    }
  }, [profile])

  // Add new element
  const addElement = (type) => {
    const newElement = {
      id: `element_${Date.now()}`,
      type,
      content: type === 'text' ? 'Double click to edit' : type === 'image' ? null : '',
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 40 : 100,
      style: {
        ...(type === 'text' && {
          fontSize: '16px',
          color: '#fff',
          textAlign: 'left'
        }),
        ...(type === 'shape' && {
          backgroundColor: '#6c5ce7',
          borderRadius: '8px'
        })
      }
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  // Handle mouse down on element
  const handleMouseDown = (e, elementId) => {
    e.stopPropagation()
    setSelectedElement(elementId)
    setIsDragging(true)
    
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  // Handle mouse move
  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElement) return
    
    const vereRect = vereRef.current.getBoundingClientRect()
    const newX = e.clientX - vereRect.left - dragOffset.x
    const newY = e.clientY - vereRect.top - dragOffset.y
    
    setElements(elements.map(el => 
      el.id === selectedElement 
        ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
        : el
    ))
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Delete selected element
  const deleteElement = () => {
    if (selectedElement) {
      setElements(elements.filter(el => el.id !== selectedElement))
      setSelectedElement(null)
    }
  }

  // Update element content
  const updateElementContent = (elementId, newContent) => {
    setElements(elements.map(el =>
      el.id === elementId ? { ...el, content: newContent } : el
    ))
  }

  // Update element style
  const updateElementStyle = (elementId, styleKey, value) => {
    setElements(elements.map(el =>
      el.id === elementId 
        ? { ...el, style: { ...el.style, [styleKey]: value } }
        : el
    ))
  }

  // Handle double click to edit text
  const handleDoubleClick = (elementId) => {
    const element = elements.find(el => el.id === elementId)
    if (element.type === 'text') {
      const newContent = prompt('Edit text:', element.content)
      if (newContent !== null) {
        updateElementContent(elementId, newContent)
      }
    } else if (element.type === 'image') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            updateElementContent(elementId, event.target.result)
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    }
  }

  // Save vere design
  const handleSave = () => {
    onSave({ vereElements: elements })
  }

  const selectedEl = elements.find(el => el.id === selectedElement)

  return (
    <div className="visual-editor">
      {/* Toolbar */}
      <div className="visual-toolbar">
        <div className="toolbar-section">
          <h5 className="toolbar-title">Add Elements</h5>
          <button className="toolbar-btn" onClick={() => addElement('text')}>
            <i className="bi bi-fonts"></i>
            <span>Text</span>
          </button>
          <button className="toolbar-btn" onClick={() => addElement('image')}>
            <i className="bi bi-image"></i>
            <span>Image</span>
          </button>
          <button className="toolbar-btn" onClick={() => addElement('shape')}>
            <i className="bi bi-square"></i>
            <span>Shape</span>
          </button>
        </div>

        {selectedEl && (
          <div className="toolbar-section">
            <h5 className="toolbar-title">Properties</h5>
            
            {selectedEl.type === 'text' && (
              <>
                <div className="property-group">
                  <label>Font Size</label>
                  <input 
                    type="range" 
                    min="12" 
                    max="72" 
                    value={parseInt(selectedEl.style.fontSize) || 16}
                    onChange={(e) => updateElementStyle(selectedEl.id, 'fontSize', e.target.value + 'px')}
                  />
                  <span>{parseInt(selectedEl.style.fontSize) || 16}px</span>
                </div>
                
                <div className="property-group">
                  <label>Color</label>
                  <input 
                    type="color" 
                    value={selectedEl.style.color || '#ffffff'}
                    onChange={(e) => updateElementStyle(selectedEl.id, 'color', e.target.value)}
                  />
                </div>

                <div className="property-group">
                  <label>Align</label>
                  <div className="btn-group">
                    <button onClick={() => updateElementStyle(selectedEl.id, 'textAlign', 'left')}>
                      <i className="bi bi-text-left"></i>
                    </button>
                    <button onClick={() => updateElementStyle(selectedEl.id, 'textAlign', 'center')}>
                      <i className="bi bi-text-center"></i>
                    </button>
                    <button onClick={() => updateElementStyle(selectedEl.id, 'textAlign', 'right')}>
                      <i className="bi bi-text-right"></i>
                    </button>
                  </div>
                </div>
              </>
            )}

            {selectedEl.type === 'shape' && (
              <>
                <div className="property-group">
                  <label>Background</label>
                  <input 
                    type="color" 
                    value={selectedEl.style.backgroundColor || '#6c5ce7'}
                    onChange={(e) => updateElementStyle(selectedEl.id, 'backgroundColor', e.target.value)}
                  />
                </div>

                <div className="property-group">
                  <label>Border Radius</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={parseInt(selectedEl.style.borderRadius) || 0}
                    onChange={(e) => updateElementStyle(selectedEl.id, 'borderRadius', e.target.value + 'px')}
                  />
                </div>
              </>
            )}

            <button className="toolbar-btn delete-btn" onClick={deleteElement}>
              <i className="bi bi-trash"></i>
              <span>Delete</span>
            </button>
          </div>
        )}

        <div className="toolbar-section mt-auto">
          <button className="btn btn-dark w-100" onClick={handleSave}>
            <i className="bi bi-save me-2"></i>
            Save Design
          </button>
        </div>
      </div>

      {/* Vere Design Area */}
      <div 
        className="visual-vere"
        ref={vereRef}
        style={{
          backgroundColor: profile?.bgColor || '#050505',
          backgroundImage: profile?.bgImage ? `url(${profile.bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => setSelectedElement(null)}
      >
        {elements.map(element => (
          <div
            key={element.id}
            className={`vere-element ${selectedElement === element.id ? 'selected' : ''}`}
            style={{
              position: 'absolute',
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              cursor: isDragging && selectedElement === element.id ? 'grabbing' : 'grab',
              ...element.style
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onDoubleClick={() => handleDoubleClick(element.id)}
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
                draggable={false}
              />
            )}
            {element.type === 'shape' && (
              <div style={{ width: '100%', height: '100%' }}></div>
            )}
            
            {selectedElement === element.id && (
              <>
                <div className="resize-handle resize-br"></div>
                <div className="element-label">{element.type}</div>
              </>
            )}
          </div>
        ))}

        {elements.length === 0 && (
          <div className="vere-empty">
            <i className="bi bi-cursor"></i>
            <p>Click elements on the left to start designing</p>
          </div>
        )}
      </div>

      {/* Top Bar */}
      <div className="visual-topbar">
        <div className="d-flex align-items-center gap-3">
          <h4 className="mb-0">Visual Editor</h4>
          <span className="badge bg-secondary">Beta</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">{elements.length} elements</span>
        </div>
      </div>
    </div>
  )
}

export default VisualEditor
