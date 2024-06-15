import { ipcRenderer, remote } from 'electron';
import { ref, watch } from 'vue';
import { join, dirname } from 'path';
import { constImagesPath } from '@/config';
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
  /** 本地图片缓存地址 */
  imagesCacheUrl: string;
}

const defaultNotesState: NotesState = {
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
  },
  imagesCacheUrl: join(dirname(remote.app.getPath('exe')), constImagesPath)
};

export const notesState = ref<NotesState>({} as NotesState);

const getLocalValue = () => {
  if (localStorage.getItem('notesState')) {
    notesState.value = { ...notesState.value, ...JSON.parse(localStorage.getItem('notesState')!) };
  } else {
    notesState.value = defaultNotesState;
    localStorage.setItem('notesState', JSON.stringify(defaultNotesState));
  }
};
getLocalValue();
const initialNotesStateLocal = () => {
  getLocalValue();
  ipcRenderer.send('updateStorage');
};

const watchStateIPC = () => {
  const localJsonState = JSON.parse(localStorage.getItem('notesState')!) as NotesState;
  for (const keys of Object.keys(localJsonState)) {
    if (keys === 'switchStatus') {
      for (const item of Object.keys(localJsonState[keys])) {
        if (localJsonState.switchStatus[item] !== notesState.value.switchStatus[item]) {
          notesState.value.switchStatus[item] = localJsonState.switchStatus[item];
        }
      }
    }
  }
};

export const resetStore = () => {
  localStorage.clear();
  localStorage.setItem('notesState', JSON.stringify(defaultNotesState));
  ipcRenderer.send('updateStorage');
};

watch(() => localStorage.getItem('notesState'), initialNotesStateLocal);

watch(notesState.value, e => {
  localStorage.setItem('notesState', JSON.stringify(e));
  ipcRenderer.send('updateStorage');
});

remote.ipcMain.on('updateStorage', watchStateIPC);
