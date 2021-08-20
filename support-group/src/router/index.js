import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Auth/Login.vue';
import SignUp from '../views/Auth/SignUp.vue';
import Settings from '../views/Settings.vue';
import Courses from '../views/Courses.vue';
import ArchivesCourses from '../views/ArchivesCourses.vue';
import store from '../store';
// route guard
import { projectAuth } from '../firebase/config';

// if the user is not connecting
const requireAuth = (to, from, next) => {
  setTimeout(() => {
    let user = projectAuth.currentUser;
    if (!user) {
      next({ name: 'Login' });
    } else {
      next();
    }
  }, 100);
};

const requireAuthAndRoleTeacher = (to, from, next) => {
  setTimeout(() => {
    let user = projectAuth.currentUser;
    let role = store.getters.getUserProfile.role;
    console.log('role:', role);
    if (!user || role != 'teacher') {
      next({ name: 'Home' });
    } else {
      next();
    }
  }, 500);
};

// if the user is connecting
const requireLoggout = (to, from, next) => {
  let user = projectAuth.currentUser;
  if (user) {
    next({ name: 'Home' });
  } else {
    next();
  }
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
    beforeEnter: requireLoggout,
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
    beforeEnter: requireLoggout,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    beforeEnter: requireAuth,
  },
  {
    path: '/courses',
    name: 'Courses',
    component: Courses,
    beforeEnter: requireAuth,
  },
  {
    path: '/archives_courses',
    name: 'ArchivesCourses',
    component: ArchivesCourses,
    beforeEnter: requireAuthAndRoleTeacher,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
