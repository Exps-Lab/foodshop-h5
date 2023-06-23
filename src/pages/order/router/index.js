import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/order/orderConfirm',
    name: 'orderConfirm',
    component: () => import('../views/order_confirm/index.vue')
  },
  {
    path: '/order/payPlatform',
    name: 'payPlatform',
    component: () => import('../views/order_pay_platform/index.vue')
  },
  {
    path: '/order/orderDetail',
    name: 'orderDetail',
    component: () => import('../views/order_detail/index.vue')
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
