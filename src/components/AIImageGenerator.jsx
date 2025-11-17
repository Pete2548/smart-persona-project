import React, { useState } from 'react'

// Uses DiceBear Avatars as a simple stateless image generator (no API key)
// Style options: 'bottts', 'identicon', 'avataaars', 'gridy', 'pixel-art'
function buildDicebearUrl(seed, style = 'bottts', bg = 'ffffff'){
  return `https://avatars.dicebear.com/api/${style}/${encodeURIComponent(seed)}.svg?background=%23${bg}`
}

function AIImageGenerator({ onApply }){
  const [style, setStyle] = useState('bottts')
  const [seedText, setSeedText] = useState('Kotchakorn')
  const [bg, setBg] = useState('ffffff')
  const [url, setUrl] = useState(buildDicebearUrl(seedText, style, bg))

  const generate = () => {
    const seed = `${seedText}-${Date.now()}`
    const u = buildDicebearUrl(seed, style, bg)
    setUrl(u)
  }

  const apply = () => {
    if(onApply) onApply(url)
  }

  return (
    <div className="ai-image-generator">
      <div className="mb-2">
        <label className="form-label small">Seed / name</label>
        <input className="form-control" value={seedText} onChange={e => setSeedText(e.target.value)} />
      </div>

      <div className="d-flex gap-2 mb-2">
        <select className="form-select" value={style} onChange={e => setStyle(e.target.value)}>
          <option value="bottts">Bottts</option>
          <option value="identicon">Identicon</option>
          <option value="avataaars">Avataaars</option>
          <option value="gridy">Gridy</option>
          <option value="pixel-art">Pixel Art</option>
        </select>
        <input className="form-control" style={{maxWidth:120}} value={bg} onChange={e => setBg(e.target.value.replace('#',''))} />
      </div>

      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-primary" onClick={generate}>Generate Avatar</button>
        <button className="btn btn-outline-secondary" onClick={() => { setSeedText(''); setUrl(buildDicebearUrl('', style, bg)) }}>Reset</button>
      </div>

      <div className="mb-2">
        <div style={{width:120, height:120, border:'1px solid rgba(0,0,0,0.06)', borderRadius:8, overflow:'hidden'}}>
          <img src={url} alt="avatar" style={{width:'100%', height:'100%', objectFit:'cover'}} />
        </div>
      </div>

      <div className="d-flex gap-2">
        <a className="btn btn-outline-primary" href={url} target="_blank" rel="noreferrer">Open</a>
        <button className="btn btn-primary" onClick={apply}>Apply Avatar</button>
      </div>
    </div>
  )
}

export default AIImageGenerator
