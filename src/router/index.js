import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: '/',
    component: () => import('@view/home.vue')
  },
  {
    path: '/test',
    component: () => import('@view/test.vue')
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes
});
