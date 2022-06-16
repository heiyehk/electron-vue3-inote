# electron+vue3+ts
> 主要为了学习，如果需要使用请使用[0.2.3](https://github.com/heiyehk/electron-vue3-inote/releases/tag/0.2.3)版本，`0.3.x`的版本暂时有点问题。
> Mainly for learning, please use version 0.2.3 if you need to use it, the version 0.3.x is temporarily a bit problematic.


<div align="center">
<img src="https://img.shields.io/badge/vue-3.2.6-green"/>
<img src="https://img.shields.io/badge/electron-%5E11.5.0-brightgreen"/>
<img src="https://img.shields.io/badge/typescript-~4.4.4-yellowgreen"/>
<img src="https://img.shields.io/badge/sqlite3-%5E5.0.2-orange"/>
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
