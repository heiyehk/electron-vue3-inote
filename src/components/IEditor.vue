<template>
  <div class="editor-markdown vditor" :class="className" ref="editorRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, nextTick, watch } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

const props = defineProps({
  value: String,
  content: {
    type: String,
    default: ''
  },
  className: String,
  windowBlur: {
    type: Boolean,
    default: true
  },
  windowLock: {
    type: Boolean,
    default: true
  }
});
const emits = defineEmits(['on-input', 'update:value']);
const editorRef = ref();
const firstIn = ref(true);
const vditor = ref<Vditor>();

onMounted(() => {
  /*
   * 'emoji', // 表情 CTRL+E
   * 'headings', // 标题 ALT+CTRL+（1-6）
   * 'bold', // 加粗 CTRL+B
   * 'italic', // 下划线 CTRL+I
   * 'strike', // 删除线 CTRL+D
   * 'line', // 分割线 CTRL+SHIFT+H
   * 'quote', // 引用 CTRL+;
   * 'list', // 无序列表 CTRL+L
   * 'ordered-list', // 有序列表 CTRL+O
   * 'check', // 任务列表 CTRL+J
   * 'outdent', // 列表反向缩进 CTRL+SHIFT+I
   * 'indent', // 列表缩进 CTRL+SHIFT+O
   * 'code', // 代码块 CTRL+U
   * 'inline-code', // 行内代码 CTRL+G
   * 'insert-after', // 末尾插入行 CTRL+SHIFT+E
   * 'insert-before', // 起始插入行 CTRL+SHIFT+B
   * 'undo', // 撤销 CTRL+Z
   * 'redo', // 重做 CTRL+Y
   * 'upload', // 上传图片或文件
   * 'link', // 链接 CTRL+K
   * 'table', // 表格 CTRL+M
   * 'record', // 录音
   *  //
   *  // 切换编辑模式
   *  // 所见即所得 ALT+CTRL+7
   *  // 即时渲染 ALT+CTRL+8
   *  //分屏渲染 ALT+CTRL+9
   * 'edit-mode',
   * 'preview', // 预览
   * 'fullscreen', // 全屏 CTRL+`
   * 'outline', // 大纲
   * 'code-theme', // 代码块
   * 'content-theme', // 内容
   * 'export', // 导出
   * 'devtools', // 开发者工具
   * 'info', // 关于
   * 'help' // 帮助
   */
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
  vditor.value = new Vditor(editorRef.value as HTMLElement, {
    cache: {
      enable: false
    },
    toolbar,
    undoDelay: 0,
    value: props.content,
    placeholder: '记笔记...',
    input: value => {
      emits('on-input', vditor.value?.getHTML(), value);
    },
    // cdn: './',
    after: () => {
      vditorLoad();
    }
  });
});

const vditorLoad = () => {
  vditor.value?.setValue(props.content);
  vditor.value?.focus();
  console.log(editorRef.value);
  // editorRef.value?.scrollTo(0, editorRef.value.scrollHeight);
};
</script>

<style lang="less" scoped>
.editor-markdown {
  border: none;
  height: 100%;
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
