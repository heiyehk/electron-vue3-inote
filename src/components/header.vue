<template>
  <header class="header flex-between">
    <template v-if="currentRouteName === 'setting'">
      <button class="icon flex-center" title="返回">
        <router-link class="flex-center" to="/">
          <i class="iconfont flex-center icon-back"></i>
        </router-link>
      </button>
    </template>
    <template v-else>
      <!-- 打开新窗口 -->
      <button class="icon flex-center" @click="openNewWindow" title="新窗口">
        <i class="iconfont flex-center icon-add"></i>
      </button>
    </template>
    <!-- 标题拖动 -->
    <div class="drag-header flex1 flex-center" :style="computedPaddingLeft">
      <template>
        <transition name="header-fadein">
          <span :key="title">{{ title }}</span>
        </transition>
      </template>
    </div>
    <!-- 右侧操作 -->
    <div class="operation-btn flex-items">
      <!-- 设置 -->
      <template v-if="currentRouteName === 'index'">
        <button class="icon flex-center" title="设置">
          <router-link class="flex-center" to="/setting">
            <i class="iconfont flex-center icon-setting"></i>
          </router-link>
        </button>
      </template>
      <template v-else-if="currentRouteName === 'editor'">
        <div class="flex-items">
          <!-- 固定 -->
          <div class="thepin" :class="isAlwaysOnTop ? 'thepin-active' : ''">
            <div class="absolute-box">
              <button class="icon flex-center" @click="drawingPin" title="置顶">
                <i class="iconfont flex-center icon-thepin"></i>
              </button>
              <button class="icon flex-center" @click="drawingPin" title="取消置顶">
                <i class="iconfont flex-center icon-thepin-active"></i>
              </button>
            </div>
          </div>
          <!-- 更多 -->
          <button class="icon flex-center" @click="clickOptions" title="选项">
            <i class="iconfont flex-center icon-more"></i>
          </button>
        </div>
      </template>
      <!-- 关闭 -->
      <button class="icon flex-center close-window" @click="closeWindow" title="关闭">
        <i class="iconfont flex-center icon-close"></i>
      </button>
    </div>
  </header>
</template>

<script lang="ts">
import { BrowserWindow, remote } from 'electron';
import { computed, defineComponent, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { browserWindowOption, winURL } from '@/config';

export default defineComponent({
  emits: ['option-click', 'on-close'],
  setup(props, { emit }) {
    let childrenWindow: BrowserWindow | null;
    const editorWinOptions = browserWindowOption('editor');
    // 打开新窗口
    const openNewWindow = () => {
      childrenWindow = new remote.BrowserWindow(editorWinOptions);

      if (process.env.NODE_ENV === 'development') {
        childrenWindow.webContents.openDevTools();
      }
      childrenWindow.loadURL(`${winURL}/#/editor`);
      childrenWindow.on('closed', () => {
        childrenWindow = null;
      });
    };

    // 获取窗口固定状态
    let isAlwaysOnTop = ref(false);
    const currentWindow = remote.getCurrentWindow();
    isAlwaysOnTop.value = currentWindow.isAlwaysOnTop();

    // 固定前面
    const drawingPin = () => {
      if (isAlwaysOnTop.value) {
        currentWindow.setAlwaysOnTop(false);
        isAlwaysOnTop.value = false;
      } else {
        currentWindow.setAlwaysOnTop(true);
        isAlwaysOnTop.value = true;
      }
    };

    const currentRouteName = ref(useRoute().name);

    // 获取首页的内边距
    const computedPaddingLeft = computed(() => {
      return currentRouteName.value === 'index' ? 'padding-left: 40px;' : '';
    });

    const title = ref(useRoute().meta.title);

    onBeforeRouteUpdate((to, from, next) => {
      title.value = to.meta.title;
      currentRouteName.value = to.name;
      next();
    });

    const clickOptions = () => {
      emit('option-click');
    };

    // 关闭窗口
    const closeWindow = () => {
      emit('on-close');
      document.querySelector('#app')?.classList.remove('app-show');
      document.querySelector('#app')?.classList.add('app-hide');
      remote.getCurrentWindow().close();
    };

    return {
      openNewWindow,
      currentRouteName,
      drawingPin,
      clickOptions,
      closeWindow,
      computedPaddingLeft,
      isAlwaysOnTop,
      title
    };
  }
});
</script>

<style lang="less" scoped>
@headerHeight: 40px;

.header-fadein-enter,
.header-fadein-leave-to {
  display: none;
  opacity: 0;
  animation: header-fadein 0.4s reverse;
}
.header-fadein-enter-active,
.header-fadein-leave-active {
  opacity: 0;
  animation: header-fadein 0.4s;
}

@keyframes header-fadein {
  from {
    opacity: 0;
    margin-right: -14px;
  }
  to {
    opacity: 1;
    margin-right: 0;
  }
}

.header {
  height: @headerHeight;
  background-color: #fff;
  button {
    padding: 0;
    outline: none;
    border: none;
    background-color: transparent;
  }
  a {
    color: initial;
    width: 100%;
    height: 100%;
    outline: none;
  }
  .icon {
    width: @headerHeight;
    height: @headerHeight;
    .iconfont {
      font-size: 24px;
      width: 22px;
      position: relative;
      padding-bottom: 2px;
    }
  }
  .close-window:hover {
    background-color: @error-color;
    color: #fff;
  }
  @keyframes fades {
    30% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .drag-header {
    -webkit-app-region: drag;
    height: 36px;
    margin-top: 5px;
    padding-bottom: 5px;
    color: @text-sub-color;
    font-size: 15px;
    font-weight: bold;
    box-sizing: border-box;
  }
}
.thepin {
  width: 40px;
  height: 40px;
  overflow: hidden;
  position: relative;
  transition: all 0.4s;
  .absolute-box {
    position: absolute;
    top: 0;
    transition: all 0.4s;
  }
}
.thepin-active .absolute-box {
  top: -40px;
}
</style>
