const globalEnv = process.env.NODE_ENV;

const devWid = globalEnv === 'development' ? 950 : 0;
const devHei = globalEnv === 'development' ? 600 : 0;

// 底部icon: 40*40
const editorWindowOptions = {
  width: devWid || 290,
  height: devHei || 350,
  minWidth: 250
};

/**
 * BrowserWindow的配置项
 * @param type 单独给编辑窗口的配置
 */
const browserWindowOption = (type?: 'editor'): Electron.BrowserWindowConstructorOptions => {
  const commonOptions: Electron.BrowserWindowConstructorOptions = {
    minHeight: 48,
    frame: false,
    hasShadow: true,
    transparent: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  };
  /**
   * mac兼容
   */
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
      ...commonOptions
    };
  }
  return {
    ...editorWindowOptions,
    ...commonOptions
  };
};

/**
 * 开发环境: http://localhost:55225
 * 正式环境: file://${__dirname}/index.html
 */
const winURL = globalEnv === 'development' ? 'http://localhost:55225' : `file://${__dirname}/index.html`;

export { browserWindowOption, winURL };
