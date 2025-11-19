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
  try { localStorage.setItem(key, JSON.stringify(val)) } catch (e) {}
}

export function getUsers() {
  return readJSON(USERS_KEY) || []
}

function saveUsers(users) {
  writeJSON(USERS_KEY, users)
}

function setCurrentUser(u) {
  writeJSON(CURRENT_USER_KEY, u)
}

export function getCurrentUser() {
  return readJSON(CURRENT_USER_KEY)
}

export function logout() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY)
    // keep user_profile for viewing, but you may want to remove it in some apps
  } catch (e) {}
}

export function registerUser({ username, email, password, firstName, lastName, birthDate }) {
  if (!username || !email || !password) {
    return { ok: false, message: 'Username, email and password are required' }
  }
  const users = getUsers()
  if (users.find(u => u.username === username)) return { ok: false, message: 'Username already taken' }
  if (users.find(u => u.email === email)) return { ok: false, message: 'Email already taken' }

  const token = Math.random().toString(36).slice(2)
  const newUser = { username, email, password, firstName, lastName, birthDate, role: 'user', token }
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
