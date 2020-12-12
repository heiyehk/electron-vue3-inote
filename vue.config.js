/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'development') {
      config.optimization.minimizer[0].options.terserOptions.warnings = false;
      // config.optimization.minimizer[0].options.terserOptions.compress = {
      //   warnings: false,
      //   drop_console: true,
      //   drop_debugger: true,
      //   pure_funcs: ['console.log']
      // };
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      appId: 'test.com',
      win: {
        target: ['nsis', 'zip']
      },
      nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        perMachine: true
      }
    },
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/less/index.less')] // 引入全局样式变量
    }
  }
};
