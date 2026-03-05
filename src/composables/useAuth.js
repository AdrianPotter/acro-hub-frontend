import { ref, computed } from 'vue'

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

  return { idToken, accessToken, refreshToken, user, isLoggedIn, setAuth, clearAuth }
}
