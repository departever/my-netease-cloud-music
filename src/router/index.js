import { createRouter, createWebHistory } from 'vue-router';

// 内容需要居中的页面
const Discovery = () => import('@/views/discovery/index.vue');

const routes = [
  {
    path: '/',
    redirect: '/discovery'
  },
  {
    path: '/discovery',
    component: Discovery,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

