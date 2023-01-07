<template>
  <div class="block-line">
    <div class="flex-items">
      <span>{{ props.title }}</span>
      <span class="flex1" :class="props.isLink ? 'link-style' : ''">
        <slot name="default"></slot>
      </span>
    </div>
    <div class="gray-text" v-tip="notesState.switchStatus.textTip">
      <slot name="desc"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { notesState } from '@/store/notes.state';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isLink: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang="less" scoped>
.block-line {
  font-size: 14px;
  margin-bottom: 14px;
  transition: all 0.4s;

  .iconfont {
    font-size: 20px;
    margin-right: 6px;
  }

  &:last-child {
    margin-bottom: 0 !important;
    transition: all 0.4s;
  }

  .undeveloped {
    display: none;
  }
}

.disabled-line {
  color: @text-sub-color;

  .undeveloped {
    display: block;
    margin-right: 20px;
  }
}
</style>
