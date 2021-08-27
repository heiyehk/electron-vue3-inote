import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import outputErrorLog from '@/utils/errorLog';
import { sequelizeInit } from './service/initSequelize';

sequelizeInit();

const apps = createApp(App);
apps.config.errorHandler = outputErrorLog;
apps.use(router).mount('#app');
