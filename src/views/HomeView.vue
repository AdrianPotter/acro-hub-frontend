<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-logo" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="60" fill="#007EA7"/>
            <circle cx="60" cy="60" r="48" fill="#003459"/>
            <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="52" font-weight="bold" font-family="system-ui,sans-serif">A</text>
          </svg>
        </div>
        <h1 class="hero-title">Acro Hub</h1>
        <p class="hero-subtitle">
          Your ultimate partner acrobatics move database. Discover, learn, and master acrobatic
          moves with our comprehensive library curated for performers of all levels.
        </p>
        <div class="hero-actions">
          <RouterLink to="/register" class="btn btn-primary">Get Started</RouterLink>
          <RouterLink to="/login" class="btn btn-secondary">Login</RouterLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features-inner">
        <h2>Why Acro Hub?</h2>
        <div class="feature-cards">
          <div class="feature-card">
            <div class="feature-icon">🤸</div>
            <h3>Comprehensive Library</h3>
            <p>Browse hundreds of partner acrobatics moves, from beginner-friendly bases to advanced skills.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Easy Search</h3>
            <p>Quickly find moves by name with our powerful real-time search functionality.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌐</div>
            <h3>Community Driven</h3>
            <p>Built by acrobats for acrobats — a growing resource for the partner acrobatics community.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-inner">
        <h2>Ready to explore?</h2>
        <p>Join Acro Hub today and dive into our move database.</p>
        <div class="cta-actions">
          <RouterLink to="/moves" class="btn btn-primary">Browse Moves</RouterLink>
          <RouterLink to="/about" class="btn btn-outline">Learn More</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Hero */
.hero {
  background: linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-darkest) 100%);
  color: var(--color-white);
  padding: 5rem 1.5rem;
  text-align: center;
}

.hero-content {
  max-width: 680px;
  margin: 0 auto;
}

.hero-logo {
  margin: 0 auto 1.5rem;
  width: 120px;
  height: 120px;
}

.hero-logo svg {
  width: 100%;
  height: 100%;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 1rem;
  color: var(--color-white);
}

.hero-subtitle {
  font-size: 1.15rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.82);
  margin: 0 0 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75em 2em;
  border-radius: 6px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s, opacity 0.2s;
}

.btn-primary {
  background-color: var(--color-light-blue);
  color: var(--color-darkest);
}

.btn-primary:hover {
  background-color: var(--color-mid-blue);
  color: var(--color-white);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-light-blue);
  border: 2px solid var(--color-light-blue);
}

.btn-secondary:hover {
  background-color: var(--color-light-blue);
  color: var(--color-darkest);
}

.btn-outline {
  background-color: transparent;
  color: var(--color-dark-blue);
  border: 2px solid var(--color-dark-blue);
}

.btn-outline:hover {
  background-color: var(--color-dark-blue);
  color: var(--color-white);
}

/* Features */
.features {
  padding: 4rem 1.5rem;
  background-color: var(--color-white);
}

.features-inner {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.features-inner h2 {
  font-size: 2rem;
  color: var(--color-dark-blue);
  margin-bottom: 2.5rem;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background-color: #f4fafd;
  border: 1.5px solid #d0eaf5;
  border-radius: 10px;
  padding: 2rem 1.5rem;
  text-align: left;
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.feature-card h3 {
  color: var(--color-dark-blue);
  margin: 0 0 0.5rem;
}

.feature-card p {
  color: #444;
  margin: 0;
  line-height: 1.6;
}

/* CTA */
.cta {
  padding: 4rem 1.5rem;
  background: linear-gradient(135deg, var(--color-mid-blue) 0%, var(--color-dark-blue) 100%);
  color: var(--color-white);
  text-align: center;
}

.cta-inner {
  max-width: 600px;
  margin: 0 auto;
}

.cta-inner h2 {
  font-size: 2rem;
  margin: 0 0 0.75rem;
}

.cta-inner p {
  margin: 0 0 1.75rem;
  font-size: 1.05rem;
  color: rgba(255,255,255,0.85);
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-actions .btn-outline {
  color: var(--color-white);
  border-color: var(--color-white);
}

.cta-actions .btn-outline:hover {
  background-color: var(--color-white);
  color: var(--color-dark-blue);
}
</style>
