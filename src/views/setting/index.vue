<template>
  <main class="page-setting">
    <!-- TODO 设置信息 -->
    <div class="block">
      <p class="block-title">通用设置</p>
      <div class="block-content">
        <div class="operation">编辑和列表同步</div>
        <input type="number" />
      </div>
    </div>
    <div class="block">
      <p class="block-title">导入导出</p>
      <div class="block-content">
        <div class="operation link-style">
          <div class="inline-block flex-items">
            <i class="iconfont icon-inport"></i>
            <span>导入便笺</span>
          </div>
        </div>
        <div class="operation link-style">
          <div class="inline-block flex-items">
            <i class="iconfont icon-export"></i>
            <span>导出便笺</span>
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <p class="block-title">反馈问题</p>
      <div class="block-content">
        <div class="operation flex-items">
          <i class="iconfont icon-mail"></i>
          <span class="inline-block">heiyehk@foxmail.com</span>
          <a href="javascript:void(0)" class="inline-block" @click="copyEmail">复制</a>
          <tick v-model="tickStatus" :duration="1000" />
        </div>
      </div>
      <!-- TODO 打开buglog反馈 -->
      <div class="block-content">
        <div class="inline-block flex-items gray-text">
          <i class="iconfont icon-eport"></i>
          <span>⬆⬆⬆如果你有更好的建议或者动画效果，请联系我</span>
        </div>
      </div>
    </div>
    <div class="block">
      <p class="block-title">关于I便笺</p>
      <div class="block-content">
        <div class="about-app-description">
          <p>版本：{{ appVersion }}</p>
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
import { defineComponent, ref } from 'vue';
import Tick from '@/components/tick.vue';
import appVersion from '@/utils/version';

export default defineComponent({
  components: {
    Tick
  },
  setup() {
    const mailInput = ref(null);
    const tickStatus = ref(false);
    const appInfo = process.versions;
    const currentYear = new Date().getFullYear();

    const copyEmail = () => {
      if (tickStatus.value) {
        return false;
      }
      tickStatus.value = true;
      ((mailInput.value as unknown) as HTMLInputElement).select();
      document.execCommand('copy');
    };

    return {
      copyEmail,
      mailInput,
      tickStatus,
      appVersion,
      appInfo,
      currentYear
    };
  }
});
</script>

<style lang="less" scoped>
.page-setting {
  height: calc(100% - @iconSize);
  background-color: #fff;
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
      margin-bottom: 10px;
    }
    &:last-child {
      border-bottom: none;
    }
  }
}
.operation {
  margin-bottom: 6px;
  .iconfont {
    font-size: 20px;
    margin-right: 6px;
  }
  a {
    font-size: 14px;
    margin-left: 6px;
    color: @primary-color;
  }
  &:last-child {
    margin-bottom: 0;
  }
}

.link-style {
  color: @primary-color;
  .inline-block {
    width: 84px;
  }
}
.inline-block {
  position: relative;
  cursor: pointer;
  font-size: 14px;
  span {
    font-size: 14px;
  }
  &::before {
    content: '';
    position: absolute;
    width: 0;
    left: 0;
    height: 1px;
    background-color: @primary-color;
    bottom: 0;
    opacity: 0;
    transition: all 0.4s;
  }
  &:hover {
    &::before {
      width: 100%;
      opacity: 1;
      transition: all 0.4s;
    }
  }
}

.about-app-description {
  font-size: 14px;
  color: @text-color;
  pre {
    font-size: 14px;
  }
}

.hide-input {
  position: fixed;
  z-index: -9999;
  opacity: 0;
  // width: 0;
  height: 0;
  overflow: hidden;
}

.gray-text {
  color: @disabled-color;
  cursor: auto;
  &::before {
    display: none;
  }
}
</style>
