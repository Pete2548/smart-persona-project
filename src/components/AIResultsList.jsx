import React from 'react'

function ResultCard({ r, onApply }) {
  return (
    <div className="p-3 mb-2 card-like">
      <div className="d-flex justify-content-between align-items-start mb-1">
        <strong>{r.type.replace('_', ' ')}</strong>
        <div>
          <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => { navigator.clipboard?.writeText(r.text) }}>Copy</button>
          <button className="btn btn-sm btn-primary" onClick={() => onApply(r.text)}>Apply</button>
        </div>
      </div>
      <div className="text-small" style={{ whiteSpace: 'pre-wrap' }}>{r.text}</div>
    </div>
  )
}

function AIResultsList({ results = [], loading, onApply }) {
  if (loading) return <div className="p-3">Generating…</div>
  if (!results.length) return <div className="p-3 text-muted">No results yet — use Generate.</div>

  return (
    <div>
      {results.map(r => (
        <ResultCard key={r.id} r={r} onApply={onApply} />
      ))}
    </div>
  )
}

export default AIResultsList
