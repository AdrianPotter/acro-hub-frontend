<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo" aria-hidden="true">
        <img src="../assets/main_logo.png" alt="Acro Hub Logo" />
      </div>
      <h1>Welcome Back</h1>
      <p class="auth-subtitle">Login to your Acro Hub account</p>

      <form class="auth-form" @submit.prevent="handleLogin" novalidate>
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
            :class="{ error: errors.email }"
          />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Your password"
            autocomplete="current-password"
            required
            :class="{ error: errors.password }"
          />
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <div v-if="formError" class="form-alert" role="alert">{{ formError }}</div>

        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading">Logging in…</span>
          <span v-else>Login</span>
        </button>
      </form>

      <p class="auth-footer-text">
        Don't have an account?
        <RouterLink to="/register">Register here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const email = ref('')
const password = ref('')
const loading = ref(false)
const formError = ref('')
const errors = reactive({ email: '', password: '' })

function validate() {
  errors.email = ''
  errors.password = ''
  let valid = true
  if (!email.value) {
    errors.email = 'Email is required.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Please enter a valid email address.'
    valid = false
  }
  if (!password.value) {
    errors.password = 'Password is required.'
    valid = false
  }
  return valid
}

async function handleLogin() {
  formError.value = ''
  if (!validate()) return
  loading.value = true
  // Simulate API call
  await new Promise(r => setTimeout(r, 800))
  loading.value = false
  formError.value = 'Login functionality coming soon.'
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 128px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(160deg, #f0f8fd 0%, var(--color-white) 60%);
}

.auth-card {
  background: var(--color-white);
  border: 1.5px solid #d0eaf5;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 4px 24px rgba(0, 55, 90, 0.1);
  text-align: center;
}

.auth-logo {
  margin: 0 auto 1rem;
  width: 48px;
  height: 48px;
}

.auth-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

h1 {
  color: var(--color-dark-blue);
  font-size: 1.75rem;
  margin: 0 0 0.25rem;
}

.auth-subtitle {
  color: #555;
  margin: 0 0 1.75rem;
}

.auth-form {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
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

input.error {
  border-color: #d9534f;
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

.btn-submit {
  width: 100%;
  background-color: var(--color-light-blue);
  color: var(--color-darkest);
  font-weight: 700;
  font-size: 1rem;
  padding: 0.75em;
  border-radius: 6px;
  margin-top: 0.4rem;
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

.auth-footer-text {
  margin-top: 1.25rem;
  font-size: 0.9rem;
  color: #555;
}
</style>
