import { reactive } from 'vue';

const exeConfigLocal = localStorage.getItem('appConfig');

export let exeConfig = reactive({
  syncDelay: 100
});

if (exeConfigLocal) {
  exeConfig = reactive(JSON.parse(exeConfigLocal));
} else {
  localStorage.setItem('appConfig', JSON.stringify(exeConfig));
}
