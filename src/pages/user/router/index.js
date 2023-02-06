import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/src/pages/ucenter/index.html',
    redirect: '/ucenter'
  },
  {
    path: '/',
    redirect: '/ucenter'
  },
  {
    path: '/ucenter',
    name: 'ucenter',
    component: () => import('../views/ucenter/index.vue')
  },
  {
    path: '/ucenter/test',
    name: 'test',
    component: () => import('../views/test/index.vue')
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('../../404.vue')
  }
]

export default createRouter({
  history: import.meta.env.DEV ? createWebHashHistory() : createWebHistory(),
  routes
})
