/**
 * 软件数据和配置
 * C:\Users\{用户名}\AppData\Roaming
 * 共享
 * C:\ProgramData\Intel\ShaderCache\i-notes{xx}
 * 快捷方式
 * C:\Users\{用户名}\AppData\Roaming\Microsoft\Windows\Recent
 * 电脑自动创建缓存
 * C:\Windows\Prefetch\I-NOTES.EXE{xx}
 */

/** */
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
  const commonOptions = {
    minHeight: 48,
    frame: false,
    hasShadow: true,
    transparent: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  };
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
 * 开发环境: http://localhost:8080
 * 正式环境: file://${__dirname}/index.html
 */
const winURL = globalEnv === 'development' ? 'http://localhost:8080' : `file://${__dirname}/index.html`;

export { browserWindowOption, winURL };
