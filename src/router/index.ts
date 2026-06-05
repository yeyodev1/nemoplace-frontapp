import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Welcome' }, // Not requiring auth anymore
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/AdsDashboard/index.vue'),
    meta: { title: 'Dashboard', requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Login' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, _from, next) => {
  const hasToken = !!localStorage.getItem('token')
  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)

  if (requiresAuth && !hasToken) {
    return next({ path: '/login', replace: true })
  }

  // If user has token and goes to login or landing page, take them to dashboard
  if ((to.path === '/login' || to.path === '/') && hasToken) {
    return next({ path: '/dashboard', replace: true })
  }

  next()
})

export default router
