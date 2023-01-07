<template>
  <div class="hy-input flex">
    <div class="hy-input-box flex1">
      <input
        :maxlength="props.maxlength"
        :disabled="props.disabled"
        :readonly="props.readonly"
        v-model="inputValue"
        @input="changeInput"
      />
    </div>
    <div class="hy-number-control flex" v-if="control">
      <div
        class="hy-number-control-add hy-number-button"
        :class="modelValue === max || disabled ? 'disabled' : ''"
        @click="disabled ? '' : calculateDelay('add')"
      >
        <i class="iconfont icon-arrow-up"></i>
      </div>
      <div
        class="hy-number-control-sub hy-number-button"
        :class="modelValue === min || disabled ? 'disabled' : ''"
        @click="disabled ? '' : calculateDelay('sub')"
      >
        <i class="iconfont icon-arrow-down"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  min: Number,
  max: Number,
  control: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disabled: Boolean,
  type: {
    type: String,
    default: 'text'
  },
  maxlength: String
});

const emits = defineEmits(['update:modelValue', 'on-change', 'on-input']);

let inputValue = ref();

if (props.type === 'number') {
  inputValue.value = String(props.modelValue);
} else {
  inputValue.value = props.modelValue || '';
}

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
  emits('update:modelValue', afterNumber);
  emits('on-change', afterNumber);
};

const changeInput = () => {
  emits('update:modelValue', inputValue.value);
  emits('on-input', inputValue.value);
};
</script>

<style lang="less" scoped>
.hy-input {
  border: 1px solid @border-color;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;

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
      background-color: transparent;
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

    .disabled {
      cursor: no-drop;
      background-color: @background-sub-color;
      color: @text-sub-color;
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
