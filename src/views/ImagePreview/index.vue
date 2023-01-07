<template>
  <div class="image-preview">
    <IHeader />
    <div class="image-warp flex-center">
      <img :src="imageSrc" />
    </div>
  </div>
</template>

<script setup lang="ts">
import IHeader from '@/components/IHeader.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const imageSrc = route.query.src as string;
</script>

<style lang="less" scoped>
.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .image-warp {
    position: absolute;
    width: 100%;
    height: calc(100% - 40px);
    overflow: hidden;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    img {
      display: block;
      max-width: 100%;
      max-height: 100%;
      box-shadow: 0 0 4px #ececec;
    }
  }
}
</style>
