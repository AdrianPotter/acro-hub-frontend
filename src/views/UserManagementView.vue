<template>
  <div class="users-page">
    <section class="users-header">
      <div class="users-header-inner">
        <h1>User Management</h1>
        <p class="users-subtitle">Manage accounts, group memberships, and access.</p>
      </div>
    </section>

    <section class="users-body">
      <div class="users-inner">
        <p v-if="loading" class="loading-text" aria-live="polite">Loading users…</p>
        <div v-else-if="fetchError" class="fetch-error" role="alert">{{ fetchError }}</div>

        <template v-else>
          <p v-if="users.length === 0" class="no-results">No users found.</p>

          <div v-else class="table-wrapper" role="region" aria-label="User list">
            <table class="users-table">
              <thead>
                <tr>
                  <th scope="col">Email / Username</th>
                  <th scope="col">Status</th>
                  <th scope="col">Groups</th>
                  <th scope="col">Created</th>
                  <th scope="col" class="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.sub || user.username" :class="{ disabled: !user.enabled }">
                  <td class="cell-email">
                    <span class="email-text">{{ user.email || user.username }}</span>
                    <span v-if="user.name" class="name-text">{{ user.name }}</span>
                  </td>
                  <td class="cell-status">
                    <span class="badge" :class="statusBadgeClass(user)">
                      {{ user.enabled ? (user.status || 'Active') : 'Disabled' }}
                    </span>
                  </td>
                  <td class="cell-groups">
                    <span v-if="user.groups && user.groups.length > 0" class="groups-list">
                      <span v-for="group in user.groups" :key="group" class="group-chip" :class="group">{{ group }}</span>
                    </span>
                    <span v-else class="no-groups">—</span>
                  </td>
                  <td class="cell-created">{{ formatDate(user.createdAt) }}</td>
                  <td class="cell-actions">
                    <div class="action-row">
                      <button
                        class="btn-action btn-groups"
                        :disabled="actionLoading[user.username]"
                        @click="openGroupsModal(user)"
                        :aria-label="`Edit groups for ${user.email || user.username}`"
                      >
                        Groups
                      </button>
                      <button
                        class="btn-action"
                        :class="user.enabled ? 'btn-disable' : 'btn-enable'"
                        :disabled="actionLoading[user.username]"
                        @click="toggleEnabled(user)"
                        :aria-label="user.enabled ? `Disable ${user.email || user.username}` : `Enable ${user.email || user.username}`"
                      >
                        {{ user.enabled ? 'Disable' : 'Enable' }}
                      </button>
                      <button
                        class="btn-action btn-delete"
                        :disabled="actionLoading[user.username]"
                        @click="openDeleteModal(user)"
                        :aria-label="`Delete ${user.email || user.username}`"
                      >
                        Delete
                      </button>
                    </div>
                    <p v-if="actionErrors[user.username]" class="row-error" role="alert">{{ actionErrors[user.username] }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="results-count" v-if="users.length > 0">
            {{ users.length }} user{{ users.length === 1 ? '' : 's' }}
          </p>
        </template>
      </div>
    </section>

    <!-- Edit Groups Modal -->
    <div v-if="groupsModal.open" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="groups-modal-title" @click.self="closeGroupsModal">
      <div class="modal-card">
        <h2 id="groups-modal-title" class="modal-title">Edit Groups</h2>
        <p class="modal-subtitle">{{ groupsModal.user?.email || groupsModal.user?.username }}</p>

        <fieldset class="groups-fieldset">
          <legend class="sr-only">Select groups</legend>
          <label v-for="group in ALL_GROUPS" :key="group" class="group-checkbox-label">
            <input
              type="checkbox"
              :value="group"
              v-model="groupsModal.selected"
              class="group-checkbox"
            />
            {{ group }}
          </label>
        </fieldset>

        <p v-if="groupsModal.error" class="modal-error" role="alert">{{ groupsModal.error }}</p>

        <div class="modal-actions">
          <button class="btn-secondary" :disabled="groupsModal.saving" @click="closeGroupsModal">Cancel</button>
          <button class="btn-submit" :disabled="groupsModal.saving" @click="saveGroups">
            <span v-if="groupsModal.saving">Saving…</span>
            <span v-else>Save</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModal.open" class="modal-overlay" role="alertdialog" aria-modal="true" aria-labelledby="delete-modal-title" aria-describedby="delete-modal-desc" @click.self="closeDeleteModal">
      <div class="modal-card">
        <h2 id="delete-modal-title" class="modal-title modal-title-danger">Delete User</h2>
        <p id="delete-modal-desc" class="modal-subtitle">
          Permanently delete <strong>{{ deleteModal.user?.email || deleteModal.user?.username }}</strong>?
          This action cannot be undone.
        </p>

        <p v-if="deleteModal.error" class="modal-error" role="alert">{{ deleteModal.error }}</p>

        <div class="modal-actions">
          <button class="btn-secondary" :disabled="deleteModal.deleting" @click="closeDeleteModal">Cancel</button>
          <button class="btn-action btn-delete btn-delete-modal" :disabled="deleteModal.deleting" @click="executeDelete">
            <span v-if="deleteModal.deleting">Deleting…</span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { usersApi } from '../services/api.js'

const ALL_GROUPS = ['admins', 'curators', 'contributors']

const users = ref([])
const loading = ref(true)
const fetchError = ref('')

// Per-row loading/error state keyed by username
const actionLoading = reactive({})
const actionErrors = reactive({})

const groupsModal = reactive({
  open: false,
  user: null,
  selected: [],
  saving: false,
  error: '',
})

const deleteModal = reactive({
  open: false,
  user: null,
  deleting: false,
  error: '',
})

onMounted(async () => {
  try {
    const data = await usersApi.list()
    users.value = data.users ?? data
  } catch (err) {
    fetchError.value = err.message || 'Failed to load users. Please try again.'
  } finally {
    loading.value = false
  }
})

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function statusBadgeClass(user) {
  if (!user.enabled) return 'badge-disabled'
  if (user.status === 'CONFIRMED') return 'badge-active'
  if (user.status === 'UNCONFIRMED') return 'badge-unconfirmed'
  return 'badge-other'
}

async function toggleEnabled(user) {
  actionErrors[user.username] = ''
  actionLoading[user.username] = true
  try {
    if (user.enabled) {
      await usersApi.disable(user.username)
      user.enabled = false
    } else {
      await usersApi.enable(user.username)
      user.enabled = true
    }
  } catch (err) {
    actionErrors[user.username] = err.message || 'Action failed. Please try again.'
  } finally {
    actionLoading[user.username] = false
  }
}

function openDeleteModal(user) {
  deleteModal.user = user
  deleteModal.error = ''
  deleteModal.deleting = false
  deleteModal.open = true
}

function closeDeleteModal() {
  deleteModal.open = false
  deleteModal.user = null
}

async function executeDelete() {
  const user = deleteModal.user
  deleteModal.error = ''
  deleteModal.deleting = true
  try {
    await usersApi.delete(user.username)
    users.value = users.value.filter(x => x.username !== user.username)
    closeDeleteModal()
  } catch (err) {
    deleteModal.error = err.message || 'Delete failed. Please try again.'
    deleteModal.deleting = false
  }
}

function openGroupsModal(user) {
  groupsModal.user = user
  groupsModal.selected = Array.isArray(user.groups) ? [...user.groups] : []
  groupsModal.error = ''
  groupsModal.saving = false
  groupsModal.open = true
}

function closeGroupsModal() {
  groupsModal.open = false
  groupsModal.user = null
}

async function saveGroups() {
  groupsModal.error = ''
  groupsModal.saving = true
  try {
    await usersApi.updateGroups(groupsModal.user.username, groupsModal.selected)
    groupsModal.user.groups = [...groupsModal.selected]
    closeGroupsModal()
  } catch (err) {
    groupsModal.error = err.message || 'Failed to update groups. Please try again.'
  } finally {
    groupsModal.saving = false
  }
}
</script>

<style scoped>
.users-header {
  background: linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-darkest) 100%);
  padding: 3.5rem 1.5rem 2.5rem;
  color: var(--color-white);
  text-align: center;
}

