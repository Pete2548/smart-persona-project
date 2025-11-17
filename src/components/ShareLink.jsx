import React, { useState } from 'react'

function ShareLink({ url = 'https://vere.me/kotchakorn' }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="share-link d-flex align-items-center gap-2">
      <input className="form-control" readOnly value={url} />
      <button className="btn btn-primary" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
    </div>
  )
}

export default ShareLink
