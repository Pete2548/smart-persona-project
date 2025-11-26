// Profile Templates Configuration
// Auto-apply settings based on profile type

export const profileTemplates = {
  professional: {
    name: 'Professional',
    icon: 'bi-briefcase-fill',
    description: 'Perfect for job applications and professional networking',
    
    defaultSettings: {
      layout: 'linkedin',
      nameColor: '#1E6FB8',
      blockColor: '#ffffff',
      bgColor: '#0a1929',
      descColor: '#90caf9',
      bgOverlay: 0.4
    },
    
    placeholders: {
      displayName: 'Your Professional Name',
      description: 'Experienced professional with expertise in multiple domains. Passionate about innovation and delivering exceptional results.',
    },
    
    recommendedThemes: [
      { id: 1, name: 'Ocean Blue' },
      { id: 8, name: 'Midnight' },
      { id: 15, name: 'Dark Premium' }
    ],
    
    hints: {
      avatar: 'Use a professional headshot photo',
      description: 'Highlight your expertise, experience, and professional achievements',
      social: 'Add LinkedIn, GitHub, and professional portfolio links'
    }
  },

  freelance: {
    name: 'Freelance',
    icon: 'bi-person-workspace',
    description: 'Showcase your services and attract clients',
    
    defaultSettings: {
      layout: 'linktree',
      nameColor: '#ff6b6b',
      blockColor: '#ffffff',
      bgColor: '#2d1b4e',
      descColor: '#ffd93d',
      bgOverlay: 0.3
    },
    
    placeholders: {
      displayName: 'Your Creative Name',
      description: 'Freelance specialist helping clients bring their visions to life. Available for collaborations and exciting projects!',
    },
    
    recommendedThemes: [
      { id: 3, name: 'Sunset Vibes' },
      { id: 5, name: 'Emerald Dream' },
      { id: 16, name: 'Gold Luxury' }
    ],
    
    hints: {
      avatar: 'Creative photo that represents your brand',
      description: 'Describe your services, specialties, and what makes you unique',
      social: 'Add portfolio, Instagram, Behance, and contact methods'
    }
  },

  personal: {
    name: 'Personal',
    icon: 'bi-person-circle',
    description: 'Share your story and connect with friends',
    
    defaultSettings: {
      layout: 'default',
      nameColor: '#e056fd',
      blockColor: '#ffffff',
      bgColor: '#1e1138',
      descColor: '#d4b4ff',
      bgOverlay: 0.3
    },
    
    placeholders: {
      displayName: 'Your Name',
      description: 'Living life with purpose and passion. Sharing experiences and connecting with amazing people!',
    },
    
    recommendedThemes: [
      { id: 2, name: 'Purple Dream' },
      { id: 4, name: 'Mint Fresh' },
      { id: 6, name: 'Rose Gold' }
    ],
    
    hints: {
      avatar: 'Your favorite personal photo',
      description: 'Share your interests, hobbies, and what you\'re passionate about',
      social: 'Add Instagram, Facebook, TikTok, and personal links'
    }
  },

  creative: {
    name: 'Creative',
    icon: 'bi-palette-fill',
    description: 'Display your creative work and artistic vision',
    
    defaultSettings: {
      layout: 'custom',
      nameColor: '#00ff87',
      blockColor: '#ffffff',
      bgColor: '#0a3d2e',
      descColor: '#c7f0bd',
      bgOverlay: 0.35
    },
    
    placeholders: {
      displayName: 'Artist Name',
      description: 'Creative visionary bringing imagination to life through art and innovation. Let\'s explore creativity together!',
    },
    
    recommendedThemes: [
      { id: 3, name: 'Sunset Vibes' },
      { id: 7, name: 'Neon City' },
      { id: 5, name: 'Emerald Dream' }
    ],
    
    hints: {
      avatar: 'Artistic photo or your creative work',
      description: 'Showcase your artistic style, creative process, and vision',
      social: 'Add Instagram, Behance, ArtStation, and portfolio'
    }
  },

  business: {
    name: 'Business',
    icon: 'bi-building',
    description: 'Promote your business and services',
    
    defaultSettings: {
      layout: 'linkedin',
      nameColor: '#d4af37',
      blockColor: '#ffffff',
      bgColor: '#0f0f0f',
      descColor: '#b8956a',
      bgOverlay: 0.4
    },
    
    placeholders: {
      displayName: 'Business Name',
      description: 'Business leader driving growth and innovation. Building sustainable solutions and fostering strategic partnerships.',
    },
    
    recommendedThemes: [
      { id: 1, name: 'Ocean Blue' },
      { id: 15, name: 'Dark Premium' },
      { id: 16, name: 'Gold Luxury' }
    ],
    
    hints: {
      avatar: 'Company logo or professional business photo',
      description: 'Describe your business, services, and value proposition',
      social: 'Add LinkedIn, company website, and business contacts'
    }
  }
}

// Helper function to get template by type
export const getTemplateByType = (type) => {
  return profileTemplates[type] || profileTemplates.professional
}

// Helper function to apply template to profile data
export const applyTemplate = (type, existingData = {}) => {
  const template = getTemplateByType(type)
  
  return {
    ...existingData,
    ...template.defaultSettings,
    // Only set placeholders if fields are empty
    displayName: existingData.displayName || template.placeholders.displayName,
    description: existingData.description || template.placeholders.description,
  }
}

// Get all available profile types
export const getProfileTypes = () => {
  return Object.keys(profileTemplates).map(key => ({
    key,
    ...profileTemplates[key]
  }))
}
