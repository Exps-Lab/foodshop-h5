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
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
});
