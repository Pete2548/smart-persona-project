import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import './dashboard.css'

import AIControls from '../components/AIControls'
import AIResultsList from '../components/AIResultsList'
import ProfilePreview from '../components/ProfilePreview'
import AIImageGenerator from '../components/AIImageGenerator'

// Simple mock generator — returns variations from keywords and tone
function mockGenerate({ template, tone, length, keywords, existing }) {
  const base = existing || 'Passionate creator.'
  const kw = (keywords || []).join(', ')
  return [
    { id: 'v1', type: 'bio_short', text: `${base} ${template} • ${tone}. Skills: ${kw}` },
    { id: 'v2', type: 'headline', text: `${template} • ${tone} • ${kw}` },
    { id: 'v3', type: 'bio_long', text: `${base} ${template} - I focus on ${kw}. I craft delightful experiences with empathy and precision.` }
  ]
}

function AICreate() {
  const [params, setParams] = useState({ template: 'Personal', tone: 'Friendly', length: 'short', keywords: [] })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [applied, setApplied] = useState(null)
  const [appliedAvatar, setAppliedAvatar] = useState(null)

  const onGenerate = async (p) => {
    setParams(p)
    setLoading(true)
    // simulate network
    setTimeout(() => {
      const res = mockGenerate({ ...p, existing: 'Experienced product designer.' })
      setResults(res)
      setLoading(false)
    }, 700)
  }

  const onApply = (text) => {
    setApplied(text)
  }

  return (
    <div className="dashboard-shell p-4">
      <div className="dashboard-card d-flex">
        <Sidebar />

        <main className="dashboard-main p-4">
          <h4 className="mb-2">AI Create</h4>
          <p className="text-muted small">Generate profile copy (bio, headline, CTA) using AI. Try templates and tones.</p>

          <div className="row mt-3">
            <div className="col-12 col-lg-7">
              <div className="p-3 card-like">
                <AIControls onGenerate={onGenerate} loading={loading} initial={params} />
              </div>

              <div className="mt-3">
                <AIResultsList results={results} loading={loading} onApply={onApply} />
              </div>

              <div className="mt-3 p-3 card-like">
                <h6 className="mb-2">Generate profile image</h6>
                <AIImageGenerator onApply={(u) => setAppliedAvatar(u)} />
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="p-3 card-like">
                <h6 className="mb-3">Preview</h6>
                <ProfilePreview applied={applied} appliedAvatar={appliedAvatar} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AICreate
