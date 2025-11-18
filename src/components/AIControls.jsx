import React, { useState } from 'react'

function AIControls({ onGenerate, loading, initial }) {
  const [template, setTemplate] = useState(initial.template || 'Personal')
  const [tone, setTone] = useState(initial.tone || 'Friendly')
  const [length, setLength] = useState(initial.length || 'short')
  const [keywords, setKeywords] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const keywordsArr = keywords.split(',').map(s => s.trim()).filter(Boolean)
    onGenerate({ template, tone, length, keywords: keywordsArr })
  }

  return (
    <form onSubmit={submit}>
      <div className="mb-2">
        <label className="form-label small">Template</label>
        <select className="form-select" value={template} onChange={e => setTemplate(e.target.value)}>
          <option>Personal</option>
          <option>Business</option>
          <option>Artist</option>
          <option>Developer</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label small">Tone</label>
        <select className="form-select" value={tone} onChange={e => setTone(e.target.value)}>
          <option>Friendly</option>
          <option>Professional</option>
          <option>Playful</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label small">Keywords (comma separated)</label>
        <input className="form-control" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="react, design, ux" />
      </div>

      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-dark" type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
        <button className="btn btn-outline-danger" type="button" onClick={() => { setKeywords(''); setTemplate('Personal'); setTone('Friendly'); setLength('short') }}>Clear</button>
      </div>
    </form>
  )
}

export default AIControls
