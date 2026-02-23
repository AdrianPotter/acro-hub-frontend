<template>
  <div class="about">
    <section class="about-hero">
      <div class="about-hero-inner">
        <h1>About Acro Hub</h1>
        <p class="lead">
          Acro Hub is an open resource for the partner acrobatics community — a searchable database
          of moves, techniques, and skills designed to help practitioners at every level.
        </p>
      </div>
    </section>

    <section class="about-body">
      <div class="about-content">
        <div class="about-section">
          <h2>What is Partner Acrobatics?</h2>
          <p>
            Partner acrobatics (also known as acro dance, acroyoga, or hand-to-hand) is a discipline
            where two or more people work together to create poses, balances, and dynamic movements.
            It draws from gymnastics, dance, circus arts, and yoga, combining strength, flexibility,
            trust, and communication.
          </p>
        </div>

        <div class="about-section">
          <h2>Our Mission</h2>
          <p>
            We believe knowledge should be accessible. Acro Hub aims to catalogue and document
            the wide variety of acrobatic moves that exist within the partner acrobatics world,
            making it easier for teachers, students, and recreational practitioners to discover
            and reference skills.
          </p>
        </div>

        <div class="about-section">
          <h2>Who Is It For?</h2>
          <ul>
            <li><strong>Beginners</strong> exploring partner acrobatics for the first time.</li>
            <li><strong>Intermediate practitioners</strong> looking to expand their vocabulary of moves.</li>
            <li><strong>Coaches and teachers</strong> who want a quick reference tool.</li>
            <li><strong>Advanced performers</strong> seeking inspiration and documentation.</li>
          </ul>
        </div>

        <div class="about-section">
          <h2>Safety First</h2>
          <p>
            Acrobatics can carry risk of injury. Always practise with qualified spotters or coaches,
            warm up thoroughly, and progress at a safe pace. The moves listed in Acro Hub are
            for reference only — always get in-person guidance before attempting new skills.
          </p>
        </div>

        <div class="about-cta">
          <RouterLink to="/register" class="btn btn-primary">Join Acro Hub</RouterLink>
          <RouterLink to="/moves" class="btn btn-outline">Browse Moves</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-hero {
  background: linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-darkest) 100%);
  color: var(--color-white);
  padding: 4rem 1.5rem;
  text-align: center;
}

.about-hero-inner {
  max-width: 700px;
  margin: 0 auto;
}

.about-hero h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem;
}

.lead {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.85);
  margin: 0;
}

.about-body {
  padding: 3rem 1.5rem;
}

.about-content {
  max-width: 780px;
  margin: 0 auto;
}

.about-section {
  margin-bottom: 2.5rem;
}

.about-section h2 {
  color: var(--color-dark-blue);
  font-size: 1.5rem;
  margin: 0 0 0.75rem;
}

.about-section p,
.about-section ul {
  color: #333;
  line-height: 1.75;
  margin: 0;
}

.about-section ul {
  padding-left: 1.5rem;
}

.about-section ul li {
  margin-bottom: 0.4rem;
}

.about-cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.75em 2em;
  border-radius: 6px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.btn-primary {
  background-color: var(--color-light-blue);
  color: var(--color-darkest);
}

.btn-primary:hover {
  background-color: var(--color-mid-blue);
  color: var(--color-white);
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
</style>
