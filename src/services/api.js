const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
  console.warn('[api] VITE_API_BASE_URL is not set. Copy .env.example to .env.local and configure it.')
}

async function request(path, options = {}) {
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
}

export const movesApi = {
  list: () => request('/moves'),
  get: (moveId) => request(`/moves/${encodeURIComponent(moveId)}`),
  create: (moveData) =>
    request('/moves', {
      method: 'POST',
      body: JSON.stringify(moveData),
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
