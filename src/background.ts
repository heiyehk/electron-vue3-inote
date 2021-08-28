import { app, protocol, BrowserWindow, globalShortcut } from 'electron';
import {
  createProtocol
  // installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';

import { browserWindowOption, winURL, disabledKeys } from './config';

const isDevelopment = process.env.NODE_ENV !== 'production';

let win: BrowserWindow | null;

// 将计划注册为标准将允许通过文件系统 API访问文件。否则，渲染器将为计划抛出一个安全错误。
// 此方法只能在模块事件发出之前使用，并且只能调用一次。`ready app`
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
  // 如果有webpack启动的server
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win = new BrowserWindow(browserWindowOption());
    // 默认打开webpack启动的serve
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/editor');
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    const argv = process.argv[1];
    // 注册一个协议
    createProtocol('app');

    // 判断是否是新增
    if (argv === '--editor') {
      const editorWinOptions = browserWindowOption();
      win = new BrowserWindow(editorWinOptions);
      win.loadURL(`${winURL}#/editor`);
    } else {
      win = new BrowserWindow(browserWindowOption());
      win.loadURL(winURL);
    }
  }
  // win.webContents.openDevTools();
  // sequelizeInit();

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
  // 快捷键禁用
  for (const key of disabledKeys()) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    globalShortcut.register(key, () => {});
  }
  createWindow();
});

// TODO 待开发的内容
// app.setUserTasks(userTasks);

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
