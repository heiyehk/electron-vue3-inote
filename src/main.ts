import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import outputErrorLog from '@/utils/errorLog';

const app = createApp(App);

app.config.errorHandler = outputErrorLog;

app
  .use(store)
  .use(router)
  .mount('#app');
