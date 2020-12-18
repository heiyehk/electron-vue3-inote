<template>
  <main class="page-setting">
    <div class="block">
      <p class="block-title">通用设置</p>
      <div class="block-content">
        <div class="block-line flex-items">
          <span>编辑和列表同步速度</span>
          <Input
            :max="1000"
            :min="100"
            readonly="readonly"
            :control="true"
            style="width: 86px;margin-left: 10px;"
            v-model="exeConfig.syncDelay"
            @on-change="changeDelay"
          />
          <Tick v-model="inputStatus" :duration="1000" />
        </div>
        <div class="block-line flex-items">
          <span>开启提示</span>
          <Switch styled="margin-left: 10px;" v-model="textTipsSwitchStatus" />
        </div>
        <div class="block-line flex-items">
          <span>删除确认</span>
          <Switch styled="margin-left: 10px;" v-model="autoHideSwitchStatus" />
        </div>
        <div class="block-line flex-items">
          <span>自动缩小</span>
          <Switch styled="margin-left: 10px;" v-model="narrowSwitchStatus" />
        </div>
        <div class="block-line flex-items">
          <span>靠边隐藏</span>
          <Switch styled="margin-left: 10px;" v-model="autoHideSwitchStatus" />
        </div>
      </div>
    </div>
    <div class="block">
      <p class="block-title">同步设置</p>
      <div class="block-content">
        <div class="block-line flex-items">
          <span>开启同步</span>
          <Switch styled="margin-left: 10px;" v-model="autoHideSwitchStatus" />
        </div>
      </div>
    </div>
    <div class="block" style="display: none;">
      <p class="block-title">导入导出</p>
      <div class="block-content">
        <div class="block-line link-style">
          <div class="line-block flex-items">
            <i class="iconfont icon-inport"></i>
            <span>导入便笺</span>
          </div>
        </div>
        <div class="block-line link-style">
          <div class="line-block flex-items">
            <i class="iconfont icon-export"></i>
            <span>导出便笺</span>
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <p class="block-title">反馈问题</p>
      <div class="block-content">
        <div class="block-line flex-items" style="margin-bottom: 0;">
          <i class="iconfont icon-mail"></i>
          <span>heiyehk@foxmail.com</span>
          <a class="link-style link-margin" href="javascript:void(0)" @click="copyEmail">复制</a>
          <Tick v-model="copyStatus" :duration="1000" />
        </div>
        <div class="block-line flex-items gray-text">如果你有更好的建议或者动画效果，请联系我</div>
        <div class="block-line flex-items" style="margin-bottom: 0;">
          <span>反馈bug</span>
          <a class="link-style link-margin" @click="openLogFolder">打开错误日志</a>
        </div>
        <div class="block-line flex-items gray-text">
          检测到软件使用过程中出现异常，为了更好的使用，建议将错误日志发送至上面邮箱
        </div>
        <div class="block-line flex-items" style="margin-bottom: 0;">
          <span>提交issue</span>
          <a class="link-style link-margin flex-items" @click="openExternal(issueLink)">
            <span>GitHub Issue</span>
            <i class="iconfont icon-link"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="block">
      <p class="block-title">关于I便笺</p>
      <div class="block-content">
        <div class="about-app-description">
          <p>版本：{{ version }}</p>
          <p>Electron: {{ appInfo.electron }}</p>
          <p>Chrome: {{ appInfo.chrome }}</p>
          <p>Node.js: {{ appInfo.node }}</p>
          <p>V8: {{ appInfo.v8 }}</p>
          <p>Copyright (c) {{ currentYear }} heiyehk.</p>
          <p class="link-style flex-items" style="margin-top: 10px;" @click="openExternal(githubLink)">
            <span>github地址</span>
            <i class="iconfont icon-link"></i>
          </p>
        </div>
      </div>
    </div>
  </main>
  <input class="hide-input" ref="mailInput" type="text" value="heiyehk@foxmail.com" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { remote, shell } from 'electron';
import path from 'path';

import Tick from '@/components/tick.vue';
import Input from '@/components/input.vue';
import Switch from '@/components/switch.vue';

import { exeConfig } from '@/store/appConfig.state';

export default defineComponent({
  components: {
    Tick,
    Input,
    Switch
  },
  setup() {
    const mailInput = ref(null);
    const copyStatus = ref(false);
    const inputStatus = ref(false);
    const narrowSwitchStatus = ref(false);
    const autoHideSwitchStatus = ref(false);
    const textTipsSwitchStatus = ref(false);
    const appInfo = process.versions;
    const currentYear = new Date().getFullYear();
    const version = remote.app.getVersion();
    const getPath = remote.app.getPath;
    const exePath = getPath('exe');
    const appDataPath = getPath('appData');
    const issueLink = 'https://github.com/heiyehk/electron-vue3-inote/issues';
    const githubLink = 'https://github.com/heiyehk/electron-vue3-inote';

    const copyEmail = () => {
      if (copyStatus.value) return;
      copyStatus.value = true;
      ((mailInput.value as unknown) as HTMLInputElement).select();
      document.execCommand('copy');
    };

    const openLogFolder = () => {
      remote.shell.showItemInFolder(path.join(exePath, '../inoteError.log'));
    };

    const openAppDataFolder = () => {
      remote.shell.showItemInFolder(appDataPath);
    };

    const changeDelay = () => {
      inputStatus.value = true;
      localStorage.setItem('appConfig', JSON.stringify(exeConfig));
    };

    const openExternal = (link: string) => {
      shell.openExternal(link);
    };

    return {
      copyStatus,
      inputStatus,
      narrowSwitchStatus,
      autoHideSwitchStatus,
      textTipsSwitchStatus,
      version,
      copyEmail,
      mailInput,
      appInfo,
      currentYear,
      openLogFolder,
      openAppDataFolder,
      exeConfig,
      changeDelay,
      issueLink,
      githubLink,
      openExternal
    };
  }
});
</script>

<style lang="less" scoped>
.page-setting {
  height: calc(100% - @iconSize);
  background-color: @white-color;
  padding: 12px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  .block {
    padding: 14px 0;
    box-sizing: border-box;
    border-bottom: 1px solid @border-color;
    &-title {
      font-size: 15px;
      margin-bottom: 15px;
      font-weight: bold;
    }
    &:last-child {
      border-bottom: none;
    }
  }
}

.block-content {
  .block-line {
    font-size: 14px;
    margin-bottom: 14px;
    .iconfont {
      font-size: 20px;
      margin-right: 6px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  .link-style {
    color: @primary-color;
    cursor: pointer;
  }

  .link-margin {
    margin-left: 8px;
  }

  .gray-text {
    color: @disabled-color;
    font-size: 12px;
  }
}

.about-app-description {
  font-size: 14px;
  color: @text-sub-color;
}

.hide-input {
  position: fixed;
  z-index: -9999;
  opacity: 0;
  height: 0;
  overflow: hidden;
}
</style>
