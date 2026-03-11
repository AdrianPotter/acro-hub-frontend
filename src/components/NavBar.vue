<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../services/api.js'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { isLoggedIn, accessToken, clearAuth } = useAuth()

const menuOpen = ref(false)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu = () => { menuOpen.value = false }

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
        <RouterLink v-if="isLoggedIn" to="/moves" @click="closeMenu">Moves</RouterLink>
        <RouterLink v-if="isLoggedIn" to="/moves/upload" @click="closeMenu">Upload Move</RouterLink>
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
}
</style>
