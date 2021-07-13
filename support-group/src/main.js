import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import PrimeVue from 'primevue/config';
//global style
import './assets/main.css';

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue)
  .mount('#app');
