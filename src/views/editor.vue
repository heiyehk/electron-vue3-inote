<template>
  <Header class="header-editor" :class="headerClass" @option-click="clickOption" @on-close="closeWindow" />
  <div class="options-container" :class="showOptionsStatus ? 'options-show' : ''">
    <div class="options-cover" @click="showOptionsStatus = false"></div>
    <div class="options-content">
      <ul class="colors flex-between">
        <template v-for="item in classNames" :key="item.className">
          <li class="flex1" :title="item.title" :class="item.className" @click="changeBgClassName(item.className)"></li>
        </template>
      </ul>
      <p class="back-list" @click="openIndex">
        <i class="iconfont icon-list"></i>
        <span>笔记列表</span>
      </p>
    </div>
  </div>
  <main class="page-editor" :class="pageClass">
    <section class="editor-container">
      <Editor
        :windowBlur="currentWindowBlurState"
        :windowLock="lockState"
        :content="editContent"
        :className="currentBgClassName"
        @on-input="changeEditContent"
      />
    </section>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, defineAsyncComponent, onBeforeMount, ref } from 'vue';
import { BrowserWindow, remote, ipcRenderer } from 'electron';
import { useRoute, useRouter } from 'vue-router';

import { browserWindowOption, classNames } from '@/config';
import { uuid } from '@/utils';
import { Notes } from '@/service';

import { createBrowserWindow, transitCloseWindow } from '@/utils';
import { notesState } from '@/store/notes.state';

export default defineComponent({
  components: {
    Header: defineAsyncComponent(() => import('@/components/Header.vue')),
    Editor: defineAsyncComponent(() => import('@/components/Editor.vue'))
  },
  setup() {
    const showOptionsStatus = ref(false);
    const uid = ref('');
    const currentBgClassName = ref('');
    const editContent = ref('');
    const currentWindow = remote.getCurrentWindow();
    /**
     * 焦点状态
     * - `false`: 否 - 获得焦点
     * - `true`: 是 - 失去焦点
     */
    const currentWindowBlurState = ref(false);
    /**
     * - `false`: 否 - 未锁定
     * - `true`: 是 - 已锁定
     */
    const lockState = ref(false);

    onBeforeMount(() => {
      initEditorContent();
      afterIpc();
    });

    // 初始化编辑内容
    const initEditorContent = async () => {
      const routeUid = useRoute().query.uid as string;
      // 判断是编辑还是新增
      if (routeUid) {
        uid.value = routeUid;
        getCurUidItem(routeUid);
      } else {
        const uuidString = uuid();
        uid.value = uuidString;
        useRouter().push({
          query: {
            uid: uuidString
          }
        });
        Notes.create(
          {
            uid: uid.value,
            content: '',
            className: '',
            interception: ''
          },
          {
            raw: true
          }
        );
        // 监听创建便笺
        ipcRenderer.send('createNewNote', {
          uid: uid.value,
          content: '',
          className: '',
          interception: ''
        });
      }
    };

    // 从数据库获取编辑的内容
    const getCurUidItem = async (uid: string) => {
      const info = await Notes.findOne({
        where: {
          uid
        }
      });
      if (!info) return;
      currentBgClassName.value = info.className;
      editContent.value = info.content;
    };

    const clickOption = () => {
      showOptionsStatus.value = true;
    };

    let childrenWindow: BrowserWindow | null;
    const openIndex = () => {
      let indexShowStatus = false;

      // 判断列表窗口是否存在
      ipcRenderer.send('whetherToOpen');
      ipcRenderer.on('getWhetherToOpen', () => {
        indexShowStatus = true;
        return;
      });
      showOptionsStatus.value = false;

      if (childrenWindow) {
        childrenWindow = null;
      }

      setTimeout(() => {
        // 如果窗口不在
        if (!indexShowStatus) {
          childrenWindow = createBrowserWindow(browserWindowOption(), '/');
        }
      }, 100);
    };

    const changeBgClassName = (className: string) => {
      if (currentBgClassName.value !== className) {
        currentBgClassName.value = className;
        Notes.update(
          {
            uid: uid.value,
            content: editContent.value,
            className,
            interception: editContent.value.substr(0, 500)
          },
          {
            where: {
              uid: uid.value
            }
          }
        ).then(() => {
          /**
           * updateNoteItem_className
           * 更新便笺内容
           */
          ipcRenderer.send('updateNoteItem_className', {
            uid: uid.value,
            className: currentBgClassName.value
          });
        });
      }
      showOptionsStatus.value = false;
    };

    const changeEditContent = (content: string) => {
      editContent.value = content;
      if (!uid.value) return false;
      Notes.update(
        {
          uid: uid.value,
          content,
          className: currentBgClassName.value,
          interception: editContent.value.substr(0, 500)
        },
        {
          where: {
            uid: uid.value
          }
        }
      );
      // 更新便笺内容
      ipcRenderer.send('updateNoteItem_content', {
        uid: uid.value,
        content,
        updatedAt: new Date(),
        interception: editContent.value.substr(0, 500)
      });
    };

    const closeWindow = () => {
      if (!editContent.value) {
        // 如果是空就直接从数据库删除
        Notes.destroy({
          where: {
            uid: uid.value
          }
        }).then(() => {
          // 在关闭的时候如果没有内容就通知列表进行删除操作
          ipcRenderer.send('removeEmptyNoteItem', uid.value);
        });
      }
    };

    /**
     * 此处通信便笺列表，如果接收到删除的消息就退出
     *
     * 场景：如果打开窗口就进行关闭
     */
    const afterIpc = () => {
      remote.ipcMain.once(`deleteActiveItem_${uid.value}`, () => {
        transitCloseWindow();
      });
      remote.ipcMain.on(`${uid.value}_toOpen`, e => {
        currentWindow.show();
        e.sender.send(`get_${uid.value}_toOpen`);
      });
    };

    const headerClass = computed(() => {
      let classArr = [currentBgClassName.value];
      // 当编辑器不在显示选项的时候，并且处于显示焦点的情况下
      if (!showOptionsStatus.value && !currentWindowBlurState.value) {
        /**
         * 当未锁上的时候显示头部
         *
         * 和下面页面显示逻辑不同的是，这里是进行显示，下面是进行隐藏
         */
        if (!lockState.value) {
          classArr.push('header-show-style');
        }
      }
      return classArr;
    });
    const pageClass = computed(() => {
      let classArr = [currentBgClassName.value];
      // 当窗口失去焦点的时候
      if (currentWindowBlurState.value) {
        // 编辑器处于失去焦点的状态
        classArr.push('window-blur-hide');
      } else {
        if (lockState.value) {
          // 当锁上的时候，编辑器任然处于失去焦点的情况
          // 需要解锁才能正常
          classArr.push('window-blur-hide');
        }
      }
      return classArr;
    });

    if (notesState.value.switchStatus.autoNarrow) {
      currentWindow.on('blur', () => {
        currentWindowBlurState.value = true;
        if (notesState.value.switchStatus.autoNarrowPure) {
          lockState.value = true;
        } else {
          lockState.value = false;
        }
      });

      currentWindow.on('focus', () => {
        currentWindowBlurState.value = false;
      });
      document.addEventListener('keydown', e => {
        if (e.keyCode === 27) {
          lockState.value = false;
        }
      });
    }

    return {
      clickOption,
      classNames,
      openIndex,
      showOptionsStatus,
      changeBgClassName,
      currentBgClassName,
      editContent,
      changeEditContent,
      closeWindow,
      currentWindowBlurState,
      lockState,
      headerClass,
      pageClass
    };
  }
});
</script>

