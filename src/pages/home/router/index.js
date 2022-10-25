import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: '/',
    redirect:  '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/index.vue'),
  },
  {
    path: '/roiPicker',
    name: 'roiPicker',
    component: () => import('../views/roi-picker/index.vue')
  },
  {
    path: '/chooseCity',
    name: 'chooseCity',
    component: () => import('../views/choose-city/index.vue')
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
});
