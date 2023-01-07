<template>
  <div class="block">
    <p class="block-title">{{ props.title }}</p>
    <div class="block-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});
</script>

<style lang="less" scoped>
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
</style>
