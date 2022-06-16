import { app } from 'electron';
import startWindow from './start';

// 获取锁，判断是否已经启动
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  startWindow();
}
