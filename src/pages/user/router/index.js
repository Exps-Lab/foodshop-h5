import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
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
    path: '/ucenter/about_us',
    name: 'aboutUs',
    component: () => import('../views/about_us/index.vue')
  },
  {
    path: '/ucenter/user_info',
    name: 'userInfo',
    component: () => import('../views/user_info/index.vue')
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
