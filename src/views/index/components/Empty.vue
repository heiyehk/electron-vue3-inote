<template>
  <div
    class="index-empty-container flex"
    :style="props.state === 2 ? 'cursor: pointer;' : 'cursor: default;'"
    @dblclick="emits('onDblclick')"
  >
    <div class="index-empty-content">
      <div class="index-empty-content-text" style="margin-top: 0;margin-bottom: 40px;height: 20px;">
        {{ props.state === 2 ? '双击此处，或' : '' }}
      </div>
      <div class="index-empty-content-img">
        <img src="../../../assets/empty-content.svg" />
      </div>
      <div class="index-empty-content-text">{{ props.content ? props.content : '点击上方“+”按钮创建' }}</div>
      <template v-if="props.state === 2">
        <div class="index-empty-content-text" style="margin-top: 4px;">新的便笺内容</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  state: {
    type: Number,
    default: 0
  },
  content: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['onDblclick']);
</script>

<style lang="less" scoped>
.index-empty-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
  justify-content: center;
  padding-top: 70px;
  box-sizing: border-box;

  .index-empty-content {
    width: 170px;

    &-img {
      width: 74%;
      margin: 0 auto;

      img {
        display: block;
        width: 100%;
      }
    }

    &-text {
      font-size: 14px;
      color: @text-color;
      margin-top: 40px;
      text-align: center;
    }
  }
}
</style>
