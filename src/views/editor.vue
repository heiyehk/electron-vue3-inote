<template>
  <Header
    title=""
    :class="['header-editor', !showOptionsStatus ? 'header-show-style' : 'header-hide-style', currentBgClassName]"
    @option-click="clickOption"
    @on-close="closeWindow"
  />
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
  <main class="page-editor" :class="currentBgClassName">
    <section class="editor-container">
      <Editor :content="editContent" :className="currentBgClassName" @on-input="changeEditContent" />
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { BrowserWindow, remote, ipcRenderer } from 'electron';
import { useRoute, useRouter } from 'vue-router';

import Header from '@/components/Header.vue';
import Editor from '@/components/Editor.vue';

import { browserWindowOption, classNames } from '@/config';
import { uuid } from '@/utils';
import { INote } from '@/service';

import { createBrowserWindow, transitCloseWindow } from '@/utils';

export default defineComponent({
  components: {
    Header,
    Editor
  },
  setup() {
    let showOptionsStatus = ref(false);
    const uid = ref('');
    const currentBgClassName = ref('');
    const editContent = ref('');

    onBeforeMount(() => {
      initEditorContent();
      afterIpc();
    });

    const initEditorContent = async () => {
      const routeUid = useRoute().query.uid as string;
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
        INote.create(
          {
            uid: uid.value,
            content: '',
            className: ''
          },
          {
            raw: true
          }
        );
        /**
         * createNewNote
         * 持续监听创建便笺
         */
        ipcRenderer.send('createNewNote', {
          uid: uid.value,
          content: '',
          className: ''
        });
      }
    };

    const getCurUidItem = async (uid: string) => {
      const info = await INote.findOne({
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
      let countFlag = false;

      /**
       * whetherToOpen
       * 判断列表窗口是否存在
       */
      ipcRenderer.send('whetherToOpen');
      ipcRenderer.on('getWhetherToOpen', () => {
        countFlag = true;
        return;
      });
      showOptionsStatus.value = false;

      if (childrenWindow) {
        childrenWindow = null;
      }

      setTimeout(() => {
        // 如果窗口不在
        if (!countFlag) {
          childrenWindow = createBrowserWindow(browserWindowOption(), '/');
        }
      }, 100);
    };

    const changeBgClassName = (className: string) => {
      if (currentBgClassName.value !== className) {
        currentBgClassName.value = className;
        INote.update(
          {
            uid: uid.value,
            content: editContent.value,
            className
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
          } as QueryDB<DBNotes>);
        });
      }
      showOptionsStatus.value = false;
    };

    const changeEditContent = (content: string) => {
      editContent.value = content;
      if (!uid.value) return false;
      INote.update(
        {
          uid: uid.value,
          content,
          className: currentBgClassName.value
        },
        {
          where: {
            uid: uid.value
          }
        }
      );
      /**
       * updateNoteItem_content
       * 更新便笺内容
       */
      ipcRenderer.send('updateNoteItem_content', {
        uid: uid.value,
        content,
        updatedAt: new Date()
      } as QueryDB<DBNotes>);
    };

    const closeWindow = () => {
      if (!editContent.value) {
        // 如果是空就直接从数据库删除
        INote.destroy({
          where: {
            uid: uid.value
          }
        }).then(() => {
          /**
           * removeEmptyNoteItem
           * 在关闭的时候如果没有内容就通知列表进行删除操作
           */
          ipcRenderer.send('removeEmptyNoteItem', uid.value);
        });
      }
    };

    /**
     * deleteActiveItem_{uid}
     * 此处通信便笺列表，如果接收到删除的消息就退出
     * 场景：如果打开窗口就进行关闭
     */
    const afterIpc = () => {
      remote.ipcMain.once(`deleteActiveItem_${uid.value}`, () => {
        transitCloseWindow();
      });
      remote.ipcMain.on(`${uid.value}_toOpen`, e => {
        remote.getCurrentWindow().show();
        e.sender.send(`get_${uid.value}_toOpen`);
      });
    };

    return {
      clickOption,
      classNames,
      openIndex,
      showOptionsStatus,
      changeBgClassName,
      currentBgClassName,
      editContent,
      changeEditContent,
      closeWindow
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
  transition: all 0.4s;
}
.header-hide-style {
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
</style>
