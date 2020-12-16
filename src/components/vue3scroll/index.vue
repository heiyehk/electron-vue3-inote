<template>
  <div class="scrollbar" ref="scrollbar">
    <div class="thumb" ref="thumb"></div>
  </div>
</template>

<style lang="less" scoped>
.scrollbar {
  position: fixed;
  width: 6px;
  height: 100%;
  right: 0px;
  bottom: 0;
  z-index: 5;
  padding-right: 4px;
  display: none;
  transition: all 0.2s;
  .thumb {
    width: 2;
    width: 2px;
    height: 40%;
    background-color: #7a7a7a;
    border-radius: 4px;
    cursor: pointer;
    right: 4px;
    position: absolute;
    transition: all 0.2s;
    &:hover {
      background-color: #bababa !important;
    }
    &:active {
      background-color: #7a7a7a !important;
    }
  }
  &:hover {
    width: 14px;
    right: 0;
    padding-right: 0px;
    background-color: #f1f1f1;
    transition: all 0.2s;
    .thumb {
      border-radius: 0;
      width: 100%;
      right: 0;
    }
  }
}
</style>
