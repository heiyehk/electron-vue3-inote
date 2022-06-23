import { winURL } from '@/config';
import { BrowserWindow, remote } from 'electron';
import { enc, AES, mode, pad } from 'crypto-js';

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
  // childrenWindow.webContents.openDevTools();
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

export const symbolKey = Symbol('key');
export const symbolIv = Symbol('iv');
export const symbolEncrypt = Symbol('encrypt');
export const symbolDecode = Symbol('decode');
export const algorithm = {
  [symbolKey]: enc.Utf8.parse('1234123412ABCDEF'), // 十六位十六进制数作为密钥
  [symbolIv]: enc.Utf8.parse('ABCDEF1234123412'), // 十六位十六进制数作为密钥偏移量
  // 加密
  [symbolEncrypt]: (word: string) => {
    const srcs = enc.Utf8.parse(word);
    const encrypted = AES.encrypt(srcs, algorithm[symbolKey], {
      iv: algorithm[symbolIv],
      mode: mode.CBC,
      padding: pad.Pkcs7
    });
    return encrypted.ciphertext.toString().toUpperCase();
  },
  // 解密
  [symbolDecode]: (word: string) => {
    const encryptedHexStr = enc.Hex.parse(word);
    const srcs = enc.Base64.stringify(encryptedHexStr);
    const decrypt = AES.decrypt(srcs, algorithm[symbolKey], {
      iv: algorithm[symbolIv],
      mode: mode.CBC,
      padding: pad.Pkcs7
    });
    const decryptedStr = decrypt.toString(enc.Utf8);
    return decryptedStr.toString();
  }
};

export interface TwiceHandle {
  keydownInterval: NodeJS.Timer | null;
  intervalCount: number;
  keydownCount: number;
  start: (fn: () => void) => void;
}

/**
 * 在300毫秒内触发2次事件的callback
 */
export const twiceHandle: TwiceHandle = {
  keydownInterval: null,
  intervalCount: 0,
  keydownCount: 0,
  start(fn) {
    if (!this.keydownInterval) {
      this.intervalCount += 1;
      this.keydownInterval = setInterval(() => {
        if (this.intervalCount > 5) {
          clearInterval(this.keydownInterval as NodeJS.Timer);
          this.keydownInterval = null;
          this.intervalCount = 0;
          this.keydownCount = 0;
        } else {
          this.intervalCount += 1;
          if (this.keydownCount >= 2) {
            clearInterval(this.keydownInterval as NodeJS.Timer);
            this.keydownInterval = null;
            this.intervalCount = 0;
            this.keydownCount = 0;
            fn();
          }
        }
      }, 50);
    }

    if (this.keydownCount <= 2) {
      this.keydownCount += 1;
    }
  }
};
