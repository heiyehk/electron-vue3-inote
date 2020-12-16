import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import version from '@/utils/version';
import outputErrorLog from '@/utils/error.log';

const app = createApp(App);

app.version = version;
app.config.errorHandler = outputErrorLog;

app
  .use(store)
  .use(router)
  .mount('#app');
