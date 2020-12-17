<template>
  <main class="page-setting">
    <!-- TODO 设置信息 -->
    <div class="block">
      <p class="block-title">通用设置</p>
      <div class="block-content">
        <div class="block-line flex-items">
          <span>编辑和列表同步速度</span>
          <Input style="width: 86px;margin-left: 10px;" v-model="configOptiosn.syncDelay" />
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
          <Tick v-model="tickStatus" :duration="1000" />
        </div>
        <div class="block-line flex-items gray-text">如果你有更好的建议或者动画效果，请联系我</div>
        <div class="block-line flex-items" style="margin-bottom: 0;">
          <span>反馈bug</span>
          <a class="link-style link-margin" @click="openLogFolder">打开错误日志</a>
        </div>
        <div class="block-line flex-items gray-text">
          检测到软件使用过程中出现异常，为了更好的使用，建议将错误日志发送至上面邮箱
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
        </div>
      </div>
    </div>
  </main>
  <input class="hide-input" ref="mailInput" type="text" value="heiyehk@foxmail.com" />
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import Tick from '@/components/tick.vue';
import Input from '@/components/input.vue';
import { remote } from 'electron';
import path from 'path';

export default defineComponent({
  components: {
    Tick,
    Input
  },
  setup() {
    const mailInput = ref(null);
    const tickStatus = ref(false);
    const appInfo = process.versions;
    const currentYear = new Date().getFullYear();
    const version = remote.app.getVersion();
    const getPath = remote.app.getPath;
    const exePath = getPath('exe');
    const appDataPath = getPath('appData');
    const configOptiosn = reactive({
      syncDelay: 100
    });

    const copyEmail = () => {
      if (tickStatus.value) return;
      tickStatus.value = true;
      ((mailInput.value as unknown) as HTMLInputElement).select();
      document.execCommand('copy');
    };

    const openLogFolder = () => {
      remote.shell.showItemInFolder(path.join(exePath, '../inoteError.log'));
    };

    const openAppDataFolder = () => {
      remote.shell.showItemInFolder(appDataPath);
    };

    return {
      version,
      copyEmail,
      mailInput,
      tickStatus,
      appInfo,
      currentYear,
      openLogFolder,
      openAppDataFolder,
      configOptiosn
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
