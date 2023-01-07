<template>
  <div class="options-container" :class="props.showState ? 'options-show' : ''">
    <div class="options-cover" @click="emits('onClose')"></div>
    <div class="options-content">
      <ul class="colors flex-between">
        <template v-for="item in classNames" :key="item.className">
          <li class="flex1" :title="item.title" :class="item.className" @click="emits('onChange', item.className)"></li>
        </template>
      </ul>
      <p class="back-list" @click="openNotesList">
        <i class="iconfont icon-list"></i>
        <span>笔记列表</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { browserWindowOption, classNames } from '@/config';
import { BrowserWindow, ipcRenderer } from 'electron';
import { createBrowserWindow } from '@/utils';
import { onMounted, onUnmounted } from 'vue';

const emits = defineEmits(['onChange', 'onOpen', 'onClose']);
const props = defineProps({
  showState: {
    type: Boolean,
    default: false
  }
});
let childrenWindow: BrowserWindow | null;

/** 打开主页列表 */
const openNotesList = () => {
  let indexShowStatus = false;

  // 判断列表窗口是否存在
  ipcRenderer.send('whetherToOpen');
  ipcRenderer.on('getWhetherToOpen', () => {
    indexShowStatus = true;
    return;
  });
  emits('onOpen', false);

  if (childrenWindow) {
    childrenWindow = null;
  }

  setTimeout(() => {
    // 如果窗口不在
    if (!indexShowStatus) {
      childrenWindow = createBrowserWindow(browserWindowOption(), '/');
    }
  }, 100);
};

const listenerESCHandle = (e: KeyboardEvent) => {
  if (props.showState) {
    const keyCode = e.code;
    if (keyCode === 'Escape') {
      emits('onClose');
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', listenerESCHandle);
});

onUnmounted(() => {
  document.removeEventListener('keydown', listenerESCHandle);
});
</script>

<style lang="less" scoped>
.options-container {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: z-index 0.4s;

  .options-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 0;
    bottom: 0;
    left: 0;
    transition: all 0.4s;
  }

  .options-content {
    position: absolute;
    width: 100%;
    z-index: 2;
    top: -300px;
    box-shadow: 0 0 4px @border-color;
    transition: top 0.4s;
    background-color: @white-color;
  }

  .colors {
    height: 50px;
    width: 100%;

    li {
      list-style: none;
      height: 100%;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      &:hover {
        &::before {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    }

    .black-content:hover {
      &::before {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .back-list {
    width: 100%;
    height: 50px;
    font-size: 16px;
    line-height: 50px;
    color: #333;
    display: block;
    padding: 0 10px;

    .iconfont {
      margin-right: 10px;
    }

    &:hover {
      background-color: @background-sub-color;
    }

    &:active {
      background-color: @background-color;
    }
  }
}

.options-show {
  z-index: 3;
  transition: z-index 0.4s;

  .options-content {
    top: 0;
    transition: top 0.4s;
  }

  .options-cover {
    z-index: 1;
    opacity: 1;
    transition: all 0.4s;
  }
}
</style>
