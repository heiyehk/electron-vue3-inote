import { ComponentPublicInstance } from 'vue';
import dayjs from 'dayjs';
import fs from 'fs-extra';
import os from 'os';
import { remote } from 'electron';
import { join } from 'path';
import useMessage from '@/components/IMessage';
import { constErrorLogPath } from '@/config';

function getShortStack(stack?: string): string {
  const splitStack = stack?.split('\n    ');
  if (!splitStack) return '';
  const newStack: string[] = [];
  for (const line of splitStack) {
    // 其他信息
    if (line.includes('bundler')) continue;

    // 只保留错误文件信息
    if (line.includes('?!.')) {
      newStack.push(line.replace(/webpack-internal:\/\/\/\.\/node_modules\/.+\?!/, ''));
    } else {
      newStack.push(line);
    }
  }
  // 转换string
  return newStack.join('\n    ');
}

export const errorLogPath = join(remote.app.getPath('userData'), constErrorLogPath);

export default function(error: unknown, vm: ComponentPublicInstance | null, info: string): void {
  const { message, stack } = error as Error;
  const { electron, chrome, node, v8 } = process.versions;
  const { outerWidth, outerHeight, innerWidth, innerHeight } = window;
  const { width, height } = window.screen;

  // 报错信息
  const errorInfo = {
    errorInfo: info,
    errorMessage: message,
    errorStack: getShortStack(stack)
  };

  // electron
  const electronInfo = { electron, chrome, node, v8 };

  // 浏览器窗口信息
  const browserInfo = { outerWidth, outerHeight, innerWidth, innerHeight };

  const errorLog = {
    versions: remote.app.getVersion(),
    date: dayjs().format('YYYY-MM-DD HH:mm'),
    error: errorInfo,
    electron: electronInfo,
    window: {
      type: os.type(),
      platform: os.platform()
    },
    browser: browserInfo,
    screen: { width, height }
  };

  useMessage('程序出现异常', 'error');

  if (process.env.NODE_ENV === 'production') {
    fs.writeFileSync(errorLogPath, JSON.stringify(errorLog) + '\n', { flag: 'a' });
  } else {
    console.log(errorInfo.errorStack);
  }
}
