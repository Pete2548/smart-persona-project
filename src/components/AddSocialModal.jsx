import React, { useState, useEffect } from 'react'

function AddSocialModal({ social, visible, onClose, onAdd, defaultValue = '' }) {
  const [url, setUrl] = useState(defaultValue)

  useEffect(() => {
    setUrl(defaultValue)
  }, [defaultValue, visible])

  if (!visible) return null

  const handleAdd = () => {
    if (!url || url.trim() === '') return
    onAdd(social, url.trim())
    onClose()
  }

  return (
    <div className="add-social-overlay" onClick={onClose}>
      <div className="add-social-box" onClick={e => e.stopPropagation()}>
        <h5 className="mb-2">Add Social</h5>
        <div className="mb-3">
          <input
            className="form-control add-social-input"
            placeholder={`e.g. ${social}.com/yourname`}
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-light" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  )
}

export default AddSocialModal
