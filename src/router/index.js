import { createRouter, createWebHistory } from 'vue-router'
import { useTitle } from '@vueuse/core'
import routes from './routes/index'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  useTitle(to.meta?.title || 'Devops')

  next()
})

export default router
