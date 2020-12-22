<template>
  <main class="page-setting">
    <div class="block">
      <p class="block-title">通用设置</p>
      <div class="block-content">
        <div class="block-line">
          <div class="flex-items">
            <span>编辑和列表同步速度</span>
            <Input
              :max="1000"
              :min="100"
              maxlength="4"
              readonly="readonly"
              :control="true"
              type="number"
              style="width: 86px;margin-left: 10px;"
              v-model="exeConfig.syncDelay"
            />
            <Tick v-model="inputStatus" :duration="1000" />
          </div>
          <div class="gray-text" v-tip="exeConfig.switchStatus.textTip">
            设置编辑和列表同步显示的速度，数字越大，同步速度越快，但影响性能，不影响使用数据。在同步过程中有明显差异，建议使用最大数1000效果会更佳。
          </div>
        </div>
        <div class="block-line flex-items">
          <span>开启提示</span>
          <Switch styled="margin-left: 10px;" v-model="exeConfig.switchStatus.textTip" />
        </div>
        <div class="block-line flex-items">
          <span>删除确认</span>
          <Switch styled="margin-left: 10px;" v-model="exeConfig.switchStatus.deleteTip" />
        </div>
        <div class="block-line">
          <div class="flex-items">
            <span>自动缩小</span>
            <Switch styled="margin-left: 10px;" v-model="exeConfig.switchStatus.autoNarrow" />
          </div>
          <div class="gray-text" v-tip="exeConfig.switchStatus.textTip">
            空闲时自动最小化
          </div>
        </div>
        <div class="block-line">
          <div class="flex-items">
            <span>靠边隐藏</span>
            <Switch styled="margin-left: 10px;" v-model="exeConfig.switchStatus.autoHide" />
          </div>
          <div class="gray-text" v-tip="exeConfig.switchStatus.textTip">
            靠近屏幕边缘的时候自动隐藏
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <p class="block-title">同步设置</p>
      <div class="block-content">
        <div class="block-line flex-items" :style="exeConfig.switchStatus.openSync ? '' : 'margin-bottom: 0'">
          <span>开启同步</span>
          <Switch styled="margin-left: 10px;" v-model="exeConfig.switchStatus.openSync" />
        </div>
        <div class="setting-sync-server" :class="exeConfig.switchStatus.openSync ? '' : 'hide-sync'">
          <div v-if="exeConfig.switchStatus.openSync">
            <div class="block-line" style="margin-bottom: 4px;">同步服务地址</div>
            <div class="block-line" style="margin-bottom: 5px;">
              <Input v-model="exeConfig.serverAddress" />
            </div>
            <div class="block-line" style="margin-bottom: 4px;">同步服务TOKEN</div>
            <div class="block-line">
              <Input v-model="exeConfig.serverToken" />
            </div>
            <div class="block-line">
              <a class="link-style">点击测试连接</a>
            </div>
          </div>
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
        <div class="block-line">
          <div class="flex-items">
            <i class="iconfont icon-mail"></i>
            <span>heiyehk@foxmail.com</span>
            <a class="link-style link-margin" href="javascript:void(0)" @click="copyEmail">复制</a>
            <Tick v-model="copyStatus" :duration="1000" />
          </div>
          <div class="gray-text" v-tip="exeConfig.switchStatus.textTip">
            如果你有更好的建议或者动画效果，请联系我
          </div>
        </div>
        <div class="block-line">
          <div class="flex-">
            <span>反馈bug</span>
            <a class="link-style link-margin" @click="openLogFolder">打开错误日志</a>
          </div>
          <div class="gray-text" v-tip="exeConfig.switchStatus.textTip">
            如果遇到问题或者bug，为了更好的使用，建议联系上面邮箱
          </div>
        </div>
        <div class="block-line flex-items">
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
import { defineComponent, Ref, ref } from 'vue';
import { remote, shell } from 'electron';
import fs from 'fs-extra';

import Tick from '@/components/tick.vue';
import Input from '@/components/input.vue';
import Switch from '@/components/switch.vue';

import { exeConfig } from '@/store/exeConfig.state';
import { errorLogPath } from '@/utils/errorLog';

export default defineComponent({
  components: {
    Tick,
    Input,
    Switch
  },
  directives: {
    tip(el, { value }) {
      const { height } = el.dataset;
      // 储存最初的高度
      if (!height && height !== '0') {
        el.dataset.height = el.clientHeight;
      }
      const clientHeight = height || el.clientHeight;
      let cssText = 'transition: all 0.4s;';
      if (value) {
        cssText += `height: ${clientHeight}px;opacity: 1;`;
      } else {
        cssText += 'height: 0;opacity: 0;overflow: hidden;';
      }
      el.style.cssText = cssText;
    }
  },
  setup() {
    const mailInput: Ref<HTMLInputElement | null> = ref(null);
    const copyStatus = ref(false);
    const inputStatus = ref(false);

    const appInfo = process.versions;
    const currentYear = new Date().getFullYear();
    const version = remote.app.getVersion();
    const appDataPath = remote.app.getPath('appData');
    const issueLink = 'https://github.com/heiyehk/electron-vue3-inote/issues';
    const githubLink = 'https://github.com/heiyehk/electron-vue3-inote';

    const copyEmail = () => {
      if (copyStatus.value) return;
      copyStatus.value = true;
      mailInput.value?.select();
      document.execCommand('copy');
    };

    const openLogFolder = () => {
      if (fs.existsSync(errorLogPath)) {
        remote.shell.showItemInFolder(errorLogPath);
      } else {
        // TODO 没有错误日志就弹窗提示
        alert('1');
      }
    };

    const openAppDataFolder = () => {
      remote.shell.showItemInFolder(appDataPath);
    };

    const changeInput = (text: string) => {
      console.log(text);
    };

    const openExternal = (link: string) => {
      shell.openExternal(link);
    };

    return {
      copyStatus,
      inputStatus,
      version,
      copyEmail,
      mailInput,
      appInfo,
      currentYear,
      openLogFolder,
      openAppDataFolder,
      exeConfig,
      changeInput,
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
    transition: all 0.4s;
    .iconfont {
      font-size: 20px;
      margin-right: 6px;
    }
    &:last-child {
      margin-bottom: 0 !important;
      transition: all 0.4s;
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

.setting-sync-server {
  height: 136px;
  overflow: hidden;
  opacity: 1;
  transition: all 0.4s;
}
.hide-sync {
  height: 0;
  opacity: 0;
  transition: all 0.4s;
}
</style>
