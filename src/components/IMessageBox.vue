<template>
  <div class="hy-message-box" v-if="props.modelValue">
    <div class="hy-message-box-cover"></div>
    <div class="hy-message-box-content flex">
      <div class="hy-message-box-close" @click="onClose">
        <i class="iconfont flex-center icon-close"></i>
      </div>
      <div class="hy-message-box-text flex1">
        <slot></slot>
      </div>
      <div class="hy-message-box-botton flex-between">
        <button class="hy-message-box-botton-confirm flex1" @click="onConfirm">确认</button>
        <button class="hy-message-box-botton-cancel flex1" @click="onCancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['update:modelValue', 'on-confirm', 'on-cancel', 'on-close']);

const onConfirm = () => {
  emits('on-confirm');
  emits('update:modelValue', false);
};

const onCancel = () => {
  emits('on-cancel');
  emits('update:modelValue', false);
};

const onClose = () => {
  emits('on-close');
  emits('update:modelValue', false);
};
</script>

<style lang="less" scoped>
.hy-message-box {
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  &-cover {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
  }

  &-content {
    position: absolute;
    width: 260px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: @white-color;
    border-radius: 4px;
    flex-direction: column;
    box-shadow: 0 0 10px @shadown-color;
  }

  &-close {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;

    .iconfont {
      font-size: 20px;
    }

    &:hover {
      background-color: @background-sub-color;
    }
  }

  &-text {
    font-size: 15px;
    padding: 34px 20px 20px;
  }

  &-botton {
    height: 36px;
    border-top: 1px solid @border-color;

    button {
      border: none;
      background-color: transparent;
      font-size: 15px;
      text-align: center;
      height: 100%;
      line-height: 36px;
      cursor: pointer;

      &:hover {
        background-color: @background-sub-color;
      }
    }

    &-cancel {
      color: @text-sub-color;
    }
  }
}
</style>
