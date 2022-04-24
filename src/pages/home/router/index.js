import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: '/',
    component: () => import('../views/home.vue')
  },
  {
    path: '/test',
    component: () => import('../views/test.vue')
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes
});
