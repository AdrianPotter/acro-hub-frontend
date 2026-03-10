<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo" aria-hidden="true">
        <img src="../assets/main_logo.png" alt="Acro Hub Logo" />
      </div>
      <h1>Create Account</h1>
      <p class="auth-subtitle">Join Acro Hub today — it's free</p>

      <form class="auth-form" @submit.prevent="handleRegister" novalidate>
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
            placeholder="Choose a password"
            autocomplete="new-password"
            required
            :class="{ error: errors.password }"
          />
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            autocomplete="new-password"
            required
            :class="{ error: errors.confirmPassword }"
          />
          <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input
              id="terms"
              v-model="agreedToTerms"
              type="checkbox"
              :class="{ error: errors.terms }"
            />
            <span>
              I agree to the
              <RouterLink to="/about">Terms &amp; Conditions</RouterLink>
            </span>
          </label>
          <span v-if="errors.terms" class="field-error">{{ errors.terms }}</span>
        </div>

        <div v-if="formError" class="form-alert" role="alert">{{ formError }}</div>
        <div v-if="successMessage" class="form-success" role="status">{{ successMessage }}</div>

        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading">Creating account…</span>
          <span v-else>Register</span>
        </button>
      </form>

      <p class="auth-footer-text">
        Already have an account?
        <RouterLink to="/login">Login here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../services/api.js'

const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreedToTerms = ref(false)
const loading = ref(false)
const formError = ref('')
const successMessage = ref('')
const errors = reactive({ email: '', password: '', confirmPassword: '', terms: '' })

function validate() {
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.terms = ''
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
  } else if (password.value.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
    valid = false
  }

  if (!confirmPassword.value) {
    errors.confirmPassword = 'Please confirm your password.'
    valid = false
  } else if (password.value !== confirmPassword.value) {
    errors.confirmPassword = 'Passwords do not match.'
    valid = false
  }

  if (!agreedToTerms.value) {
    errors.terms = 'You must agree to the Terms & Conditions.'
    valid = false
  }

  return valid
}

async function handleRegister() {
  formError.value = ''
  successMessage.value = ''
  if (!validate()) return
  loading.value = true
  try {
    await auth.register(email.value, password.value)
    successMessage.value = 'Account created! Redirecting to login…'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    formError.value = err.status === 409
      ? 'An account with that email already exists.'
      : err.status === 400
        ? 'Invalid registration details. Please check your input.'
        : err.status === 429
          ? 'Too many attempts. Please wait a moment and try again.'
          : (err.message || 'Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
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

.checkbox-group {
  gap: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-weight: 400 !important;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 2px;
  accent-color: var(--color-mid-blue);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"].error {
  outline: 2px solid #d9534f;
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

.form-success {
  background-color: #f0fff4;
  border: 1px solid #b2dfdb;
  border-radius: 6px;
  padding: 0.6em 0.9em;
  color: #155724;
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
