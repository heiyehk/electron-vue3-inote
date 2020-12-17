<template>
  <div
    ref="editor"
    class="editor-layout module-editor empty-content"
    contenteditable
    v-html="modelValue"
    spellcheck="false"
    placeholder="记笔记..."
    @paste.prevent="pasteHa"
    @input="changeEditorContent"
  ></div>
  <section class="bottom-editor-tools">
    <template v-for="item in bottomIcons" :key="item.name">
      <button class="icon" :title="item.title" @click="editorIconHandle($event, item.name)">
        <i class="iconfont" :class="item.icon"></i>
      </button>
    </template>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { debounce } from '@/utils';
import { editorIcons } from '@/config';

export default defineComponent({
  props: {
    modelValue: String
  },
  emits: ['update:modelValue', 'on-input'],
  setup(props, { emit }) {
    const editor = ref();
    const bottomIcons = editorIcons;
    const editorContent = ref('');

    watch(props, () => {
      console.log(props.modelValue);
      editorContent.value = props.modelValue as string;
    });

    onMounted(() => {
      editor.value.focus();
    });

    const editorIconHandle = (e: Event, name: string) => {
      e.preventDefault();
      document.execCommand(name, false);
    };

    const changeEditorContent = debounce((e: InputEvent) => {
      const editorHtml = (e.target as Element).innerHTML;
      emit('on-input', editorHtml);
    });

    const paste = (e: ClipboardEvent) => {
      const pasteText = e.clipboardData?.getData('text/plain');
      document.execCommand('insertText', false, pasteText);
      console.log(editor.value);
    };

    return {
      editor,
      editorIconHandle,
      bottomIcons,
      changeEditorContent,
      paste,
      editorContent
    };
  }
});
</script>

<style lang="less" scoped>
.editor-layout {
  width: 100%;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  outline: none;
  font-size: 14px;
  line-height: 1.8;
  overflow-y: auto;
  overflow-x: hidden;
  * {
    font-size: 14px;
    line-height: 1.8;
    word-break: break-all;
  }
  div {
    max-width: 100%;
    overflow-x: auto;
    word-break: break-all;
  }
  span {
    max-width: 100%;
    word-break: break-all;
  }
}

.bottom-editor-tools {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: @iconSize;
  background-color: transparent;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
}
</style>
