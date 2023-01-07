import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import outputErrorLog from '@/utils/errorLog';
import { sequelizeInit } from './service/initSequelize';

sequelizeInit();

const app = createApp(App);
app.directive('tip', (el, { value }) => {
  const { height } = el.dataset;
  // 储存最初的高度
  if (!height && height !== '0') {
    el.dataset.height = el.clientHeight;
  }
  const clientHeight = height || el.clientHeight;
  let cssText = 'transition: all 0.4s;';
  if (value) {
    cssText += `height: ${clientHeight}px;opacity: 1;margin-top: 4px;`;
  } else {
    cssText += 'height: 0;opacity: 0;overflow: hidden;margin-top: 0px;';
  }
  el.style.cssText = cssText;
});
app.directive('mask', (el: HTMLLIElement) => {
  const liHei = el.clientHeight as number;
  const childHei = el.querySelector('.edit-content')?.clientHeight as number;
  if (childHei > liHei) {
    el.classList.add('item-mask');
  }
});

if (process.env.NODE_ENV !== 'development') {
  app.config.errorHandler = outputErrorLog;
}

app.use(router).mount('#app');
