import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'home', component: () => import('../views/MainPage.vue') },
  { path: '/tracking', name: 'tracking', component: () => import('../views/Tracking.vue') },
  { path: '/about', name: 'about', component: () => import('../views/AboutPage.vue') },
  { path: '/terms', name: 'terms', component: () => import('../views/UserAgreementPage.vue') },
  { path: '/privacy', name: 'privacy', component: () => import('../views/ConfidentialityPage.vue') },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;