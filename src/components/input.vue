<template>
  <div class="hy-input flex">
    <div class="hy-input-box flex1">
      <input maxlength="4" readonly v-model="inputValue" />
    </div>
    <div class="hy-number-control flex">
      <div class="hy-number-control-add hy-number-button" @click="calculateDelay('add')">
        <i class="iconfont icon-arrow-up"></i>
      </div>
      <div class="hy-number-control-sub hy-number-button" @click="calculateDelay('sub')">
        <i class="iconfont icon-arrow-down"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      default: 1000
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    let inputValue = ref('1000');
    inputValue.value = String(props.modelValue);

    const calculateDelay = (type: 'add' | 'sub') => {
      const numberInput = Number(inputValue.value);
      if (isNaN(numberInput)) return;
      let afterNumber = 0;
      switch (type) {
        case 'add':
          if (numberInput === 1000) return;
          afterNumber = numberInput + 300;
          break;
        case 'sub':
          if (numberInput === 100) return;
          afterNumber = numberInput - 300;
          break;
      }
      inputValue.value = String(afterNumber);
      emit('update:modelValue', afterNumber);
    };

    return {
      inputValue,
      calculateDelay
    };
  }
});
</script>

<style lang="less" scoped>
.hy-input {
  border: 1px solid @border-color;
  height: 24px;
  border-radius: 4px;
  &-box {
    input {
      border-radius: 4px;
      width: 100%;
      height: 100%;
      padding: 0 10px;
      border: none;
      box-sizing: border-box;
      display: block;
      cursor: auto;
    }
  }
  .hy-number-control {
    flex-direction: column;
    border-left: 1px solid @border-color;
    .hy-number-button {
      width: 30px;
      position: relative;
      height: 12px;
      cursor: pointer;
      &:hover {
        background-color: @background-color;
      }
      &:first-child::before {
        content: '';
        width: 100%;
        height: 1px;
        background-color: @border-color;
        bottom: -0.5px;
        position: absolute;
        z-index: 1;
      }
    }
    .iconfont {
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
