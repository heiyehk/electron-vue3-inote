<template>
  <main class="page-setting">
    <div class="block">
      <p class="block-title">通用设置</p>
      <div class="block-content">
        <div class="block-line disabled-line">
          <div class="flex-items">
            <span>编辑和列表同步速度</span>
            <Input
              :max="1000"
              :min="100"
              disabled
              maxlength="4"
              :readonly="true"
              :control="true"
              type="number"
              style="width: 86px;margin-left: 10px;"
              v-model="notesState.syncDelay"
            />
            <Tick v-model="inputStatus" :duration="1000" />
          </div>
          <div class="gray-text" v-tip="notesState.switchStatus.textTip">
            设置编辑和列表同步显示的速度，数字越大，同步速度越快，但影响性能，不影响使用数据。在同步过程中有明显差异，建议使用最大数1000效果会更佳。
          </div>
        </div>
        <div class="block-line flex-items">
          <span>开启提示</span>
          <Switch styled="margin-left: 10px;" v-model="notesState.switchStatus.textTip" />
        </div>
        <div class="block-line flex-items">
          <span>删除确认</span>
          <Switch styled="margin-left: 10px;" v-model="notesState.switchStatus.deleteTip" />
        </div>
        <div class="block-line">
          <div class="flex-items">
            <span>自动沉浸</span>
            <Switch
              @change="changeAutoNarrow"
              styled="margin-left: 10px;"
              v-model="notesState.switchStatus.autoNarrow"
            />
          </div>
          <div class="gray-text" v-tip="notesState.switchStatus.textTip">
            失去焦点时自动隐藏头部和底部
          </div>
        </div>
        <div class="block-line">
          <div class="flex-items">
            <span>纯净模式</span>
            <Switch
              styled="margin-left: 10px;"
              :disabled="!notesState.switchStatus.autoNarrow"
              v-model="notesState.switchStatus.autoNarrowPure"
            />
          </div>
          <div class="gray-text" v-tip="notesState.switchStatus.textTip">
            在沉浸下需要按<span class="block-important">ESC</span>退出当前纯净模式
          </div>
        </div>
        <!-- <div class="block-line disabled-line">
          <div class="flex-items">
            <div class="undeveloped">(未开发)</div>
            <span>靠边隐藏</span>
            <Switch disabled styled="margin-left: 10px;" v-model="notesState.switchStatus.autoHide" />
          </div>
          <div class="gray-text" v-tip="notesState.switchStatus.textTip">
            靠近屏幕边缘的时候自动隐藏
          </div>
        </div> -->
      </div>
    </div>
    <div class="block">
      <p class="block-title">同步设置</p>
      <div class="block-content">
        <div
          class="block-line disabled-line flex-items"
          :style="notesState.switchStatus.openSync ? '' : 'margin-bottom: 0'"
        >
          <div class="undeveloped">(未开发)</div>
          <span>开启同步</span>
          <Switch disabled styled="margin-left: 10px;" v-model="notesState.switchStatus.openSync" />
        </div>
        <div class="setting-sync-server" :class="notesState.switchStatus.openSync ? '' : 'hide-sync'">
          <div v-if="notesState.switchStatus.openSync">
            <div class="block-line" style="margin-bottom: 4px;">同步服务地址</div>
            <div class="block-line" style="margin-bottom: 5px;">
              <Input v-model="notesState.serverAddress" />
            </div>
            <div class="block-line" style="margin-bottom: 4px;">同步服务TOKEN</div>
            <div class="block-line">
              <Input v-model="notesState.serverToken" />
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
          <div class="gray-text" v-tip="notesState.switchStatus.textTip">
            如果你有更好的建议或者动画效果，请联系我
          </div>
        </div>
        <div class="block-line">
          <div class="flex-">
            <span>反馈bug</span>
            <a class="link-style link-margin" @click="openLogFolder">打开错误日志</a>
          </div>
          <div class="gray-text" v-tip="notesState.switchStatus.textTip">
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
import { remote } from 'electron';
import fs from 'fs-extra';

import Tick from '@/components/Tick.vue';
import Input from '@/components/Input.vue';
import Switch from '@/components/Switch.vue';

import { notesState } from '@/store/notes.state';
import { errorLogPath } from '@/utils/errorLog';
import useMessage from '@/components/Message';

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
        useMessage('ヾ(≧▽≦*)o暂时没有bug', 'success');
      }
    };

    const openAppDataFolder = () => {
      remote.shell.showItemInFolder(appDataPath);
    };

    const openExternal = (link: string) => {
      remote.shell.openExternal(link);
    };

    const changeAutoNarrow = (data: boolean) => {
      if (!data) {
        notesState.value.switchStatus.autoNarrowPure = false;
      }
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
      notesState,
      issueLink,
      githubLink,
      openExternal,
      changeAutoNarrow
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
    .undeveloped {
      display: none;
    }
  }

  .disabled-line {
    color: @text-sub-color;
    .undeveloped {
      display: block;
      margin-right: 20px;
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

.block-important {
  background-color: @gray-color;
  color: @text-color;
  display: inline-block;
  line-height: 1;
  padding: 1px 2px;
  margin: 0 2px;
}
</style>
