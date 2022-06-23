// const rm = require('rimraf');
// const path = require('path');
// const pluginOptions = require('../vue.config').pluginOptions;

// let directories = pluginOptions.electronBuilder.builderOptions.directories;
// let buildPath = '';

// if (directories && directories.output) {
//   buildPath = directories.output;
// }

// // 删除作用只用于删除打包前的buildPath || dist_electron
// // dist_electron是默认打包文件夹
// rm(path.join(__dirname, `../../${buildPath || 'dist_electron'}`), () => {});
