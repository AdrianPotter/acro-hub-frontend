import { ref } from 'vue'

const AUTH_STORAGE_KEY = 'acrohub.isAuthenticated'
const isAuthenticated = ref(localStorage.getItem(AUTH_STORAGE_KEY) === 'true')

function setAuthenticated(value) {
  isAuthenticated.value = Boolean(value)
  localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated.value))
}

export function useAuth() {
  return {
    isAuthenticated,
    setAuthenticated,
  }
}

