import router from '../router/index.js'
import { useAuth } from '../composables/useAuth.js'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const EXPIRED_TOKEN_MESSAGE = 'The incoming token has expired'

if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
  console.warn('[api] VITE_API_BASE_URL is not set. Copy .env.example to .env.local and configure it.')
}

async function tryRefreshTokens() {
  const storedRefreshToken = localStorage.getItem('refreshToken')
  if (!storedRefreshToken || localStorage.getItem('rememberMe') !== 'true') {
    return false
  }
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    })
    if (!response.ok) return false
    const data = await response.json()
    const { setAuth } = useAuth()
    // Refresh endpoint returns new accessToken + idToken but no new refreshToken — preserve the existing one
    setAuth({ idToken: data.idToken, accessToken: data.accessToken, refreshToken: storedRefreshToken }, null, true)
    return true
  } catch {
    return false
  }
}

async function request(path, options = {}, skipRefresh = false) {
  const idToken = localStorage.getItem('idToken')
  const headers = {
    'Content-Type': 'application/json',
    ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    let message
    try {
      const body = await response.json()
      message = body.error || body.message || body.detail || response.statusText
    } catch {
      message = response.statusText
    }
    if (message === EXPIRED_TOKEN_MESSAGE) {
      if (!skipRefresh && await tryRefreshTokens()) {
        return request(path, options, true)
      }
      const { clearAuth } = useAuth()
      clearAuth()
      router.push({ name: 'login', query: { sessionExpired: 'true' } })
    }
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export const auth = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: (accessToken) =>
    request('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  register: (email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  confirmRegistration: (email, code) =>
    request('/auth/confirm-registration', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),

  refresh: (refreshToken) =>
    request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
}

export const movesApi = {
  list: () => request('/moves'),
  get: (moveId) => request(`/moves/${encodeURIComponent(moveId)}`),
  create: (moveData) =>
    request('/moves', {
      method: 'POST',
      body: JSON.stringify(moveData),
    }),
  update: (moveId, moveData) =>
    request(`/moves/${encodeURIComponent(moveId)}`, {
      method: 'PATCH',
      body: JSON.stringify(moveData),
    }),
  delete: (moveId) =>
    request(`/moves/${encodeURIComponent(moveId)}`, {
      method: 'DELETE',
    }),
}

export const videosApi = {
  // POST is used per the API spec to obtain a pre-signed S3 upload URL
  getUploadUrl: (moveId) =>
    request(`/videos/${encodeURIComponent(moveId)}/upload-url`, {
      method: 'POST',
    }),
  getViewUrl: (moveId) =>
    request(`/videos/${encodeURIComponent(moveId)}/url`),
}

export const usersApi = {
  list: () => request('/users'),
  get: (username) => request(`/users/${encodeURIComponent(username)}`),
  delete: (username) =>
    request(`/users/${encodeURIComponent(username)}`, { method: 'DELETE' }),
  updateGroups: (username, groups) =>
    request(`/users/${encodeURIComponent(username)}/groups`, {
      method: 'PUT',
      body: JSON.stringify({ groups }),
    }),
  disable: (username) =>
    request(`/users/${encodeURIComponent(username)}/disable`, { method: 'POST' }),
  enable: (username) =>
    request(`/users/${encodeURIComponent(username)}/enable`, { method: 'POST' }),
}