.users-header-inner {
  max-width: 900px;
  margin: 0 auto;
}

.users-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.75rem;
}

.users-subtitle {
  color: rgba(255,255,255,0.82);
  margin: 0;
  font-size: 1.05rem;
}

.users-body {
  padding: 2.5rem 1.5rem;
  background: linear-gradient(160deg, #f0f8fd 0%, var(--color-white) 60%);
  min-height: calc(100vh - 260px);
}

.users-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.loading-text,
.no-results {
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
  max-width: 700px;
  text-align: center;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1.5px solid #d0eaf5;
  box-shadow: 0 4px 24px rgba(0,55,90,0.08);
  background: var(--color-white);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.93rem;
}

.users-table th {
  background: var(--color-dark-blue);
  color: var(--color-white);
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.75em 1em;
  text-align: left;
  white-space: nowrap;
}

.users-table td {
  padding: 0.8em 1em;
  border-bottom: 1px solid #e8f4fb;
  vertical-align: middle;
  color: var(--color-darkest);
}

.users-table tbody tr:last-child td {
  border-bottom: none;
}

.users-table tbody tr:hover {
  background-color: #f5fafd;
}

.users-table tbody tr.disabled {
  opacity: 0.65;
}

.col-actions {
  text-align: right;
}

.cell-email {
  min-width: 180px;
}

.email-text {
  display: block;
  font-weight: 600;
  color: var(--color-dark-blue);
}

.name-text {
  display: block;
  font-size: 0.82rem;
  color: #666;
  margin-top: 0.1rem;
}

.cell-status {
  white-space: nowrap;
}

.badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2em 0.7em;
  border-radius: 99px;
}

