import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Auth/Login.vue';
// route guard
import { projectAuth } from '../firebase/config';

const requireAuth = (to, from, next) => {
  projectAuth.onAuthStateChanged((user) => {
    if (!user) {
      console.log('אין יוזר');
      next({ name: 'Login' });
    } else {
      next();
    }
  });
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: requireAuth,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
