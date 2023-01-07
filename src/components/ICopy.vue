<template>
  <div class="flex-items">
    <a class="link-style" href="javascript:void(0)" @click="copyText">
      <slot></slot>
    </a>
    <ITick v-model="copyStatus" :duration="1000" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ITick from './ITick.vue';

const props = defineProps({
  copyText: {
    type: String,
    default: ''
  }
});
const copyStatus = ref(false);

const copyText = () => {
  if (copyStatus.value) return;
  copyStatus.value = true;
  navigator.clipboard.writeText(props.copyText);
};
</script>

<style lang="less" scoped>
.hide-input {
  position: fixed;
  z-index: -9999;
  opacity: 0;
  height: 0;
  overflow: hidden;
}
</style>
