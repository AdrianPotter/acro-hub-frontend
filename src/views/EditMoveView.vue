<template>
  <div class="edit-page">
    <section class="edit-header">
      <div class="edit-header-inner">
        <h1>Edit Move</h1>
        <p class="edit-subtitle">Update the details for this move.</p>
      </div>
    </section>

    <section class="edit-body">
      <div class="edit-card">
        <p v-if="loadError" class="form-alert" role="alert">{{ loadError }}</p>

        <form v-else class="edit-form" @submit.prevent="handleUpdate" novalidate>
          <div class="form-group">
            <label for="name">Move name <span class="required" aria-hidden="true">*</span></label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="e.g. Star"
              required
              :class="{ error: errors.name }"
              :disabled="loading || deleteLoading"
            />
            <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              placeholder="Describe the move, technique, or tips…"
              rows="4"
              :disabled="loading || deleteLoading"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="difficulty">Difficulty</label>
            <select id="difficulty" v-model="form.difficulty" :disabled="loading || deleteLoading">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div class="form-group">
            <label for="tags">Tags <span class="hint">(comma-separated)</span></label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              placeholder="e.g. static, beginner, balance"
              :disabled="loading || deleteLoading"
            />
          </div>

          <div v-if="formError" class="form-alert" role="alert">{{ formError }}</div>
          <div v-if="deleteError" class="form-alert" role="alert">{{ deleteError }}</div>

          <div class="form-actions">
            <RouterLink :to="`/moves/${moveId}`" class="btn-secondary">Cancel</RouterLink>
            <button
              type="button"
              class="btn-delete"
              :disabled="loading || deleteLoading"
              @click="handleDelete"
            >
              <span v-if="deleteLoading">Deleting…</span>
              <span v-else>Delete Move</span>
            </button>
            <button type="submit" class="btn-submit" :disabled="loading || deleteLoading">
              <span v-if="loading">Saving…</span>
              <span v-else>Update Move</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { movesApi } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const moveId = route.params.moveId

const form = reactive({
  name: '',
  description: '',
  difficulty: 'easy',
})
const tagsInput = ref('')

const loading = ref(false)
const deleteLoading = ref(false)
const loadError = ref('')
const formError = ref('')
const deleteError = ref('')
const errors = reactive({ name: '' })

onMounted(async () => {
  try {
    const move = await movesApi.get(moveId)
    form.name = move.name ?? ''
    form.description = move.description ?? ''
    form.difficulty = move.difficulty ?? 'easy'
    tagsInput.value = Array.isArray(move.tags) ? move.tags.join(', ') : ''
  } catch (err) {
    loadError.value = err.message || 'Failed to load move details.'
  }
})

function validate() {
  errors.name = ''
  if (!form.name.trim()) {
    errors.name = 'Move name is required.'
    return false
  }
  return true
}

async function handleUpdate() {
  formError.value = ''
  if (!validate()) return

  const tags = tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)

  const payload = {
    name: form.name.trim(),
    difficulty: form.difficulty,
  }
  if (form.description.trim()) payload.description = form.description.trim()
  if (tags.length > 0) payload.tags = tags

  loading.value = true
  try {
    await movesApi.update(moveId, payload)
    router.push({ name: 'move-detail', params: { moveId } })
  } catch (err) {
    formError.value = err.message || 'Failed to update move. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  deleteError.value = ''
  if (!confirm('Are you sure you want to delete this move? This action cannot be undone.')) return

  deleteLoading.value = true
  try {
    await movesApi.delete(moveId)
    router.push('/moves')
  } catch (err) {
    deleteError.value = err.message || 'Failed to delete move. Please try again.'
  } finally {
    deleteLoading.value = false
  }
}
</script>

<style scoped>
.edit-header {
  background: linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-darkest) 100%);
  padding: 3.5rem 1.5rem 2.5rem;
  color: var(--color-white);
  text-align: center;
}

.edit-header-inner {
  max-width: 700px;
  margin: 0 auto;
}

.edit-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.75rem;
}

.edit-subtitle {
  color: rgba(255,255,255,0.82);
  margin: 0;
  font-size: 1.05rem;
}

.edit-body {
  padding: 2.5rem 1.5rem;
  background: linear-gradient(160deg, #f0f8fd 0%, var(--color-white) 60%);
  min-height: calc(100vh - 300px);
}

.edit-card {
  background: var(--color-white);
  border: 1.5px solid #d0eaf5;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 24px rgba(0, 55, 90, 0.1);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-dark-blue);
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.65em 0.85em;
  border: 1.5px solid #b0d4e8;
  border-radius: 6px;
  font-size: 1rem;
  color: var(--color-darkest);
  background: var(--color-white);
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-light-blue);
}

.form-group input.error {
  border-color: #d9534f;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.hint {
  font-weight: 400;
  color: #777;
  font-size: 0.82rem;
}

.required {
  color: #d9534f;
}

.field-error {
  font-size: 0.82rem;
  color: #d9534f;
}

.form-alert {
  background-color: #fff0f0;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 0.6em 0.9em;
  color: #721c24;
  font-size: 0.9rem;
}

.form-success {
  background-color: #eafaf1;
  border: 1px solid #a8d5b8;
  border-radius: 6px;
  padding: 0.6em 0.9em;
  color: #1a6b3c;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.form-success a {
  color: var(--color-mid-blue);
  font-weight: 600;
  text-decoration: none;
}

.form-success a:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.btn-secondary {
  padding: 0.65em 1.25em;
  border: 2px solid var(--color-mid-blue);
  border-radius: 6px;
  color: var(--color-mid-blue);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.btn-secondary:hover {
  background-color: var(--color-mid-blue);
  color: var(--color-white);
}

.btn-delete {
  background-color: #780000;
  color: var(--color-white);
  font-weight: 700;
  font-size: 1rem;
  padding: 0.65em 1.5em;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.btn-delete:hover:not(:disabled) {
  background-color: #5a0000;
}

.btn-delete:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-submit {
  background-color: var(--color-light-blue);
  color: var(--color-darkest);
  font-weight: 700;
  font-size: 1rem;
  padding: 0.65em 1.5em;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--color-mid-blue);
  color: var(--color-white);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 500px) {
  .edit-card {
    padding: 1.75rem 1.25rem;
  }

  .edit-header h1 {
    font-size: 2rem;
  }

  .form-actions {
    justify-content: stretch;
    flex-direction: column-reverse;
  }

  .form-actions .btn-secondary,
  .form-actions .btn-delete,
  .form-actions .btn-submit {
    width: 100%;
    text-align: center;
  }
}
</style>
