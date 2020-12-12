<template>
  <Header
    title=""
    :class="['header-editor', !showOptionsStatus ? 'header-show-style' : 'header-hide-style', currentBgColor]"
    @option-click="clickOption"
    @on-close="closeWindow"
  />
  <div class="options-container" :class="showOptionsStatus ? 'options-show' : ''">
    <div class="options-cover" @click="showOptionsStatus = false"></div>
    <div class="options-content">
      <ul class="colors flex-between">
        <template v-for="item in colors" :key="item.color">
          <li class="flex1" :title="item.title" :class="item.color" @click="changeBgColor(item.color)"></li>
        </template>
      </ul>
      <p class="back-list" @click="openIndex">
        <i class="iconfont icon-list"></i>
        <span>笔记列表</span>
      </p>
    </div>
  </div>
  <main class="page-editor" :class="currentBgColor">
    <section class="editor-container">
      <editor :content="editContent" @on-input="changeEditContent" />
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { BrowserWindow, remote, ipcRenderer } from 'electron';
import Header from '@/components/header.vue';
import editor from '@/components/editor.vue';
import { browserWindowOption, winURL, colors } from '@/config';
import uuid from '@/utils/uuid';
import { useRoute, useRouter } from 'vue-router';
import inotedb from '@/inotedb';

export default defineComponent({
  components: {
    Header,
    editor
  },
  setup() {
    let showOptionsStatus = ref(false);
    const uid = ref('');
    const currentBgColor = ref('');
    const editContent = ref('');

    onBeforeMount(() => {
      initEditorContent();
      afterDeleteIpc();
    });

    const initEditorContent = () => {
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
        // 往数据库插入创建数据
        inotedb
          .insert({
            uid: uid.value,
            content: '',
            class: ''
          })
          .then(res => {
            /**
             * 持久型通信 createNewNote
             * 持续监听创建便笺
             */
            ipcRenderer.send('createNewNote', res);
          });
      }
    };

    const getCurUidItem = async (uid: string) => {
      const info = (await inotedb.findOne({
        uid
      })) as DBNotes;
      if (info) {
        currentBgColor.value = info.class;
        editContent.value = info.content;
      }
    };

    const clickOption = () => {
      showOptionsStatus.value = true;
    };

    let childrenWindow: BrowserWindow | null;
    const openIndex = () => {
      childrenWindow = new remote.BrowserWindow(browserWindowOption());
      if (process.env.NODE_ENV === 'development') {
        childrenWindow.webContents.openDevTools();
      }
      childrenWindow.loadURL(`${winURL}/`);
      childrenWindow.on('closed', () => {
        childrenWindow = null;
      });
      showOptionsStatus.value = false;
    };

    const changeBgColor = (color: string) => {
      if (currentBgColor.value !== color) {
        currentBgColor.value = color;
        /**
         * 持久型通信 updateNoteItem
         * 更新便笺内容
         */
        ipcRenderer.send('updateNoteItem', {
          uid: uid.value,
          content: editContent.value,
          class: currentBgColor.value
        });
      }
      showOptionsStatus.value = false;
    };

    const changeEditContent = (e: string) => {
      editContent.value = e;
      if (!uid.value) return false;
      /**
       * 持久型通信 updateNoteItem
       * 更新便笺内容
       */
      ipcRenderer.send('updateNoteItem', {
        uid: uid.value,
        content: e,
        class: currentBgColor.value
      });
    };

    const closeWindow = () => {
      if (!editContent.value) {
        // 如果是空就直接从数据库删除
        inotedb.remove({
          uid: uid.value
        });
        /**
         * 持久型通信 removeEmptyNoteItem
         * 在关闭的时候如果没有内容就通知列表进行删除操作
         */
        ipcRenderer.send('removeEmptyNoteItem', uid.value);
      }
    };

    /**
     * 持久型通信 deleteActiveItem_{uid}
     * 此处通信便笺列表，如果接收到删除的消息就退出
     * 场景：如果打开窗口就进行关闭
     */
    const afterDeleteIpc = () => {
      remote.ipcMain.on(`deleteActiveItem_${uid.value}`, () => {
        document.querySelector('#app')?.classList.remove('app-show');
        document.querySelector('#app')?.classList.add('app-hide');
        remote.getCurrentWindow().close();
      });
    };

    return {
      clickOption,
      colors,
      openIndex,
      showOptionsStatus,
      changeBgColor,
      currentBgColor,
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
  background-color: #fff;
  padding-top: 40px;
  padding-bottom: 40px;
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
  top: -40px;
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
    box-shadow: 0 0 4px #ccc;
    transition: top 0.4s;
    background-color: #fff;
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
