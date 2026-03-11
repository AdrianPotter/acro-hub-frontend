<template>
  <div class="upload-page">
    <section class="upload-header">
      <div class="upload-header-inner">
        <h1>Upload a Move</h1>
        <p class="upload-subtitle">Share a new partner acrobatics move with the community.</p>
      </div>
    </section>

    <section class="upload-body">
      <div class="upload-card">
        <form class="upload-form" @submit.prevent="handleSubmit" novalidate>
          <div class="form-group">
            <label for="name">Move name <span class="required" aria-hidden="true">*</span></label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="e.g. Star"
              required
              :class="{ error: errors.name }"
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
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="difficulty">Difficulty</label>
              <select id="difficulty" v-model="form.difficulty">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" v-model="form.category">
                <option value="acrobalance">Acrobalance</option>
                <option value="hand-to-hand">Hand-to-hand</option>
                <option value="icarian">Icarian</option>
                <option value="washing-machine">Washing machine</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="tags">Tags <span class="hint">(comma-separated)</span></label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              placeholder="e.g. static, beginner, balance"
            />
          </div>

          <div v-if="formError" class="form-alert" role="alert">{{ formError }}</div>

          <div v-if="successMessage" class="form-success" role="status">
            {{ successMessage }}
            <RouterLink to="/moves">View all moves →</RouterLink>
          </div>

          <div class="form-actions">
            <RouterLink to="/moves" class="btn-secondary">Cancel</RouterLink>
            <button type="submit" class="btn-submit" :disabled="loading">
              <span v-if="loading">Uploading…</span>
              <span v-else>Upload Move</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { movesApi } from '../services/api.js'

const form = reactive({
  name: '',
  description: '',
  difficulty: 'easy',
  category: 'acrobalance',
})
const tagsInput = ref('')
const loading = ref(false)
const formError = ref('')
const successMessage = ref('')
const errors = reactive({ name: '' })

function validate() {
  errors.name = ''
  if (!form.name.trim()) {
    errors.name = 'Move name is required.'
    return false
  }
  return true
}

async function handleSubmit() {
  formError.value = ''
  successMessage.value = ''
  if (!validate()) return

  const tags = tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)

  const payload = {
    name: form.name.trim(),
    difficulty: form.difficulty,
    category: form.category,
  }
  if (form.description.trim()) payload.description = form.description.trim()
  if (tags.length > 0) payload.tags = tags

  loading.value = true
  try {
    await movesApi.create(payload)
    successMessage.value = 'Move uploaded successfully!'
    form.name = ''
    form.description = ''
    form.difficulty = 'easy'
    form.category = 'acrobalance'
    tagsInput.value = ''
  } catch (err) {
    formError.value = err.message || 'Failed to upload move. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.upload-header {
  background: linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-darkest) 100%);
  padding: 3.5rem 1.5rem 2.5rem;
  color: var(--color-white);
  text-align: center;
}

.upload-header-inner {
  max-width: 700px;
  margin: 0 auto;
}

.upload-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.75rem;
}

.upload-subtitle {
  color: rgba(255,255,255,0.82);
  margin: 0;
  font-size: 1.05rem;
}

.upload-body {
  padding: 2.5rem 1.5rem;
  background: linear-gradient(160deg, #f0f8fd 0%, var(--color-white) 60%);
  min-height: calc(100vh - 300px);
}

.upload-card {
  background: var(--color-white);
  border: 1.5px solid #d0eaf5;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 24px rgba(0, 55, 90, 0.1);
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
  .form-row {
    grid-template-columns: 1fr;
  }

  .upload-card {
    padding: 1.75rem 1.25rem;
  }

  .upload-header h1 {
    font-size: 2rem;
  }
}
</style>
