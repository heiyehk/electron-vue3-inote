import { ComponentPublicInstance } from 'vue';
import dayjs from 'dayjs';
import version from './version';
import fs from 'fs-extra';
import os from 'os';

function getShortStack(stack?: string): string {
  const splitStack = stack?.split('\n    ');
  if (!splitStack) return '';
  const newStack: string[] = [];
  for (const line of splitStack) {
    // 过滤非程序错误
    if (line.includes('bundler')) continue;

    // 程序错误，剔除不必要的信息，只保留错误文件信息
    if (line.includes('?!.')) {
      newStack.push(line.replace(/\.\/node_modules\/.+\?!/, ''));
    } else {
      newStack.push(line);
    }
  }
  // 转换string
  return newStack.join('\n    ');
}

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
    version,
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

  if (process.env.NODE_ENV === 'production') {
    fs.writeFileSync('./inoteError.log', JSON.stringify(errorLog) + '\n', { flag: 'a' });
  }
}
