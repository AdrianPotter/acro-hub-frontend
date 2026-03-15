<template>
  <div class="moves-page">
    <section class="moves-header">
      <div class="moves-header-inner">
        <h1>Move Library</h1>
        <p class="moves-subtitle">
          Browse our collection of partner acrobatics moves. Use the search box to filter by name.
        </p>
        <div class="moves-header-actions">
          <div class="search-wrapper">
            <label for="search" class="sr-only">Search moves</label>
            <svg class="search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.8"/>
              <line x1="12.5" y1="12.5" x2="17" y2="17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Search moves…"
              autocomplete="off"
              class="search-input"
            />
            <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="Clear search">✕</button>
          </div>
          <RouterLink to="/moves/upload" class="btn-upload">+ Upload Move</RouterLink>
        </div>
      </div>
    </section>

    <section class="moves-body">
      <div class="moves-inner">
        <p v-if="loading" class="loading-text" aria-live="polite">Loading moves…</p>
        <div v-else-if="fetchError" class="fetch-error" role="alert">{{ fetchError }}</div>
        <template v-else>
          <p v-if="filteredMoves.length === 0" class="no-results">
            No moves found matching "<strong>{{ searchQuery }}</strong>".
          </p>
          <ul v-else class="moves-grid" role="list">
            <li v-for="move in filteredMoves" :key="move.moveId">
              <RouterLink :to="`/moves/${move.moveId}`" class="move-card">
                <div class="move-badges">
                  <div class="move-badge difficulty" :class="move.difficulty">{{ move.difficulty }}</div>
                </div>
                <h2 class="move-name">{{ move.name }}</h2>
                <p class="move-desc">{{ move.description }}</p>
                <div class="move-tags">
                  <span v-for="tag in move.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </RouterLink>
            </li>
          </ul>
          <p class="results-count" v-if="filteredMoves.length > 0">
            Showing {{ filteredMoves.length }} of {{ moves.length }} moves
          </p>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { movesApi } from '../services/api.js'

const searchQuery = ref('')
const moves = ref([])
const loading = ref(true)
const fetchError = ref('')

onMounted(async () => {
  try {
    const data = await movesApi.list()
    moves.value = data.moves ?? data
  } catch (err) {
    fetchError.value = err.message || 'Failed to load moves. Please try again.'
  } finally {
    loading.value = false
  }
})

const filteredMoves = computed(() => {
  if (!searchQuery.value.trim()) return moves.value
  const q = searchQuery.value.toLowerCase().trim()
  return moves.value.filter(m => m.name.toLowerCase().includes(q))
})
</script>

<style scoped>
.moves-header {
  background: linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-darkest) 100%);
  padding: 3.5rem 1.5rem 2.5rem;
  color: var(--color-white);
  text-align: center;
}

.moves-header-inner {
  max-width: 700px;
  margin: 0 auto;
}

.moves-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.75rem;
}

.moves-subtitle {
  color: rgba(255,255,255,0.82);
  margin: 0 0 1.75rem;
  font-size: 1.05rem;
}

.moves-header-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-upload {
  display: inline-block;
  background-color: var(--color-light-blue);
  color: var(--color-darkest);
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.6em 1.2em;
  border-radius: 6px;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.2s, color 0.2s;
}

.btn-upload:hover {
  background-color: var(--color-white);
  color: var(--color-dark-blue);
}

.search-wrapper {
  position: relative;
  max-width: 480px;
  flex: 1 1 300px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--color-mid-blue);
}

.search-input {
  width: 100%;
  padding: 0.7em 2.5em 0.7em 2.4em;
  border-radius: 8px;
  border: 1.5px solid var(--color-mid-blue);
  font-size: 1rem;
  background: var(--color-white);
  color: var(--color-darkest);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-light-blue);
}

.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  font-size: 0.85rem;
  padding: 4px;
  cursor: pointer;
  line-height: 1;
}

.search-clear:hover {
  color: var(--color-darkest);
}

/* SR-only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

.moves-body {
  padding: 2.5rem 1.5rem;
}

.moves-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.no-results {
  text-align: center;
  color: #555;
  font-size: 1.05rem;
  padding: 3rem 0;
}

.moves-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem;
}

.move-card {
  background: var(--color-white);
  border: 1.5px solid #d0eaf5;
  border-radius: 10px;
  padding: 1.4rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: box-shadow 0.2s, border-color 0.2s;
  text-decoration: none;
  color: inherit;
}

.move-card:hover {
  box-shadow: 0 4px 16px rgba(0,90,140,0.12);
  border-color: var(--color-mid-blue);
}

.move-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
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

.move-badge.difficulty.easy {
  background-color: #d4f4e6;
  color: #1a6b3c;
}

.move-badge.difficulty.medium {
  background-color: #fff2cc;
  color: #7a5800;
}

.move-badge.difficulty.hard {
  background-color: #fde0e0;
  color: #8b1a1a;
}

.move-badge.difficulty.expert {
  background-color: #f3d0f5;
  color: #5c1a6b;
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
  margin: 2rem auto;
  max-width: 600px;
  text-align: center;
}

.move-name {
  font-size: 1.15rem;
  color: var(--color-dark-blue);
  margin: 0;
}

.move-desc {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.move-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  background-color: #e8f4fb;
  color: var(--color-mid-blue);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2em 0.6em;
  border-radius: 4px;
}

.results-count {
  text-align: right;
  color: #777;
  font-size: 0.85rem;
  margin: 0;
}
</style>
