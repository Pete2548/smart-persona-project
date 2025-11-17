import React from 'react'

function QuickActions() {
  return (
    <div className="quick-actions d-flex gap-2">
      <button className="btn btn-outline-primary">Edit Profile</button>
      <button className="btn btn-outline-secondary">Preview</button>
      <button className="btn btn-outline-success">Customize Links</button>
      <button className="btn btn-outline-dark">AI Create</button>
    </div>
  )
}

export default QuickActions
