import { Task } from 'electron';

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * task事件
 */
export const userTasks: Task[] = [
  {
    program: process.execPath,
    arguments: '--editor',
    iconPath: process.execPath,
    iconIndex: 0,
    title: '新建便笺',
    description: '创建新的便笺'
  },
  {
    program: process.execPath,
    arguments: '--setting',
    iconPath: process.execPath,
    iconIndex: 0,
    title: '设置',
    description: '打开设置'
  }
];

/**
 * 主要禁用
 * - F11 禁用全屏放大
 * - CTRL+R 禁用刷新
 * - CTRL+SHIFT+R 禁用刷新
 */
export const disabledKeys = () => {
  const devShortcuts = ['F11', 'Ctrl+R', 'Ctrl+SHIFT+R'];

  const shortcuts = ['Ctrl+N', 'SHIFT+F10', 'Ctrl+SHIFT+I'];

  const exportKeys = isDevelopment ? shortcuts : [...devShortcuts, ...shortcuts];
  return exportKeys;
};

/**
 * BrowserWindow的配置项
 * @param type 单独给编辑窗口的配置
 */
export const browserWindowOption = (type?: 'editor'): Electron.BrowserWindowConstructorOptions => {
  const devWid = isDevelopment ? 950 : 0;
  const devHei = isDevelopment ? 600 : 0;

  // 底部icon: 40*40
  const editorWindowOptions = {
    width: devWid || 290,
    height: devHei || 320,
    minWidth: 290
  };
  const commonOptions: Electron.BrowserWindowConstructorOptions = {
    minHeight: 48,
    frame: false,
    hasShadow: true,
    transparent: true,
    fullscreen: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  };
  // 兼容mac
  if (process.platform === 'darwin') {
    commonOptions.frame = true;
    commonOptions.transparent = false;
    commonOptions.backgroundColor = '#ffffff';
  }
  if (!type) {
    return {
      width: devWid || 350,
      height: devHei || 600,
      minWidth: 320,
      ...commonOptions,
      resizable: isDevelopment ? true : false
    };
  }
  return {
    ...editorWindowOptions,
    ...commonOptions
  };
};

/**
 * 开发环境: http://localhost:55225
 *
 * 正式环境: file://${__dirname}/index.html
 */
export const winURL = isDevelopment ? 'http://localhost:55225' : `file://${__dirname}/index.html`;
