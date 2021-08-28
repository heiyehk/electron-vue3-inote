import { reactive, watch } from 'vue';

const notesStateLocal = localStorage.getItem('notesState');

export let notesState = reactive({
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

if (notesStateLocal) {
  notesState = reactive(JSON.parse(notesStateLocal));
} else {
  localStorage.setItem('notesState', JSON.stringify(notesState));
}

watch(notesState, e => {
  localStorage.setItem('notesState', JSON.stringify(e));
});
