<template>
  <div class="moves-page">
    <section class="moves-header">
      <div class="moves-header-inner">
        <h1>Move Library</h1>
        <p class="moves-subtitle">
          Browse our collection of partner acrobatics moves. Use the search box to filter by name.
        </p>
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
      </div>
    </section>

    <section class="moves-body">
      <div class="moves-inner">
        <p v-if="filteredMoves.length === 0" class="no-results">
          No moves found matching "<strong>{{ searchQuery }}</strong>".
        </p>
        <ul v-else class="moves-grid" role="list">
          <li v-for="move in filteredMoves" :key="move.id" class="move-card">
            <div class="move-level" :class="move.level.toLowerCase()">{{ move.level }}</div>
            <h2 class="move-name">{{ move.name }}</h2>
            <p class="move-desc">{{ move.description }}</p>
            <div class="move-tags">
              <span v-for="tag in move.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </li>
        </ul>
        <p class="results-count" v-if="filteredMoves.length > 0">
          Showing {{ filteredMoves.length }} of {{ moves.length }} moves
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const moves = [
  {
    id: 1,
    name: 'Bird',
    level: 'Beginner',
    description: 'Base lies on back with feet in the air supporting the flyer\'s hips. The flyer extends arms out like wings.',
    tags: ['balance', 'static', 'lying'],
  },
  {
    id: 2,
    name: 'Star',
    level: 'Beginner',
    description: 'Flyer balances horizontally on the base\'s feet in a starfish-like pose with arms and legs outstretched.',
    tags: ['balance', 'static', 'lying'],
  },
  {
    id: 3,
    name: 'Throne',
    level: 'Beginner',
    description: 'The flyer sits on the base\'s hands which are positioned at shoulder height, creating a seat-like support.',
    tags: ['balance', 'standing', 'shoulder'],
  },
  {
    id: 4,
    name: 'Plank',
    level: 'Beginner',
    description: 'Flyer holds a straight plank position while base supports with hands under shoulders and feet.',
    tags: ['balance', 'static'],
  },
  {
    id: 5,
    name: 'Shoulder Stand',
    level: 'Intermediate',
    description: 'Flyer stands on the base\'s shoulders with hands for initial support, progressing to unsupported.',
    tags: ['standing', 'vertical', 'shoulder'],
  },
  {
    id: 6,
    name: 'Hand to Hand',
    level: 'Advanced',
    description: 'Flyer performs a handstand balanced on the base\'s upstretched hands. Requires strong overhead pressing.',
    tags: ['handstand', 'vertical', 'advanced'],
  },
  {
    id: 7,
    name: 'Washing Machine',
    level: 'Intermediate',
    description: 'A dynamic transition where the flyer rotates from one position to another while the base maintains support.',
    tags: ['dynamic', 'transition', 'rotation'],
  },
  {
    id: 8,
    name: 'Foot to Hand',
    level: 'Intermediate',
    description: 'The base lifts the flyer using only their feet into the flyer\'s hands, creating a vertical balance point.',
    tags: ['balance', 'vertical', 'foot'],
  },
  {
    id: 9,
    name: 'Reverse Bird',
    level: 'Beginner',
    description: 'A variation of Bird where the flyer faces the opposite direction, resting chest on base\'s feet.',
    tags: ['balance', 'static', 'lying'],
  },
  {
    id: 10,
    name: 'Straddle Bat',
    level: 'Intermediate',
    description: 'Flyer hangs inverted with legs in a straddle position while base supports from below.',
    tags: ['inversion', 'hang', 'straddle'],
  },
  {
    id: 11,
    name: 'Folded Leaf',
    level: 'Beginner',
    description: 'A restorative inversion where the flyer folds over the base\'s feet, arms hanging freely.',
    tags: ['inversion', 'passive', 'lying'],
  },
  {
    id: 12,
    name: 'Temple',
    level: 'Advanced',
    description: 'Multi-person pose with multiple flyers balanced at height on a single or pair of bases.',
    tags: ['group', 'advanced', 'balance'],
  },
  {
    id: 13,
    name: 'Back Bird',
    level: 'Beginner',
    description: 'Like Bird but the flyer bends backwards, creating an elegant arched shape in the air.',
    tags: ['balance', 'backbend', 'lying'],
  },
  {
    id: 14,
    name: 'Side Star',
    level: 'Intermediate',
    description: 'A lateral variation of Star where the flyer is balanced on one side of the base\'s feet.',
    tags: ['balance', 'static', 'lying'],
  },
  {
    id: 15,
    name: 'Flag',
    level: 'Advanced',
    description: 'Flyer holds a horizontal body position supported only at a single hand or foot contact point.',
    tags: ['balance', 'advanced', 'strength'],
  },
]

const filteredMoves = computed(() => {
  if (!searchQuery.value.trim()) return moves
  const q = searchQuery.value.toLowerCase().trim()
  return moves.filter(m => m.name.toLowerCase().includes(q))
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

.search-wrapper {
  position: relative;
  max-width: 480px;
  margin: 0 auto;
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
}

.move-card:hover {
  box-shadow: 0 4px 16px rgba(0,90,140,0.12);
  border-color: var(--color-mid-blue);
}

.move-level {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2em 0.7em;
  border-radius: 99px;
  align-self: flex-start;
}

.move-level.beginner {
  background-color: #d4f4e6;
  color: #1a6b3c;
}

.move-level.intermediate {
  background-color: #fff2cc;
  color: #7a5800;
}

.move-level.advanced {
  background-color: #fde0e0;
  color: #8b1a1a;
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
