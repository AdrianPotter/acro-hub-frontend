import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import OurStoryView from '../views/OurStoryView.vue'
import TermsView from '../views/TermsView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ConfirmRegistrationView from '../views/ConfirmRegistrationView.vue'
import MovesView from '../views/MovesView.vue'
import UploadMoveView from '../views/UploadMoveView.vue'
import MoveDetailView from '../views/MoveDetailView.vue'
import EditMoveView from '../views/EditMoveView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import { useAuth } from '../composables/useAuth.js'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/our-story', name: 'our-story', component: OurStoryView },
  { path: '/terms', name: 'terms', component: TermsView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/confirm-registration', name: 'confirm-registration', component: ConfirmRegistrationView },
  { path: '/moves', name: 'moves', component: MovesView, meta: { requiresAuth: true } },
  { path: '/moves/upload', name: 'upload-move', component: UploadMoveView, meta: { requiresAuth: true, requiresCanUpload: true } },
  { path: '/moves/:moveId/edit', name: 'edit-move', component: EditMoveView, meta: { requiresAuth: true, requiresCanEdit: true } },
  { path: '/moves/:moveId', name: 'move-detail', component: MoveDetailView, meta: { requiresAuth: true } },
  { path: '/admin/users', name: 'admin-users', component: UserManagementView, meta: { requiresAuth: true, requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const { isLoggedIn, canUpload, canEdit, isAdmin } = useAuth()
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresCanUpload && !canUpload.value) {
    return { name: 'moves' }
  }
  if (to.meta.requiresCanEdit && !canEdit.value) {
    return { name: 'moves' }
  }
  if (to.meta.requiresAdmin && !isAdmin.value) {
    return { name: 'home' }
  }
})

export default router
