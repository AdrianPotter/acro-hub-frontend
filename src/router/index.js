import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ConfirmRegistrationView from '../views/ConfirmRegistrationView.vue'
import MovesView from '../views/MovesView.vue'
import UploadMoveView from '../views/UploadMoveView.vue'
import MoveDetailView from '../views/MoveDetailView.vue'
import { useAuth } from '../composables/useAuth.js'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/confirm-registration', name: 'confirm-registration', component: ConfirmRegistrationView },
  { path: '/moves', name: 'moves', component: MovesView, meta: { requiresAuth: true } },
  { path: '/moves/upload', name: 'upload-move', component: UploadMoveView, meta: { requiresAuth: true } },
  { path: '/moves/:moveId', name: 'move-detail', component: MoveDetailView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const { isLoggedIn } = useAuth()
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
