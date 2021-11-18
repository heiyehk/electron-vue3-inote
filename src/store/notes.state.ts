import { ipcRenderer, remote } from 'electron';
import { ref, watch } from 'vue';
interface NotesState {
  [key: string]: any;
  syncDelay: number;
  serverAddress: string;
  serverToken: string;
  switchStatus: {
    [key: string]: any;
    /**
     * 开启提示
     */
    textTip: boolean;

    /**
     * 删除确认
     */
    deleteTip: boolean;

    /**
     * 自动沉浸
     */
    autoNarrow: boolean;
    /**
     * 纯净模式
     */
    autoNarrowPure: boolean;

    /**
     * 自动隐藏
     */
    autoHide: boolean;

    /**
     * 打开同步
     */
    openSync: boolean;
  };
}

const notesStateLocal = localStorage.getItem('notesState');

export const notesState = ref<NotesState>({
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
     * 缩小纯净模式
     */
    autoNarrowPure: false,

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
  notesState.value = JSON.parse(notesStateLocal);
} else {
  localStorage.setItem('notesState', JSON.stringify(notesState.value));
}

watch(notesState.value, e => {
  localStorage.setItem('notesState', JSON.stringify(e));
  ipcRenderer.send('updateStorage');
});

remote.ipcMain.on('updateStorage', () => {
  const aa = JSON.parse(localStorage.getItem('notesState')!) as NotesState;
  for (const keys of Object.keys(aa)) {
    if (keys === 'switchStatus') {
      for (const aaaa of Object.keys(aa[keys])) {
        if (aa.switchStatus[aaaa] !== notesState.value.switchStatus[aaaa]) {
          notesState.value.switchStatus[aaaa] = aa.switchStatus[aaaa];
        }
      }
    }
  }
});
