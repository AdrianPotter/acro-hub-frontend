<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu = () => { menuOpen.value = false }
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="navbar-brand" @click="closeMenu">
        <svg class="brand-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="#007EA7"/>
          <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="bold" font-family="system-ui,sans-serif">A</text>
        </svg>
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
        <RouterLink to="/moves" @click="closeMenu">Moves</RouterLink>
        <RouterLink to="/login" class="btn-outline" @click="closeMenu">Login</RouterLink>
        <RouterLink to="/register" class="btn-filled" @click="closeMenu">Register</RouterLink>
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

.nav-links .btn-filled {
  background-color: var(--color-light-blue);
  border-radius: 6px;
  padding: 0.35em 1em;
  color: var(--color-darkest);
  font-weight: 700;
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
