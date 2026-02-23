<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <svg class="brand-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="#007EA7"/>
          <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="bold" font-family="system-ui,sans-serif">A</text>
        </svg>
        <span class="brand-name">Acro Hub</span>
      </div>
      <p class="footer-tagline">Your partner acrobatics move database</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/moves">Moves</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </nav>
      <p class="footer-copy">&copy; {{ year }} Acro Hub. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
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
