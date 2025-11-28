// Simple client-side auth using localStorage (for development/demo purposes)
const USERS_KEY = 'spa_users'
const CURRENT_USER_KEY = 'spa_current_user'
const PROFILE_KEY = 'user_profile'

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    return null
  }
}

function writeJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch (e) { }
}

export function getUsers() {
  const users = readJSON(USERS_KEY)
  return Array.isArray(users) ? users : []
}

function saveUsers(users) {
  writeJSON(USERS_KEY, users)
}

function setCurrentUser(u) {
  writeJSON(CURRENT_USER_KEY, u)
}

// Exported helper to set session (wraps internal setCurrentUser)
export function setSession(u) {
  setCurrentUser(u)
}

export function getCurrentUser() {
  return readJSON(CURRENT_USER_KEY)
}

export function logout() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY)
    // clear social links on logout so the Links page returns to its initial state
    try { localStorage.removeItem('socialLinks') } catch (e) { }
    // remove stored profile so UI (profile card) shows no name after logout
    try { localStorage.removeItem(PROFILE_KEY) } catch (e) { }
  } catch (e) { }
}

export function registerUser({ username, email, password, firstName, lastName, birthDate }) {
  if (!username || !email || !password) {
    return { ok: false, message: 'Username, email and password are required' }
  }
  const users = getUsers()
  if (users.find(u => u.username === username)) return { ok: false, message: 'Username already taken' }
  if (users.find(u => u.email === email)) return { ok: false, message: 'Email already taken' }

  const token = Math.random().toString(36).slice(2)
  const newUser = { username, email, password, firstName, lastName, birthDate, role: 'user', token, createdAt: new Date().toISOString() }
  users.push(newUser)
  saveUsers(users)

  // set current session and a minimal profile used by ProfileView
  setCurrentUser({ username, email, token })
  const profile = { username, firstName, lastName, email, description: '', avatar: '', bgColor: '#050505', nameColor: '#ffffff' }
  writeJSON(PROFILE_KEY, profile)

  return { ok: true, user: newUser }
}

export function login(identifier, password) {
  if (!identifier || !password) return { ok: false, message: 'Missing credentials' }
  const users = getUsers()
  const found = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password)
  if (!found) return { ok: false, message: 'Invalid username/email or password' }

  setCurrentUser({ username: found.username, email: found.email, token: found.token })
  // create/update profile used by ProfileView
  const profile = { username: found.username, firstName: found.firstName || '', lastName: found.lastName || '', email: found.email, description: '', avatar: '' }
  writeJSON(PROFILE_KEY, profile)

  return { ok: true, user: found }
}

export function getProfile() {
  return readJSON(PROFILE_KEY)
}

// Returns true if current user has role 'admin'
export function isAdmin() {
  const cur = getCurrentUser()
  if (!cur || !cur.username) return false
  const users = getUsers()
  const found = users.find(u => u.username === cur.username)
  return !!(found && found.role === 'admin')
}

// Development helper: promote a user to admin role and persist
export function promoteUserToAdmin(username) {
  if (!username) return false
  const users = getUsers()
  const idx = users.findIndex(u => u.username === username)
  if (idx === -1) return false
  users[idx].role = 'admin'
  saveUsers(users)
  return true
}

export function demoteAdminToUser(username) {
  if (!username) return false
  const users = getUsers()
  const idx = users.findIndex(u => u.username === username)
  if (idx === -1) return false
  users[idx].role = 'user'
  saveUsers(users)
  return true
}

export function deleteUser(username) {
  if (!username) return false
  let users = getUsers()
  const initialLength = users.length
  users = users.filter(u => u.username !== username)
  if (users.length === initialLength) return false
  saveUsers(users)
  return true
}

export function impersonateUser(username) {
  const users = getUsers()
  const targetUser = users.find(u => u.username === username)
  if (!targetUser) return false

  // Set current session to target user
  setCurrentUser({ username: targetUser.username, email: targetUser.email, token: targetUser.token })

  // Update profile key to match target user
  const profile = {
    username: targetUser.username,
    firstName: targetUser.firstName || '',
    lastName: targetUser.lastName || '',
    email: targetUser.email,
    description: '',
    avatar: ''
  }
  writeJSON(PROFILE_KEY, profile)
  return true
}

export function updateUser(username, updates) {
  const users = getUsers()
  const idx = users.findIndex(u => u.username === username)
  if (idx === -1) return false

  // Update user fields
  users[idx] = { ...users[idx], ...updates }
  saveUsers(users)
  return true
}
