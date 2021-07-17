import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import PrimeVue from 'primevue/config';
import { projectAuth } from './firebase/config';
//global style
import './assets/main.css';

let app;

projectAuth.onAuthStateChanged(async (user) => {
  if (user) {
    await store.dispatch('updateUserProfile', user.uid);
  }
  if (!app) {
    app = createApp(App)
      .use(store)
      .use(router)
      .use(PrimeVue)
      .mount('#app');
  }
});
