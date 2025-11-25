// Profile Management System for Multiple Profile Versions
const PROFILES_KEY = 'user_profiles' // All profile versions
const ACTIVE_PROFILE_KEY = 'active_profile_id' // Currently selected profile

// Get all profiles for current user
export function getAllProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to get profiles:', err)
    return []
  }
}

// Alias for getAllProfiles
export const getProfiles = getAllProfiles

// Get active profile ID
export function getActiveProfileId() {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY) || null
  } catch {
    return null
  }
}

// Get specific profile by ID
export function getProfileById(profileId) {
  const profiles = getAllProfiles()
  return profiles.find(p => p.id === profileId) || null
}

// Get active profile
export function getActiveProfile() {
  const activeId = getActiveProfileId()
  if (!activeId) {
    // Return first profile or null
    const profiles = getAllProfiles()
    return profiles.length > 0 ? profiles[0] : null
  }
  return getProfileById(activeId)
}

// Get default template based on profile type
function getDefaultTemplate(type) {
  const templates = {
    professional: {
      layout: 'linkedin',
      nameColor: '#0a66c2',
      blockColor: '#f3f6f8',
      bgColor: '#ffffff',
      descColor: '#191919',
      description: 'Professional with experience in...'
    },
    freelance: {
      layout: 'linktree',
      nameColor: '#6c5ce7',
      blockColor: '#ffffff',
      bgColor: '#f5f5f5',
      descColor: '#666666',
      description: 'Freelance designer & developer'
    },
    personal: {
      layout: 'minimal',
      nameColor: '#2d3436',
      blockColor: '#fafafa',
      bgColor: '#ffffff',
      descColor: '#636e72',
      description: 'Welcome to my personal space'
    },
    creative: {
      layout: 'guns',
      nameColor: '#00ff88',
      blockColor: '#1a1a1a',
      bgColor: '#0a0a0a',
      descColor: '#888888',
      description: 'Creative artist & designer'
    },
    business: {
      layout: 'default',
      nameColor: '#0652dd',
      blockColor: '#ffffff',
      bgColor: '#0984e3',
      descColor: '#2d3436',
      description: 'Business professional'
    }
  }
  
  return templates[type] || templates.personal
}

// Create new profile
export function createProfile({ type, name }) {
  const profiles = getAllProfiles()
  const template = getDefaultTemplate(type)
  
  const newProfile = {
    id: `profile_${Date.now()}`,
    type: type || 'personal', // professional, freelance, personal, etc.
    name: name || `${type} Profile`,
    createdAt: new Date().toISOString(),
    data: {
      username: '',
      displayName: '',
      description: template.description,
      avatar: null,
      bgImage: null,
      bgOverlay: 0.3,
      nameColor: template.nameColor,
      blockColor: template.blockColor,
      bgColor: template.bgColor,
      descColor: template.descColor,
      layout: template.layout,
      hasAudio: false,
      audioFileName: '',
      audioStartTime: 0,
      audioEndTime: 0
    }
  }
  
  profiles.push(newProfile)
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  
  // Set as active if it's the first profile
  if (profiles.length === 1) {
    setActiveProfile(newProfile.id)
  }
  
  return newProfile
}

// Update profile
export function updateProfile(profileId, updates) {
  const profiles = getAllProfiles()
  const index = profiles.findIndex(p => p.id === profileId)
  
  if (index === -1) {
    throw new Error('Profile not found')
  }
  
  // Merge updates into data object
  profiles[index] = {
    ...profiles[index],
    data: {
      ...profiles[index].data,
      ...updates
    },
    updatedAt: new Date().toISOString()
  }
  
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  return profiles[index]
}

// Delete profile
export function deleteProfile(profileId) {
  const profiles = getAllProfiles()
  const filtered = profiles.filter(p => p.id !== profileId)
  
  localStorage.setItem(PROFILES_KEY, JSON.stringify(filtered))
  
  // If deleted profile was active, set first profile as active
  const activeId = getActiveProfileId()
  if (activeId === profileId && filtered.length > 0) {
    setActiveProfile(filtered[0].id)
  }
  
  return filtered
}

// Set active profile
export function setActiveProfile(profileId) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, profileId)
}

// Migrate old profile data to new system
export function migrateOldProfile() {
  const profiles = getAllProfiles()
  if (profiles.length > 0) {
    return // Already migrated
  }
  
  // Check for old profile data
  const oldProfile = localStorage.getItem('user_profile')
  if (!oldProfile) {
    return // No old data
  }
  
  try {
    const data = JSON.parse(oldProfile)
    const newProfile = {
      id: `profile_${Date.now()}`,
      type: 'personal',
      name: 'Main Profile',
      createdAt: new Date().toISOString(),
      data: {
        ...data,
        layout: 'default'
      }
    }
    
    localStorage.setItem(PROFILES_KEY, JSON.stringify([newProfile]))
    setActiveProfile(newProfile.id)
    
    console.log('Migrated old profile to new system')
  } catch (err) {
    console.error('Failed to migrate old profile:', err)
  }
}

// Initialize profiles for new users
export function initializeProfiles(username) {
  const profiles = getAllProfiles()
  if (profiles.length === 0) {
    // Create default profile
    const defaultProfile = createProfile({
      type: 'personal',
      name: 'Main Profile'
    })
    
    // Update with username
    updateProfile(defaultProfile.id, { username })
  }
}
