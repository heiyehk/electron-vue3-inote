import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import outputErrorLog from '@/utils/errorLog';

const app = createApp(App);

app.config.errorHandler = outputErrorLog;

app.use(router).mount('#app');
