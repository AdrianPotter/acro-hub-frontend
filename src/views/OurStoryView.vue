<template>
  <div class="our-story">
    <section class="story-hero">
      <div class="story-hero-inner">
        <h1>Our Story</h1>
        <p class="lead">
          Meet Adrian Potter and Amy Welmers-Bailey — the partnership behind Acro Hub.
        </p>
      </div>
    </section>

    <section class="story-body">
      <div class="story-content">
        <div class="story-section">
          <p>
            Acro Hub was created out of a long-standing partnership built on both competitive success and a deep
            commitment to teaching and developing others in the acrobatic dance community.
          </p>
        </div>

        <div class="story-video-wrapper">
          <iframe
              src="https://www.youtube.com/embed/MSX9ijqRX7s"
              title="Acro Hub — Our Story"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
          ></iframe>
        </div>

        <div class="story-section">
          <h2>Where It Began</h2>
          <p>
            We began dancing together through the university scene in Cambridge, where we performed at various
            competitions and events both individually and as a team. Our achievements included winning the Inter Varsity
            Dance Competition (IVDC) rock and roll division. It was a start of a long partnership based around a shared
            approach to training, creativity, and performance that would shape everything that followed.
          </p>
        </div>

        <div class="story-section">
          <h2>Building a Community</h2>
          <p>
            Our focus quickly expanded beyond competing. We founded and coached the Oxford University Rock and Roll
            Team (OURnR), running it for six years. During that time, we didn't just maintain a successful team — we
            helped grow a pipeline of dancers, coaching multiple couples to win the IVDC rock and roll division
            themselves. Having won IVDC again for Oxford ourselves, we were fortunate enough to subsequently be invited
            back to perform as part of the event's professional showcase. Alongside this, we choreographed and performed
            annual group routines, winning the Varsity group performance every year the category ran during that period.
            This experience gave us a strong understanding of how people learn acrobatics safely and effectively, from complete beginners through to
            advanced performers.
          </p>
        </div>

        <div class="story-section">
          <h2>Competing at the Highest Level</h2>
          <p>
            We continued to compete at a higher level, winning both the aerial and showcase divisions at the World
            Modern Jive Championships (WMJC), including the showcase title in 2023, which remains our most
            significant competitive achievement. Alongside this, we founded Flight Club, an Oxford-based acrobatic
            dance team focused on pushing performance and technical standards. Through Flight Club, we coached
            multiple couples to win WMJC aerial titles and produced two group showcases that both won the group
            cabaret division. Even during the disruption of COVID-19, we adapted by producing virtual routines to
            keep the community engaged and progressing.
          </p>
        </div>

        <div class="story-section">
          <h2>Why We Built Acro Hub</h2>
          <p>
            Acro Hub is a natural extension of this journey. Over the years, we have seen how difficult it can be
            for dancers to access clear, structured, and reliable resources for acrobatic movement. Much of what
            exists is fragmented, inconsistently taught, or lacks the progression needed for safe development. We
            built Acro Hub to address that gap: a place where moves are documented clearly, taught responsibly, and
            organised in a way that supports long-term progression.
          </p>
          <p>
            Our experience — both in achieving at a high level and in developing other dancers to do the same —
            underpins everything in Acro Hub. It is not just a collection of moves, but a reflection of methods that
            have been tested in competition, refined through coaching, and proven across many different dancers over
            time.
          </p>
        </div>

        <div class="story-cta">
          <RouterLink to="/register" class="btn btn-primary">Join Acro Hub</RouterLink>
          <RouterLink to="/about" class="btn btn-outline">About the Hub</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.story-hero {
  background: linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-darkest) 100%);
  color: var(--color-white);
  padding: 4rem 1.5rem;
  text-align: center;
}

.story-hero-inner {
  max-width: 700px;
  margin: 0 auto;
}

.story-hero h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem;
}

.lead {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.story-body {
  padding: 3rem 1.5rem;
}

.story-content {
  max-width: 780px;
  margin: 0 auto;
}

.story-section {
  margin-bottom: 2.5rem;
}

.story-section h2 {
  color: var(--color-dark-blue);
  font-size: 1.5rem;
  margin: 0 0 0.75rem;
}

.story-section p {
  color: #333;
  line-height: 1.75;
  margin: 0 0 1rem;
}

.story-section p:last-child {
  margin-bottom: 0;
}

.story-video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  margin-bottom: 2.5rem;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--color-darkest);
}

.story-video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.story-cta {
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
