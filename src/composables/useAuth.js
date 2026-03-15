import { ref, computed } from 'vue'

// Parse a JWT payload to extract Cognito groups (for UI only — backend enforces authorisation)
function parseJwtGroups(token) {
  if (!token) return []
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return Array.isArray(payload['cognito:groups']) ? payload['cognito:groups'] : []
  } catch {
    return []
  }
}

// idToken is used as the Bearer token for API requests (Cognito authorizer validates it)
// accessToken is used only for the logout endpoint
const idToken = ref(localStorage.getItem('idToken'))
const accessToken = ref(localStorage.getItem('accessToken'))
const refreshToken = ref(localStorage.getItem('refreshToken'))

function safeParse(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}

const user = ref(safeParse('user'))

export function useAuth() {
  const isLoggedIn = computed(() => !!idToken.value)

  const userGroups = computed(() => parseJwtGroups(idToken.value))

  // contributors, curators and admins can upload moves
  const canUpload = computed(() =>
    ['contributors', 'curators', 'admins'].some(g => userGroups.value.includes(g))
  )

  // curators and admins can edit and delete moves
  const canEdit = computed(() =>
    ['curators', 'admins'].some(g => userGroups.value.includes(g))
  )

  function setAuth(tokens, userData) {
    idToken.value = tokens.idToken
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken ?? null
    user.value = userData ?? null
    localStorage.setItem('idToken', tokens.idToken)
    localStorage.setItem('accessToken', tokens.accessToken)
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken)
    } else {
      localStorage.removeItem('refreshToken')
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
  }

  function clearAuth() {
    idToken.value = null
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('idToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  return { idToken, accessToken, refreshToken, user, isLoggedIn, userGroups, canUpload, canEdit, setAuth, clearAuth }
}

