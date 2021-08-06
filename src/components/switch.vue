<template>
  <!-- #ff9900 warning -->
  <!-- electron+vue3有个坑，直接传入style无法渲染 -->
  <!-- role辅助工具 aria-checked辅助信息 -->
  <div
    class="hy-switch flex-items"
    :class="[checkedStatus ? 'active' : '', disabled ? 'hy-switch-disabled' : '']"
    role="switc"
    :aria-checked="checkedStatus"
    :style="styled"
  >
    <input v-model="checkedStatus" type="checkbox" true-value="true" false-value="false" />
    <div class="hy-switch-core" @click="checkStatus">
      <span class="hy-switch-action"></span>
    </div>
    <span class="hy-switch-checked-text">{{ checkedStatus ? '开' : '关' }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    styled: String,
    disabled: Boolean
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const checkedStatus = ref(props.modelValue);

    const checkStatus = () => {
      if (props.disabled) return;
      checkedStatus.value = !checkedStatus.value;
      emit('update:modelValue', checkedStatus.value);
    };

    return {
      checkedStatus,
      checkStatus
    };
  }
});
</script>

<style lang="less" scoped>
@switchSize: 20px;
@gap: 4px;

.hy-switch {
  position: relative;
  height: @switchSize;
  input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
  }
  &-core {
    border-radius: 10px;
    background-color: @gray-color !important;
    width: 40px;
    height: 100%;
    cursor: pointer;
    transition: background-color 0.4s;
    &:active {
      .hy-switch-action {
        width: @switchSize;
        transition: width 0.4s;
      }
    }
  }
  &-action {
    width: @switchSize - @gap;
    height: @switchSize - @gap;
    background-color: #fff;
    position: absolute;
    border-radius: 100%;
    top: 50%;
    margin-top: -((@switchSize / 2) - (@gap / 2));
    transform: translateX(@gap / 2);
    transition: all 0.4s;
  }
  &-checked-text {
    font-size: 12px;
    margin-left: 4px;
    color: @text-sub-color;
  }
}

.active {
  .hy-switch-core {
    background-color: @success-color !important;
    transition: background-color 0.4s;
    &:active {
      .hy-switch-action {
        width: @switchSize;
        transition: all 0.4s;
        transform: translateX(@switchSize - 4px);
      }
    }
  }
  .hy-switch-action {
    transition: all 0.4s;
    transform: translateX(@switchSize);
  }
  .hy-switch-checked-text {
    color: @success-color !important;
  }
}

.hy-switch-disabled .hy-switch-core {
  cursor: no-drop;
  &:active .hy-switch-action {
    width: 16px !important;
  }
}
</style>