.badge-active {
  background-color: #d4f4e6;
  color: #1a6b3c;
}

.badge-disabled {
  background-color: #f5c6cb;
  color: #721c24;
}

.badge-unconfirmed {
  background-color: #fff2cc;
  color: #7a5800;
}

.badge-other {
  background-color: #e8f4fb;
  color: var(--color-mid-blue);
}

.groups-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.group-chip {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2em 0.6em;
  border-radius: 4px;
  background-color: #e8f4fb;
  color: var(--color-mid-blue);
}

.group-chip.admins {
  background-color: #f3d0f5;
  color: #5c1a6b;
}

.group-chip.curators {
  background-color: #fff2cc;
  color: #7a5800;
}

.group-chip.contributors {
  background-color: #d4f4e6;
  color: #1a6b3c;
}

.no-groups {
  color: #aaa;
}

.cell-created {
  white-space: nowrap;
  color: #555;
  font-size: 0.88rem;
}

.cell-actions {
  text-align: right;
  min-width: 200px;
}

.action-row {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-action {
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.35em 0.85em;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, opacity 0.2s;
  white-space: nowrap;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-groups {
  background: none;
  border: 2px solid var(--color-mid-blue);
  color: var(--color-mid-blue);
}

.btn-groups:hover:not(:disabled) {
  background-color: var(--color-mid-blue);
  color: var(--color-white);
}

.btn-disable {
  background: none;
  border: 2px solid #e08b00;
  color: #e08b00;
}

.btn-disable:hover:not(:disabled) {
  background-color: #e08b00;
  color: var(--color-white);
}

.btn-enable {
  background: none;
  border: 2px solid #1a6b3c;
  color: #1a6b3c;
}

.btn-enable:hover:not(:disabled) {
  background-color: #1a6b3c;
  color: var(--color-white);
}

.btn-delete {
  background: none;
  border: 2px solid #780000;
  color: #780000;
}

.btn-delete:hover:not(:disabled) {
  background-color: #780000;
  color: var(--color-white);
}

.row-error {
  color: #721c24;
  font-size: 0.8rem;
  margin: 0.35rem 0 0;
  text-align: right;
}

.results-count {
  text-align: right;
  color: #777;
  font-size: 0.85rem;
  margin: 0.75rem 0 0;
}

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 23, 31, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal-card {
  background: var(--color-white);
  border-radius: 12px;
  padding: 2rem 1.75rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 40px rgba(0,55,90,0.2);
}

.modal-title {
  font-size: 1.35rem;
  color: var(--color-dark-blue);
  margin: 0 0 0.2rem;
}

.modal-title-danger {
  color: #780000;
}

.btn-delete-modal {
  padding: 0.6em 1.5em;
  font-size: 0.95rem;
  border-width: 2px;
}

.modal-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1.25rem;
}

.groups-fieldset {
  border: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.group-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-darkest);
  cursor: pointer;
  text-transform: capitalize;
}

.group-checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-light-blue);
  cursor: pointer;
}

.modal-error {
  background-color: #fff0f0;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 0.5em 0.75em;
  color: #721c24;
  font-size: 0.88rem;
  margin: 0 0 0.75rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  padding: 0.6em 1.25em;
  border: 2px solid var(--color-mid-blue);
  border-radius: 6px;
  color: var(--color-mid-blue);
  font-weight: 600;
  font-size: 0.95rem;
  background: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-mid-blue);
  color: var(--color-white);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-submit {
  padding: 0.6em 1.5em;
  background-color: var(--color-light-blue);
  color: var(--color-darkest);
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--color-mid-blue);
  color: var(--color-white);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
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

@media (max-width: 700px) {
  .users-header h1 {
    font-size: 2rem;
  }

  .users-table th,
  .users-table td {
    padding: 0.65em 0.6em;
  }

  .col-actions,
  .cell-actions {
    text-align: left;
  }

  .action-row {
    justify-content: flex-start;
  }
}
</style>
