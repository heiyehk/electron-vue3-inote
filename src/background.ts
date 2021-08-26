import { app, protocol, BrowserWindow, globalShortcut } from 'electron';
import {
  createProtocol
  // installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';

import { browserWindowOption, winURL, shortcutsKeys } from './config';

const isDevelopment = process.env.NODE_ENV !== 'production';

let win: BrowserWindow | null;
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true
    }
  }
]);

function createWindow() {
  win = new BrowserWindow(browserWindowOption());

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL(winURL);
  }
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   try {
  //     await installVueDevtools();
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString());
  //   }
  // }
  // 快捷键禁用
  for (const key of shortcutsKeys) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    globalShortcut.register(key, () => {});
  }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
