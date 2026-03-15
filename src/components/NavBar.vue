<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth } from '../services/api.js'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const route = useRoute()
const { isLoggedIn, accessToken, canUpload, canEdit, clearAuth } = useAuth()

const menuOpen = ref(false)
const movesDropdownOpen = ref(false)

const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu = () => {
  menuOpen.value = false
  movesDropdownOpen.value = false
}
const toggleMovesDropdown = () => { movesDropdownOpen.value = !movesDropdownOpen.value }
const closeMovesDropdown = () => { movesDropdownOpen.value = false }

// Show an "Edit Move" link in the dropdown when viewing a specific move
const currentMoveId = computed(() => {
  if (route.name === 'move-detail') {
    return route.params.moveId ?? null
  }
  return null
})

async function handleLogout() {
  const token = accessToken.value
  clearAuth()
  closeMenu()
  router.push('/login')
  // Best-effort server-side revocation; errors are silently ignored
  if (token) {
    try {
      await auth.logout(token)
    } catch {
      // token already expired or network failure — local session already cleared
    }
  }
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="navbar-brand" @click="closeMenu">
        <img class="brand-icon" src="/src/assets/main_logo.png" alt="Acro Hub Logo" />
        <span>Acro Hub</span>
      </RouterLink>

      <button class="hamburger" :aria-expanded="menuOpen" aria-label="Toggle navigation" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav :class="['nav-links', { open: menuOpen }]" role="navigation">
        <RouterLink to="/" @click="closeMenu">Home</RouterLink>
        <RouterLink to="/about" @click="closeMenu">About</RouterLink>
        <div
          v-if="isLoggedIn"
          class="nav-dropdown"
          :class="{ open: movesDropdownOpen }"
          @mouseenter="movesDropdownOpen = true"
          @mouseleave="movesDropdownOpen = false"
        >
          <button
            class="nav-dropdown-trigger"
            :aria-expanded="movesDropdownOpen"
            aria-haspopup="true"
            @click="toggleMovesDropdown"
          >
            Moves
            <svg class="dropdown-chevron" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="nav-dropdown-menu" role="menu">
            <RouterLink to="/moves" role="menuitem" @click="closeMenu">Browse</RouterLink>
            <RouterLink v-if="canUpload" to="/moves/upload" role="menuitem" @click="closeMenu">Upload</RouterLink>
            <RouterLink v-if="canEdit && currentMoveId" :to="`/moves/${currentMoveId}/edit`" role="menuitem" @click="closeMenu">Edit Move</RouterLink>
          </div>
        </div>
        <template v-if="isLoggedIn">
          <button class="btn-outline btn-logout" @click="handleLogout">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn-outline" @click="closeMenu">Login</RouterLink>
          <RouterLink to="/register" class="btn-filled" @click="closeMenu">Register</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background-color: var(--color-dark-blue);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-white);
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
}

.brand-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  object-fit: contain;
  background: transparent;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--color-white);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--color-light-blue);
}

.nav-links .btn-outline {
  border: 2px solid var(--color-light-blue);
  border-radius: 6px;
  padding: 0.35em 1em;
  color: var(--color-light-blue);
}

.nav-links .btn-outline:hover {
  background-color: var(--color-light-blue);
  color: var(--color-darkest);
}

.nav-links .btn-logout {
  border: 2px solid var(--color-light-blue);
  border-radius: 6px;
  padding: 0.35em 1em;
  color: var(--color-light-blue);
  background: none;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.nav-links .btn-logout:hover {
  background-color: var(--color-light-blue);
  color: var(--color-darkest);
}

.nav-links .btn-filled {
  background-color: var(--color-light-blue);
  border-radius: 6px;
  padding: 0.35em 1em;
  color: var(--color-darkest);
  font-weight: 700;
}

.nav-links .btn-filled.router-link-active,
.nav-links .btn-filled.router-link-exact-active {
  color: var(--color-white);
}

.nav-links .btn-filled:hover {
  background-color: var(--color-mid-blue);
  color: var(--color-white);
}

/* Dropdown */
.nav-dropdown {
  position: relative;
}

.nav-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: none;
  border: none;
  color: var(--color-white);
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.nav-dropdown-trigger:hover,
.nav-dropdown.open .nav-dropdown-trigger {
  color: var(--color-light-blue);
}

.dropdown-chevron {
  width: 10px;
  height: 10px;
  transition: transform 0.2s;
}

.nav-dropdown.open .dropdown-chevron {
  transform: rotate(180deg);
}

.nav-dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-dark-blue);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  min-width: 140px;
  padding: 0.75rem 0 0.4rem;
  z-index: 200;
}

.nav-dropdown.open .nav-dropdown-menu {
  display: block;
}

.nav-dropdown-menu a {
  display: block;
  padding: 0.55em 1.1em;
  color: var(--color-white);
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.15s, color 0.15s;
}

.nav-dropdown-menu a:hover,
.nav-dropdown-menu a.router-link-active {
  background-color: rgba(255,255,255,0.08);
  color: var(--color-light-blue);
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--color-white);
  border-radius: 2px;
  transition: 0.2s;
}

@media (max-width: 700px) {
  .hamburger {
    display: flex;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background-color: var(--color-dark-blue);
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-dropdown {
    width: 100%;
  }

  .nav-dropdown-menu {
    position: static;
    transform: none;
    box-shadow: none;
    border: none;
    border-left: 2px solid rgba(255,255,255,0.15);
    border-radius: 0;
    padding: 0.25rem 0 0.25rem 0.75rem;
    margin-top: 0.25rem;
  }
}
</style>
