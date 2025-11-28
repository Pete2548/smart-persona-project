// Profile View Analytics
// Track profile views and visitor analytics

const PROFILE_VIEWS_KEY = 'profile_views'
const MY_PROFILE_VIEWS_KEY = 'my_profile_views'

// Record a view for a profile
export function recordProfileView(profileId, viewerUsername = 'anonymous') {
  try {
    const views = getAllProfileViews()
    
    const viewRecord = {
      profileId,
      viewerUsername,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    }
    
    views.push(viewRecord)
    
    // Keep only last 1000 views to prevent localStorage overflow
    if (views.length > 1000) {
      views.splice(0, views.length - 1000)
    }
    
    localStorage.setItem(PROFILE_VIEWS_KEY, JSON.stringify(views))
    return true
  } catch (err) {
    console.error('Failed to record profile view:', err)
    return false
  }
}

// Get all profile views
export function getAllProfileViews() {
  try {
    const raw = localStorage.getItem(PROFILE_VIEWS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to get profile views:', err)
    return []
  }
}

// Get views for a specific profile
export function getProfileViews(profileId) {
  const allViews = getAllProfileViews()
  return allViews.filter(v => v.profileId === profileId)
}

// Get view count for a profile
export function getProfileViewCount(profileId) {
  return getProfileViews(profileId).length
}

// Get unique viewers count
export function getUniqueViewersCount(profileId) {
  const views = getProfileViews(profileId)
  const uniqueViewers = new Set(views.map(v => v.viewerUsername))
  return uniqueViewers.size
}

// Get views by date range
export function getViewsByDateRange(profileId, startDate, endDate) {
  const views = getProfileViews(profileId)
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return views.filter(v => {
    const viewDate = new Date(v.timestamp)
    return viewDate >= start && viewDate <= end
  })
}

// Get views for last N days
export function getRecentViews(profileId, days = 7) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  return getViewsByDateRange(profileId, startDate, endDate)
}

// Get views grouped by date
export function getViewsByDate(profileId) {
  const views = getProfileViews(profileId)
  const viewsByDate = {}
  
  views.forEach(v => {
    const date = v.date
    if (!viewsByDate[date]) {
      viewsByDate[date] = []
    }
    viewsByDate[date].push(v)
  })
  
  return viewsByDate
}

// Get analytics summary for a profile
export function getProfileAnalytics(profileId) {
  const allViews = getProfileViews(profileId)
  const today = new Date().toLocaleDateString()
  const todayViews = allViews.filter(v => v.date === today)
  const last7Days = getRecentViews(profileId, 7)
  const last30Days = getRecentViews(profileId, 30)
  
  return {
    totalViews: allViews.length,
    uniqueViewers: getUniqueViewersCount(profileId),
    todayViews: todayViews.length,
    last7DaysViews: last7Days.length,
    last30DaysViews: last30Days.length,
    viewsByDate: getViewsByDate(profileId)
  }
}

// Clear all views (admin function)
export function clearAllViews() {
  localStorage.removeItem(PROFILE_VIEWS_KEY)
}

// Clear views for a specific profile
export function clearProfileViews(profileId) {
  const allViews = getAllProfileViews()
  const filtered = allViews.filter(v => v.profileId !== profileId)
  localStorage.setItem(PROFILE_VIEWS_KEY, JSON.stringify(filtered))
}
