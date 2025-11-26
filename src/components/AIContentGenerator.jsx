import React, { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'

const AIContentGenerator = ({ 
  profileType = 'professional', 
  fieldName = 'description',
  onGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')

  // AI Content Templates based on profile type and field
  const generateContent = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation (in real app, would call AI API)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    let generatedContent = ''
    
    if (fieldName === 'description' || fieldName === 'bio') {
      const templates = {
        professional: [
          `Experienced professional with expertise in ${prompt || 'multiple domains'}. Passionate about innovation and delivering exceptional results. Let's connect and collaborate on exciting opportunities.`,
          `Dedicated ${prompt || 'professional'} focused on excellence and continuous growth. Building meaningful connections and creating value through expertise and collaboration.`,
          `Results-driven professional specializing in ${prompt || 'strategic solutions'}. Committed to excellence, innovation, and making a positive impact in every project.`
        ],
        freelance: [
          `Freelance ${prompt || 'specialist'} helping clients bring their visions to life. Available for collaborations and exciting projects. Let's create something amazing together!`,
          `Independent ${prompt || 'creative professional'} with a passion for quality work. Delivering exceptional results for clients worldwide. Open to new opportunities!`,
          `Versatile freelancer specializing in ${prompt || 'creative solutions'}. Transforming ideas into reality with dedication and expertise.`
        ],
        personal: [
          `${prompt || 'Living life with purpose and passion'}. Sharing experiences, insights, and connecting with amazing people along the way.`,
          `Explorer, creator, dreamer. ${prompt || 'Building connections and sharing stories'} that inspire and motivate.`,
          `Passionate about ${prompt || 'life, learning, and growth'}. Welcome to my personal space where I share my journey and connect with like-minded souls.`
        ],
        creative: [
          `${prompt || 'Creative visionary'} bringing imagination to life through art and innovation. Let's explore the boundaries of creativity together.`,
          `Artist, designer, creator. ${prompt || 'Crafting experiences'} that inspire, engage, and leave lasting impressions.`,
          `Creative professional specializing in ${prompt || 'visual storytelling'}. Transforming concepts into captivating realities.`
        ],
        business: [
          `${prompt || 'Business leader'} driving growth and innovation. Building sustainable solutions and fostering strategic partnerships.`,
          `Entrepreneur and strategist focused on ${prompt || 'creating value'}. Connecting ideas with opportunities to drive success.`,
          `Business professional specializing in ${prompt || 'strategic development'}. Committed to excellence and sustainable growth.`
        ]
      }
      
      const typeTemplates = templates[profileType] || templates.professional
      generatedContent = typeTemplates[Math.floor(Math.random() * typeTemplates.length)]
    } 
    else if (fieldName === 'displayName') {
      // Generate display name suggestions
      const styles = ['Professional', 'Creative', 'Tech', 'Bold', 'Elegant']
      const randomStyle = styles[Math.floor(Math.random() * styles.length)]
      generatedContent = prompt ? `${prompt} | ${randomStyle}` : `${randomStyle} Profile`
    }
    
    setIsGenerating(false)
    
    if (onGenerated) {
      onGenerated(generatedContent)
    }
  }

  const getPlaceholder = () => {
    const placeholders = {
      description: 'e.g., web development, marketing, photography',
      bio: 'e.g., passionate developer, creative designer',
      displayName: 'Enter your name or keywords'
    }
    return placeholders[fieldName] || 'Enter keywords or context'
  }

  const getFieldLabel = () => {
    const labels = {
      description: 'Description',
      bio: 'Bio',
      displayName: 'Display Name'
    }
    return labels[fieldName] || 'Content'
  }

  return (
    <div className="ai-content-generator p-3 border rounded" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div className="d-flex align-items-center gap-2 mb-3">
        <i className="bi bi-stars" style={{ fontSize: '24px' }}></i>
        <div>
          <h6 className="mb-0">AI Content Generator</h6>
          <small style={{ opacity: 0.9 }}>Generate {getFieldLabel()} with AI</small>
        </div>
      </div>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder={getPlaceholder()}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            backdropFilter: 'blur(10px)'
          }}
        />
        <small style={{ opacity: 0.8, fontSize: '11px' }}>
          Optional: Add keywords to personalize the generated content
        </small>
      </div>
      
      <div className="d-flex gap-2">
        <Button
          variant="light"
          size="sm"
          onClick={generateContent}
          disabled={isGenerating}
          style={{ flex: 1 }}
        >
          {isGenerating ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Generating...
            </>
          ) : (
            <>
              <i className="bi bi-magic me-2"></i>
              Generate with AI
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-2" style={{ fontSize: '11px', opacity: 0.8 }}>
        <i className="bi bi-info-circle me-1"></i>
        AI will create content based on your profile type: <strong>{profileType}</strong>
      </div>
    </div>
  )
}

export default AIContentGenerator
