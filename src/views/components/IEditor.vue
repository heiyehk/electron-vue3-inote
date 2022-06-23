<template>
  <div class="editor-markdown vditor" :class="className" ref="editorRef"></div>
  <div>{{ props.modelValue }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

const toolbar: IMenuItem[] = [
  {
    name: 'bold',
    icon: '<i class="iconfont icon-editor-bold"></i>'
  },
  {
    name: 'italic',
    icon: '<i class="iconfont icon-italic"></i>'
  },
  {
    name: 'line',
    icon: '<i class="iconfont icon-underline"></i>'
  },
  {
    name: 'strike',
    icon: '<i class="iconfont icon-strikethrough"></i>'
  },
  {
    name: 'list',
    icon: '<i class="iconfont icon-ul"></i>'
  },
  {
    name: 'list',
    icon: '<i class="iconfont icon-ol"></i>'
  },
  {
    name: 'code',
    icon: '<i class="iconfont icon-code"></i>'
  }
];

const props = defineProps({
  // 返回markdown
  modelValue: {
    type: String,
    default: ''
  },
  // 返回html
  content: {
    type: String,
    default: ''
  },
  className: String,
  getHtml: {
    type: Function
  }
});
const emits = defineEmits(['on-input', 'update:modelValue']);
const editorRef = ref();
const vditor = ref<Vditor>();

const loadVditor = () => {
  vditor.value = new Vditor(editorRef.value as HTMLElement, {
    cache: {
      enable: false
    },
    toolbar,
    undoDelay: 0,
    value: props.modelValue,
    placeholder: '记笔记...',
    input: value => {
      emits('on-input', vditor.value?.getHTML(), value);
      emits('update:modelValue', value);
    },
    // cdn: './',
    after: () => {
      vditorLoad();
    }
  });
};

onMounted(() => {
  loadVditor();
});

const vditorLoad = () => {
  vditor.value?.setValue(props.modelValue);
  vditor.value?.focus();
  // vditor的内容容器
  const editorContainer = document.querySelector('.vditor-ir .vditor-reset');
  const editorScrollHeight = editorContainer?.scrollHeight ?? 0;
  editorContainer!.scrollTop = editorScrollHeight;
};
</script>

<style lang="less" scoped>
.editor-markdown {
  border: none;
  width: 100% !important;
  height: 100% !important;
  flex-direction: column-reverse;
}
&:deep(.vditor-toolbar) {
  padding: 0 !important;
  background-color: transparent;
  border-bottom: none;
  height: 40px;
  position: relative;
  top: 0;
  transition: top 0.4s, height 0.4s;
  .vditor-toolbar__item {
    width: 40px;
    height: 40px;
    max-height: 40px;
    max-width: 40px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vditor-tooltipped,
  .vditor-tooltipped__s {
    padding: 0;
    width: 100%;
    height: 100%;

    &:hover {
      color: #000;
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
&:deep(.vditor-menu--current) {
  color: #000 !important;
  background-color: rgba(0, 0, 0, 0.1) !important;
}
&:deep(.vditor-ir pre.vditor-reset) {
  background-color: transparent;
}
// 加粗 **
&:deep(.vditor-ir__node--expand .vditor-ir__marker--bi) {
  color: #000;
}
// 标题 #
&:deep(.vditor-ir__node--expand .vditor-ir__marker--heading) {
  color: #000;
}
</style>
