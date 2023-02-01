import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/src/pages/home/index.html',
    redirect: '/home'
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/roiPicker',
    name: 'roiPicker',
    component: () => import('../views/roi_picker/index.vue')
  },
  {
    path: '/chooseCity',
    name: 'chooseCity',
    component: () => import('../views/choose_city/index.vue')
  },
  {
    path: '/shopTopic',
    name: 'shopTopic',
    component: () => import('../views/shop_topic/index.vue')
  },
  {
    path: '/shopDetail',
    name: 'shopDetail',
    component: () => import('../views/shop_detail/index.vue')
  },
  {
    path: '/shopDetail/map',
    name: 'shopDetailMap',
    component: () => import('../views/shop_detail/show_in_map.vue')
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
