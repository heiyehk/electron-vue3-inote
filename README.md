# electron+vue3+ts

> 在Windows环境下，删除`node_modules`重新安装依赖的情况下，会导致`build`报错，需要使用`npm i`进行安装依赖。
> In the Windows environment, deleting `node_modules` and reinstalling dependencies will cause `build` errors, and you need to use `npm i` to install dependencies.

<div align="center">
<img src="https://img.shields.io/badge/vue-3.2.6-green"/>
<img src="https://img.shields.io/badge/electron-%5E11.5.0-brightgreen"/>
<img src="https://img.shields.io/badge/typescript-~4.4.4-yellowgreen"/>
<img src="https://img.shields.io/badge/sqlite3-%5E5.0.2-orange"/>
<img src="https://img.shields.io/badge/vditor-%5E3.8.10-blue"/>
</div>

### Windows10
<img width="50%" src="https://user-images.githubusercontent.com/33891067/126118222-c8c39a33-d5a7-4b72-9f4c-b633a1eb2201.png" />

### Mac
<img width="50%" src="https://user-images.githubusercontent.com/33891067/128463221-9d0ebff0-f706-44e2-8007-964e63d43424.png" />

## 启动
```
yarn serve
```

## 打包
```
yarn build
```

## 教程
【electron+vue3+ts实战便笺exe】一、搭建框架配置
https://juejin.cn/post/6909723449246089224

【electron+vue3+ts实战便笺exe】二、electron+vue3开发内容
https://juejin.cn/post/6909725365107687431

![gif](https://user-images.githubusercontent.com/33891067/126119851-b59a0acb-07b4-4126-9698-961ee0f706a7.gif)

```
electron-vue3-inote
├── babel.config.js
├── package.json
├── public
│   ├── css
│   ├── favicon.ico
│   ├── font
│   └── index.html
├── script # 打包删除脚本
│   └── deleteBuild.js
├── src
│   ├── App.vue
│   ├── assets
│   ├── background.ts
│   ├── components
│   ├── config # electron和软件的一些配置项
│   ├── less
│   ├── main.ts
│   ├── router # 路由
│   ├── service # 存放sqlite3 db服务
│   ├── shims-vue.d.ts
│   ├── store
│   ├── types
│   ├── utils
│   └── views
├── tsconfig.json
└── vue.config.js
```
