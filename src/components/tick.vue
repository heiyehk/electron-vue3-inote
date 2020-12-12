<template>
  <transition>
    <div v-if="modelValue" class="tick"></div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onBeforeUpdate } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    onBeforeUpdate(() => {
      // 防止emit更新数据的时候继续刷新
      if (props.modelValue) {
        setTimeout(() => {
          emit('update:modelValue', false);
        }, props.duration);
      }
    });
    return {};
  }
});
</script>

<style lang="less" scoped>
.tick {
  position: relative;
  overflow: hidden;
  width: 0;
  height: 20px;
  box-sizing: border-box;
  animation: show 0.4s forwards;
  margin-left: 10px;
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 3px;
    position: absolute;
    background-color: @success-color;
    transform: rotate(45deg);
    top: 10px;
    left: 1px;
  }
  &::after {
    content: '';
    display: block;
    width: 16px;
    height: 3px;
    position: absolute;
    background-color: @success-color;
    transform: rotate(-45deg);
    top: 8px;
    left: 3px;
  }
}
@keyframes show {
  form {
    width: 0;
    opacity: 0;
  }
  to {
    width: 20px;
    opacity: 1;
  }
}
</style>