<style lang="less" scoped>
.page-editor {
  height: 100%;
  background-color: @white-color;
  padding-top: @iconSize;
  padding-bottom: @iconSize;
  box-sizing: border-box;
  transition: padding 0.4s;
  .editor-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    textarea {
      width: 100%;
      height: 370px;
      display: block;
    }
  }
}
.header-editor {
  position: absolute;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  top: -@iconSize;
  transition: all 0.4s;
}
.header-show-style {
  top: 0;
  z-index: 1;
  transition: all 0.4s;
}
.options-container {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: z-index 0.4s;
  .options-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 0;
    bottom: 0;
    left: 0;
    transition: all 0.4s;
  }
  .options-content {
    position: absolute;
    width: 100%;
    z-index: 2;
    top: -300px;
    box-shadow: 0 0 4px @border-color;
    transition: top 0.4s;
    background-color: @white-color;
  }
  .colors {
    height: 50px;
    width: 100%;
    li {
      list-style: none;
      height: 100%;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
      &:hover {
        &::before {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    }
    .black-content:hover {
      &::before {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
  .back-list {
    width: 100%;
    height: 50px;
    font-size: 16px;
    line-height: 50px;
    color: #333;
    display: block;
    padding: 0 10px;
    .iconfont {
      margin-right: 10px;
    }
    &:hover {
      background-color: @background-sub-color;
    }
    &:active {
      background-color: @background-color;
    }
  }
}
.options-show {
  z-index: 3;
  transition: z-index 0.4s;
  .options-content {
    top: 0;
    transition: top 0.4s;
  }
  .options-cover {
    z-index: 1;
    opacity: 1;
    transition: all 0.4s;
  }
}

.window-blur-hide {
  padding-top: 0;
  padding-bottom: 0;
  transition: padding 0.4s;
}
</style>
