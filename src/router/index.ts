import { createRouter, createWebHistory } from 'vue-router'
import LayoutViews from '@/LayoutViews.vue'
import TableProyects from '@/components/TableProyects.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/', component: LayoutViews, meta: { requiresAuth: true }, children: [
      { path: '', redirect: '/proyecto' },
      { path: 'proyecto', name: 'home-projects', component: TableProyects },
      { path: 'proyecto/:id', redirect: '/proyecto' }
    ]},
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})
router.beforeEach(to => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.autenticado) return { name: 'login' }
  if (to.meta.guestOnly && auth.autenticado) return { name: 'home-projects' }
})
export default router
