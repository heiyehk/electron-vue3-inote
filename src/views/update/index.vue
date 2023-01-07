<template>
  <div class="progress">
    <el-progress type="circle" :percentage="percentage" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ipcRenderer } from 'electron';
const percentage = ref(0);

onMounted(() => {
  ipcRenderer.on('downloadProgress', (e, arg) => {
    percentage.value = parseInt(arg.percent);
  });
});
</script>
<style lang="less" scoped>
.progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
