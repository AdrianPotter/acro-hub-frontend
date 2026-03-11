<template>
  <div class="move-detail-page">
    <section class="detail-header">
      <div class="detail-header-inner">
        <RouterLink to="/moves" class="back-link">← Back to Library</RouterLink>
        <template v-if="move">
          <div class="move-badges">
            <div class="move-badge difficulty" :class="move.difficulty">{{ move.difficulty }}</div>
            <div v-if="move.category" class="move-badge category">{{ move.category }}</div>
          </div>
          <h1>{{ move.name }}</h1>
        </template>
        <div v-else-if="!loading" class="header-placeholder">&nbsp;</div>
      </div>
    </section>

    <section class="detail-body">
      <div class="detail-inner">
        <p v-if="loading" class="loading-text" aria-live="polite">Loading move…</p>
        <div v-else-if="fetchError" class="fetch-error" role="alert">{{ fetchError }}</div>
        <template v-else-if="move">
          <div class="video-section">
            <p v-if="videoLoading" class="loading-text" aria-live="polite">Loading video…</p>
            <div v-else-if="videoError" class="fetch-error" role="alert">{{ videoError }}</div>
            <video
              v-else-if="videoUrl"
              class="move-video"
              :src="videoUrl"
              controls
              preload="metadata"
              aria-label="Video for {{ move.name }}"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div class="move-meta">
            <p v-if="move.description" class="move-description">{{ move.description }}</p>
            <div v-if="move.tags && move.tags.length" class="move-tags">
              <span v-for="tag in move.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { movesApi, videosApi } from '../services/api.js'

const route = useRoute()
const moveId = route.params.moveId

const move = ref(null)
const loading = ref(true)
const fetchError = ref('')

const videoUrl = ref('')
const videoLoading = ref(true)
const videoError = ref('')

onMounted(async () => {
  const [moveResult, videoResult] = await Promise.allSettled([
    movesApi.get(moveId),
    videosApi.getViewUrl(moveId),
  ])

  if (moveResult.status === 'fulfilled') {
    move.value = moveResult.value
  } else {
    fetchError.value = moveResult.reason?.message || 'Failed to load move details.'
  }
  loading.value = false

  if (videoResult.status === 'fulfilled') {
    videoUrl.value = videoResult.value?.viewUrl ?? ''
    if (!videoUrl.value) {
      videoError.value = 'Video is not available yet.'
    }
  } else {
    videoError.value = videoResult.reason?.message || 'Failed to load video.'
  }
  videoLoading.value = false
})
</script>

<style scoped>
.detail-header {
  background: linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-darkest) 100%);
  padding: 2.5rem 1.5rem 2rem;
  color: var(--color-white);
}

.detail-header-inner {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.back-link {
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
  align-self: flex-start;
}

.back-link:hover {
  color: var(--color-white);
}

.detail-header h1 {
  font-size: 2rem;
  margin: 0;
}

.move-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.move-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2em 0.7em;
  border-radius: 99px;
}

.move-badge.difficulty.easy   { background-color: #d4f4e6; color: #1a6b3c; }
.move-badge.difficulty.medium { background-color: #fff2cc; color: #7a5800; }
.move-badge.difficulty.hard   { background-color: #fde0e0; color: #8b1a1a; }
.move-badge.difficulty.expert { background-color: #f3d0f5; color: #5c1a6b; }
.move-badge.category          { background-color: #e8f4fb; color: var(--color-mid-blue); }

.detail-body {
  padding: 2.5rem 1.5rem;
}

.detail-inner {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.video-section {
  width: 100%;
}

.move-video {
  width: 100%;
  border-radius: 10px;
  background: #000;
  display: block;
  max-height: 500px;
}

.move-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.move-description {
  color: #444;
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
}

.move-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  background-color: #e8f4fb;
  color: var(--color-mid-blue);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.2em 0.65em;
  border-radius: 4px;
}

.loading-text {
  text-align: center;
  color: #555;
  font-size: 1.05rem;
  padding: 3rem 0;
}

.fetch-error {
  background-color: #fff0f0;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 0.8em 1em;
  color: #721c24;
  font-size: 0.95rem;
  text-align: center;
}
</style>
