<template>
  <!-- 编辑 -->
  <div
    ref="editor"
    class="editor-layout module-editor empty-content"
    :class="className"
    contenteditable
    v-html="editorContent"
    spellcheck="false"
    placeholder="记笔记..."
    @paste.prevent="paste"
    @input="changeEditorContent"
  ></div>
  <!-- 功能 -->
  <section class="bottom-editor-tools" :class="bottomClass">
    <template v-for="item in bottomIcons" :key="item.name">
      <button class="icon" :title="item.title" @click="editorIconHandle($event, item.name)">
        <i class="iconfont" :class="item.icon"></i>
      </button>
    </template>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref, Ref, watch } from 'vue';
import { debounce } from '@/utils';
import { editorIcons } from '@/config';
import { notesState } from '@/store/notes.state';

export default defineComponent({
  props: {
    value: String,
    content: String,
    className: String,
    windowBlur: {
      type: Boolean,
      default: true
    },
    windowLock: {
      type: Boolean,
      default: true
    }
  },
  emits: ['on-input', 'update:value'],
  setup(props, { emit }) {
    let editor: Ref<HTMLDivElement | null> = ref(null);
    const bottomIcons = editorIcons;
    const editorContent: Ref<string | undefined> = ref('');
    const firstIn = ref(true);

    watch(
      () => props.content,
      newContent => {
        if (!editorContent.value) {
          editorContent.value = newContent;
        }
        // 判断是否第一次进入
        if (firstIn.value) {
          firstHandle();
        }
      }
    );
    const bottomClass = computed(() => {
      const classArr = [];
      if (props.windowBlur) {
        classArr.push('window-blur-hide');
      } else {
        if (props.windowLock) {
          // 当锁上的时候，编辑器任然处于失去焦点的情况
          // 需要解锁才能正常
          classArr.push('window-blur-hide');
        }
      }
      return classArr;
    });

    // 第一次进入事件
    const firstHandle = () => {
      nextTick(() => {
        focus();
        editor.value?.scrollTo(0, editor.value.scrollHeight);
        firstIn.value = false;
      });
    };

    onMounted(() => {
      focus();
    });

    const focus = () => {
      const range = document.createRange();
      range.selectNodeContents(editor.value as HTMLDivElement);
      range.collapse(false);
      const selecton = window.getSelection() as Selection;
      selecton.removeAllRanges();
      selecton.addRange(range);
    };

    const editorIconHandle = (e: Event, name: string) => {
      e.preventDefault();
      document.execCommand(name, false);
    };

    const changeEditorContent = debounce((e: InputEvent) => {
      const editorHtml = (e.target as Element).innerHTML;
      emit('on-input', editorHtml);
    }, notesState.value.syncDelay);

    const paste = (e: ClipboardEvent) => {
      const pasteText = e.clipboardData?.getData('text/plain');
      const setText = (text?: string) => {
        document.execCommand('insertText', false, text);
      };
      const interceptPoint = 100000;
      // 做超长文本处理
      // TODO
      const len = pasteText!.length;
      if (!len) return;
      if (len < interceptPoint) {
        setText(pasteText);
      } else {
        const count = Math.ceil(len / interceptPoint);
        let control = 0;
        let interval: any = setInterval(() => {
          let text = '';
          if (control === 0) {
            text = pasteText!.substring(0, (control + 1) * interceptPoint);
          } else if (control !== 0 && control !== count) {
            text = pasteText!.substring(control * interceptPoint, (control + 1) * interceptPoint);
          }
          setText(text);
          if (control >= count) {
            text = '';
            clearInterval(interval);
            interval = null;
            editor.value?.scrollTo(0, editor.value.scrollHeight);
          }
          control++;
        }, 100);
      }
    };

    return {
      editor,
      editorIconHandle,
      bottomIcons,
      changeEditorContent,
      paste,
      editorContent,
      bottomClass
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
  transition: bottom 0.4s;
}

.black-content::before {
  color: @gray-color;
}
.window-blur-hide {
  bottom: -41px;
  transition: bottom 0.4s;
}
</style>
