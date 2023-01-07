<template>
  <div class="header-drag-bar" ref="headerDragBarRef"></div>
</template>

<script lang="ts" setup>
// 这个主要是用来在沉浸模式下拖拽的
import { throttle } from '@/utils';
import { onMounted, ref } from 'vue';

const headerDragBarRef = ref<null | HTMLDivElement>(null);

onMounted(() => {
  document.addEventListener(
    'mousemove',
    throttle((e: MouseEvent) => {
      if (e.clientY <= 20) {
        headerDragBarRef.value?.classList.remove('hide-drag-bar');
        headerDragBarRef.value?.classList.add('show-drag-bar');
      } else {
        headerDragBarRef.value?.classList.add('hide-drag-bar');
        headerDragBarRef.value?.classList.remove('show-drag-bar');
      }
    }, 50)
  );
});
</script>

<style scoped lang="less">
.header-drag-bar {
  position: fixed;
  top: -14px;
  width: 100%;
  height: 14px;
  background-color: rgba(102, 102, 102, 1);
  cursor: all-scroll;
  -webkit-app-region: drag;
  transition: all 0.4s;
  box-shadow: 0 0 8px 2px #ccc;
}

.show-drag-bar {
  z-index: 1 !important;
  top: 0px;
  transition: all 0.4s;
}

.hide-drag-bar {
  z-index: -1 !important;
  top: -14px;
  transition: all 0.4s;
}
</style>
