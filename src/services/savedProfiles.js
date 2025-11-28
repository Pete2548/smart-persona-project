// Saved Profiles Management
// Users can bookmark/save profiles they're interested in

const SAVED_PROFILES_KEY = 'saved_profiles'

// Get all saved profile IDs for current user
export function getSavedProfiles() {
  try {
    const raw = localStorage.getItem(SAVED_PROFILES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to get saved profiles:', err)
    return []
  }
}

// Check if a profile is saved
export function isProfileSaved(profileId) {
  const saved = getSavedProfiles()
  return saved.includes(profileId)
}

// Save/bookmark a profile
export function saveProfile(profileId) {
  try {
    const saved = getSavedProfiles()
    if (!saved.includes(profileId)) {
      saved.push(profileId)
      localStorage.setItem(SAVED_PROFILES_KEY, JSON.stringify(saved))
      return true
    }
    return false
  } catch (err) {
    console.error('Failed to save profile:', err)
    return false
  }
}

// Unsave/unbookmark a profile
export function unsaveProfile(profileId) {
  try {
    const saved = getSavedProfiles()
    const filtered = saved.filter(id => id !== profileId)
    localStorage.setItem(SAVED_PROFILES_KEY, JSON.stringify(filtered))
    return true
  } catch (err) {
    console.error('Failed to unsave profile:', err)
    return false
  }
}

// Toggle saved status
export function toggleSaveProfile(profileId) {
  if (isProfileSaved(profileId)) {
    return unsaveProfile(profileId)
  } else {
    return saveProfile(profileId)
  }
}

// Get count of saved profiles
export function getSavedProfilesCount() {
  return getSavedProfiles().length
}
