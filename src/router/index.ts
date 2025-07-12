import { createRouter, createWebHistory } from 'vue-router'
// Certifique-se de que todos os caminhos estão corretos
import LoginView from '@/shared/views/LoginView.vue'
import DashboardView from '@/modules/admin/views/DashboardView.vue'
import AdminLayout from '@/modules/admin/layouts/AdminLayout.vue'
import NotFoundView from '@/modules/admin/views/NotFoundView.vue'
import UnauthorizedView from '@/modules/admin/views/UnauthorizedView.vue' // Provavelmente não precisa mais desta, mas mantenha se for usar

// Importe o Pinia store
import { useAuthStore } from '@/stores/authStore'
import { watch } from 'vue'

const routes = [
  {
    path: '/',
    name: 'HomeRedirect',
    redirect: () => {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        return { name: 'Dashboard' }
      }
      return { name: 'Login' }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true, onlyWhenLoggedOut: true },
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardView,
      },
      {
        path: 'schools',
        name: 'AdminSchools',
        component: () => import('@/modules/admin/views/SchoolView.vue'),
      },
      {
        path: 'period-lectives',
        name: 'AdminPeriod',
        component: () => import('@/modules/admin/views/PeriodView.vue'),
      },
      {
        path: 'subjects',
        name: 'AdminSubjects',
        component: () => import('@/modules/admin/views/SubjectView.vue'),
      },
    ],
  },
  // Nova Rota para Logout
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: () => {
      const authStore = useAuthStore()
      authStore.logout()
    },
    redirect: { name: 'Login' },
  },
  {
    path: '/unauthorized', // Mantenha esta rota se ainda quiser a página de "Não Autorizado"
    name: 'Unauthorized',
    component: UnauthorizedView,
    meta: { public: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { public: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.isSessionLoading) {
    await new Promise((resolve) => {
      const unwatch = watch(
        () => authStore.isSessionLoading,
        (newValue) => {
          if (!newValue) {
            unwatch() // Para de observar assim que o estado muda
            resolve(true) // Resolve a promessa
          }
        },
        { immediate: true },
      ) // Executa imediatamente se já for false
    })
    return next({ path: to.path, query: to.query, hash: to.hash, replace: true })
  }

  const isLoggedIn = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin

  // 1. Impedir que usuários logados acessem a página de login
  if (to.meta.onlyWhenLoggedOut && isLoggedIn) {
    return next({ name: 'Dashboard' })
  }

  // 2. Proteção de rota para áreas que exigem autenticação
  if (to.meta.requiresAuth && !isLoggedIn) {
    console.log('Redirecionando para login: Requer autenticação.')
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // 3. Proteção de rota para áreas que exigem papel de administrador
  if (to.meta.requiresAdmin && !isAdmin) {
    console.log('Redirecionando para login: Requer privilégios de admin.')
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  next()
})

export default router
