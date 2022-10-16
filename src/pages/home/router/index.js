import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: '/',
    redirect:  '/home'
  },
  {
    path: '/home',
    component: () => import('../views/home/index.vue')
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
});
