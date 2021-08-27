import { reactive, watch } from 'vue';

const exeConfigLocal = localStorage.getItem('exeConfig');

export let exeConfig = reactive({
  syncDelay: 100,
  serverAddress: '',
  serverToken: '',
  switchStatus: {
    /**
     * 开启提示
     */
    textTip: true,

    /**
     * 删除确认
     */
    deleteTip: false,

    /**
     * 自动缩小
     */
    autoNarrow: false,

    /**
     * 自动隐藏
     */
    autoHide: false,

    /**
     * 打开同步
     */
    openSync: false
  }
});

if (exeConfigLocal) {
  exeConfig = reactive(JSON.parse(exeConfigLocal));
} else {
  localStorage.setItem('exeConfig', JSON.stringify(exeConfig));
}

watch(exeConfig, e => {
  localStorage.setItem('exeConfig', JSON.stringify(e));
});
