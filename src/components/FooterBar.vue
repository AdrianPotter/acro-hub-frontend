<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <img class="brand-icon" src="/src/assets/main_logo.png" alt="Acro Hub Logo" />
        <span class="brand-name">Acro Hub</span>
      </div>
      <nav class="footer-links" aria-label="Footer navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/moves">Moves</RouterLink>
        <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
        <RouterLink v-if="!isAuthenticated" to="/register">Register</RouterLink>
      </nav>
      <p class="footer-copy">&copy; {{ year }} Acro Hub. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'

const year = new Date().getFullYear()
const { isAuthenticated } = useAuth()
</script>

<style scoped>
.footer {
  background-color: var(--color-darkest);
  color: var(--color-white);
  padding: 2rem 1.5rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.brand-name {
  font-size: 1.1rem;
  font-weight: 700;
}

.footer-tagline {
  margin: 0;
  color: var(--color-mid-blue);
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.footer-links a {
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--color-light-blue);
}

.footer-copy {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.45);
}
</style>
