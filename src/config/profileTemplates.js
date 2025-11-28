// Profile Templates Configuration
// Auto-apply settings based on profile type

export const profileTemplates = {
  personal: {
    name: 'Personal',
    icon: 'bi-person-circle',
    description: 'Share your story and connect with friends',
    color: '#9b5de5',
    
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
    icon: 'bi-brush',
    description: 'Bold portfolio space for designers, artists, and creators',
    color: '#f97316',

    defaultSettings: {
      layout: 'creative',
      nameColor: '#ffd369',
      blockColor: '#12021c',
      bgColor: '#050014',
      descColor: '#e0e7ff',
      bgOverlay: 0.45
    },

    placeholders: {
      displayName: 'Studio Name / Alias',
      description: 'Visual storyteller crafting immersive experiences through color, motion, and bold typography.'
    },

    recommendedThemes: [
      { id: 'creative-neon-portfolio', name: 'Neon Portfolio' },
      { id: 'creative-holographic-dream', name: 'Holographic Dream' },
      { id: 'creative-muse-lab', name: 'Muse Lab' }
    ],

    hints: {
      avatar: 'Use a hero shot, self portrait, or stylized logo',
      description: 'Lead with your creative point-of-view, signature medium, and current collaborations',
      social: 'Link Behance, Dribbble, Instagram, Gumroad, or booking form'
    }
  },

  vtree: {
    name: 'Vtree',
    icon: 'bi-link-45deg',
    description: 'Link tree style for all your important links',
    color: '#4ade80',
    
    defaultSettings: {
      layout: 'linktree',
      nameColor: '#39ff14',
      blockColor: '#ffffff',
      bgColor: '#000000',
      descColor: '#b4f8c8',
      bgOverlay: 0.2
    },
    
    placeholders: {
      displayName: 'Your Name',
      description: 'All my links in one place 🔗',
    },
    
    recommendedThemes: [
      { id: 7, name: 'Neon City' },
      { id: 4, name: 'Mint Fresh' },
      { id: 5, name: 'Emerald Dream' }
    ],
    
    hints: {
      avatar: 'Profile photo or logo',
      description: 'Brief intro or tagline',
      social: 'Add all your social media and important links'
    }
  },

  resume: {
    name: 'Resume',
    icon: 'bi-file-earmark-person',
    description: 'Professional resume for job applications',
    color: '#2563eb',
    
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
      jobTitle: 'Software Engineer',
      location: 'Bangkok, Thailand',
      skills: ['JavaScript', 'React', 'Node.js'],
      experienceYears: 3
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
    color: '#ff6b6b',
    
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
  }
}

// Helper function to get template by type
export const getTemplateByType = (type) => {
  return profileTemplates[type] || profileTemplates.personal
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
export const getProfileTypes = () =>
  Object.entries(profileTemplates).map(([key, template]) => ({
    key,
    value: key,
    type: key,
    ...template
  }))
