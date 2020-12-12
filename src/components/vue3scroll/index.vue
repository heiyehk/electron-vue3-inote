<template>
  <div class="scrollbar" ref="scrollbar" :style="scrollbarStyle">
    <div class="thumb" ref="thumb" @mousedown="thumbDown" @mouseup="thumbUp"></div>
  </div>
</template>

<script lang="ts">
import { ComponentInternalInstance, defineComponent, getCurrentInstance, onMounted, Ref, ref } from 'vue';

export default defineComponent({
  setup() {
    const vm = getCurrentInstance() as ComponentInternalInstance;
    let scrollbar: Ref<HTMLDivElement>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let thumb: Ref<HTMLDivElement>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let scrollbarParent: Ref<HTMLElement>;
    const scrollbarStyle = ref('');

    onMounted(() => {
      scrollbar = ref(vm.refs.scrollbar as HTMLDivElement);
      thumb = ref(vm.refs.thumb as HTMLDivElement);
      getParentInfo();
      // window.onresize = (e: Event) => {
      //   console.log(e);
      //   getParentInfo();
      // };
    });

    const getParentInfo = () => {
      scrollbarParent = ref(scrollbar.value?.parentElement as HTMLElement);
      const { clientHeight } = scrollbar.value?.parentElement as HTMLElement;
      scrollbarStyle.value = `height: ${clientHeight}px;display: block;`;
    };

    const thumbDown = (ed: MouseEvent) => {
      console.log(ed);
      document.onmousemove = (em: MouseEvent) => {
        console.log(em);
      };
    };

    document.onmouseup = function() {
      document.onmousemove = null;
    };

    const thumbUp = () => {
      console.log('up');
    };

    return {
      getParentInfo,
      scrollbarStyle,
      thumbDown,
      thumbUp
    };
  }
});
</script>

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
