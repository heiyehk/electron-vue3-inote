/* eslint-disable @typescript-eslint/ban-types */

import { winURL } from '@/config';
import { BrowserWindow, remote } from 'electron';

type FunctionalControl = (this: any, fn: any, delay?: number) => (...args: any) => void;
type DebounceEvent = FunctionalControl;
type ThrottleEvent = FunctionalControl;

// 防抖函数
export const debounce: DebounceEvent = function(fn, delay = 1000) {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 节流函数
export const throttle: ThrottleEvent = function(fn, delay = 500) {
  let flag = true;
  return (...args: any) => {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  };
};

// 创建窗口
export const createBrowserWindow = (bwopt = {}, url = '/', devTools = true): BrowserWindow | null => {
  let childrenWindow: BrowserWindow | null;
  childrenWindow = new remote.BrowserWindow(bwopt);

  if (process.env.NODE_ENV === 'development' && devTools) {
    childrenWindow.webContents.openDevTools();
  }
  childrenWindow.loadURL(`${winURL}/#${url}`);
  childrenWindow.on('closed', () => {
    childrenWindow = null;
  });
  return childrenWindow;
};

// 过渡关闭窗口
export const transitCloseWindow = (): void => {
  document.querySelector('#app')?.classList.remove('app-show');
  document.querySelector('#app')?.classList.add('app-hide');
  remote.getCurrentWindow().close();
};

// uuid
export const uuid = (): string => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};
