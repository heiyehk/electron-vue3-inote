<template>
  <main class="page-index">
    <Search @search="searchHandle" />
    <section class="content-container" :class="fadein ? 'fadein' : ''">
      <template v-if="emptyBlockState === 1">
        <ul class="edit-list">
          <template v-for="item in viewNotesList" :key="item.uid">
            <li
              class="edit-item"
              :class="[item.className, item.content ? '' : 'empty-item', item.remove ? 'remove-item' : '']"
              @dblclick="openEditorWindow(item.uid)"
              @contextmenu.prevent="contextMenu($event, item.uid)"
            >
              <span class="update-time">{{ getTime(item.updatedAt) }}</span>
              <div class="edit-content module-editor empty-content" v-html="item.content"></div>
            </li>
          </template>
        </ul>
      </template>
      <template v-else-if="emptyBlockState === 2">
        <div class="index-empty-container flex-center" @dblclick="openNewWindow">
          <div class="index-empty-content">
            <div class="index-empty-content-text" style="margin-top: 0;margin-bottom: 40px;">双击此处，或</div>
            <div class="index-empty-content-img">
              <img src="../../assets/empty-content.svg" />
            </div>
            <div class="index-empty-content-text">点击上方“+”按钮创建</div>
            <div class="index-empty-content-text" style="margin-top: 4px;">新的便笺内容</div>
          </div>
        </div>
      </template>
    </section>
  </main>
  <MessageBox v-model="deleteMessageShow" @on-confirm="onConfirm">
    <p class="text">是否删除此便笺</p>
    <div style="margin-top: 10px;">
      <label for="checkbox" class="flex-items">
        <input id="checkbox" type="checkbox" v-model="deleteTipChecked" />
        <span style="margin-left: 6px;font-size: 15px;">不在询问</span>
      </label>
    </div>
  </MessageBox>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, Ref, ref } from 'vue';
import { remote, ipcRenderer } from 'electron';
import dayjs from 'dayjs';

import CreateRightClick from '@/components/RightClick';
import MessageBox from '@/components/MessageBox.vue';
import Search from './components/Search.vue';

import { browserWindowOption } from '@/config';
import { INote } from '@/service';
import { createBrowserWindow } from '@/utils';
import { notesState } from '@/store/notes.state';

export default defineComponent({
  components: {
    MessageBox,
    Search
  },
  setup() {
    const deleteMessageShow = ref(false);
    const deleteCurrentUid = ref('');
    let deleteTipChecked: Ref<boolean> | null = ref(false);
    const fadein = ref(false);
    let viewNotesList = ref([] as ListDbNotes[]);
    const rightClick = new CreateRightClick();
    const year = dayjs().year();

    // 控制主页的显示接面
    let emptyBlockState = ref(0);

    // 今天0点时间戳
    const todayZeroTimeStamp = dayjs()
      .hour(0)
      .minute(0)
      .second(0)
      .valueOf();

    // 现在时间戳
    const nowTimeStamp = dayjs().valueOf();

    onBeforeMount(() => {
      getAllDBNotes();
      electronIpcEditor();
    });

    const getAllDBNotes = async () => {
      const inoteAllList = ((await INote.findAll({
        raw: true,
        order: [['updatedAt', 'DESC']]
      })) as unknown) as ListDbNotes[];
      viewNotesList.value = inoteAllList;

      if (inoteAllList.length) {
        emptyBlockState.value = 1;
      } else {
        emptyBlockState.value = 2;
      }
    };

    const getTime = (time: Date) => {
      const date = dayjs(time);
      const dateYear = date.year();
      const dateTimeStamp = date.valueOf();
      // 如果不在这个年份就需要渲染年份
      if (year !== dateYear) return date.format('YYYY-MM-DD');
      // 如果不在今天就渲染年月
      if (nowTimeStamp - dateTimeStamp > todayZeroTimeStamp) return date.format('MM-DD');
      // 否则渲染时分
      return date.format('HH:mm');
    };

    const bwsWinOption = browserWindowOption('editor');
    const openEditorWindow = (uid: string) => {
      let countFlag = false;
      ipcRenderer.send(`${uid}_toOpen`);
      ipcRenderer.on(`get_${uid}_toOpen`, () => {
        countFlag = true;
        return;
      });
      setTimeout(() => {
        if (!countFlag) createBrowserWindow(bwsWinOption, `/editor?uid=${uid}`);
      }, 100);
    };

    const contextMenu = (event: MouseEvent, uid: string) => {
      rightClick.useRightClick(event, [
        {
          text: '打开笔记',
          once: true,
          iconName: ['iconfont', 'icon-newopen'],
          handler: () => {
            openEditorWindow(uid);
          }
        },
        {
          text: '删除笔记',
          once: true,
          iconName: ['iconfont', 'icon-delete'],
          handler: () => {
            deleteCurrentUid.value = uid;
            if (notesState.switchStatus.deleteTip) {
              deleteMessageShow.value = true;
            } else {
              onConfirm();
            }
          }
        }
      ]);
    };

    const removeNoteItem = (uid: string) => {
      const rntIndex = viewNotesList.value.findIndex(x => x.uid === uid);
      if (rntIndex === -1) return;
      viewNotesList.value[rntIndex].remove = true;
      setTimeout(() => {
        viewNotesList.value.splice(rntIndex, 1);
        if (!viewNotesList.value.length) {
          emptyBlockState.value = 2;
        }
      }, 400);
    };

    const electronIpcEditor = (): void => {
      /**
       * createNewNote
       * 持续监听创建便笺
       */
      remote.ipcMain.on('createNewNote', async (event, noteItem: DBNotes) => {
        viewNotesList.value.unshift(noteItem);
        emptyBlockState.value = 1;
      });

      /**
       * updateNoteItem_className
       * 更新背景样式
       */
      remote.ipcMain.on('updateNoteItem_className', async (event, updateItem: QueryDB<DBNotes>) => {
        const cntIndex = viewNotesList.value.findIndex(x => x.uid === updateItem.uid);
        if (cntIndex === -1) return;
        viewNotesList.value[cntIndex].className = updateItem.className as string;
      });

      /**
       * updateNoteItem_content
       * 更新content内容
       */
      remote.ipcMain.on('updateNoteItem_content', async (event, updateItem: QueryDB<DBNotes>) => {
        const cntIndex = viewNotesList.value.findIndex(x => x.uid === updateItem.uid);
        if (cntIndex === -1) return;
        viewNotesList.value[cntIndex].content = updateItem.content as string;
        viewNotesList.value[cntIndex].updatedAt = updateItem.updatedAt!;
      });

      /**
       * removeEmptyNoteItem
       * 获取便笺编辑关闭后如果是空就进行删除
       */
      remote.ipcMain.on('removeEmptyNoteItem', async (event, uid: string) => {
        removeNoteItem(uid);
      });

      /**
       * whetherToOpen
       * 判断本列表是否打开，聚焦显示
       */
      remote.ipcMain.on('whetherToOpen', event => {
        remote.getCurrentWindow().show();
        event.sender.send('getWhetherToOpen');
      });

      // 失去焦点之后删除右键
      remote.getCurrentWindow().on('blur', () => {
        rightClick.remove();
      });
    };

    const editorWinOptions = browserWindowOption('editor');
    // 打开新窗口
    const openNewWindow = () => {
      createBrowserWindow(editorWinOptions, '/editor', false);
    };

    const onConfirm = () => {
      if (deleteTipChecked?.value) {
        notesState.switchStatus.deleteTip = false;
        deleteTipChecked = null;
      }
      /**
       * deleteActiveItem_{uid}
       * 此处通信便笺编辑
       * 场景：如果打开窗口就进行关闭
       */
      ipcRenderer.send(`deleteActiveItem_${deleteCurrentUid.value}`);
      removeNoteItem(deleteCurrentUid.value);
      INote.destroy({
        where: {
          uid: deleteCurrentUid.value
        }
      }).finally(() => {
        deleteCurrentUid.value = '';
      });
    };

    const searchHandle = (data: DBNotes[]) => {
      if (data.length) {
        viewNotesList.value = data;
      } else {
        getAllDBNotes();
      }
    };

    return {
      fadein,
      viewNotesList,
      contextMenu,
      getTime,
      emptyBlockState,
      openEditorWindow,
      openNewWindow,
      deleteMessageShow,
      onConfirm,
      notesState,
      deleteTipChecked,
      searchHandle
    };
  }
});
</script>

<style lang="less" scoped>
.page-index {
  height: calc(100% - @iconSize);
  background-color: @white-color;
}

// 减去搜索和外边距高度
.content-container {
  height: calc(100% - 58px);
  padding: 6px 12px 20px;
  box-sizing: border-box;
  overflow-y: auto;
  margin-top: 14px;
  position: relative;
  .edit-list {
    @keyframes fadeintop {
      0% {
        opacity: 0;
        min-height: 0;
        padding: 0 14px;
      }
      50% {
        opacity: 0;
        min-height: 30px;
        padding: 24px 14px 14px;
        background-color: @white-color;
      }
      100% {
        opacity: 1;
        min-height: 30px;
        padding: 24px 14px 14px;
        // background-color: @background-sub-color;
      }
    }
    .empty-item {
      animation: fadeintop 0.6s forwards;
      // background-color: @background-sub-color;
      transition: all 0.4s;
    }
    li {
      list-style: none;
      border-radius: 2px;
      padding: 24px 14px 14px;
      margin-bottom: 10px;
      font-size: 14px;
      position: relative;
      cursor: pointer;
      transition: all 0.4s;
      transform: translateZ(0);
      transform: translate3d(0, 0, 0);
      box-sizing: border-box;
      max-height: 164px;
      overflow: hidden;
      box-shadow: 0 0 4px #ddd;
      background-color: @white-color;
      .update-time {
        font-size: 12px;
        position: absolute;
        right: 14px;
        top: 5px;
        transform: scale(0.8);
        color: @text-sub-color;
      }
      .edit-content {
        min-height: 20px;
        word-break: break-all;
        max-height: 126px;
        overflow: hidden;
        line-height: 1.8;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        :deep(*) {
          font-size: 14px;
          line-height: 1.8;
          word-break: break-all;
        }
      }
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
        top: 0;
        left: 0;
        opacity: 0;
        transition: all 0.4s;
      }
      &:last-child {
        margin-bottom: 0;
      }
      &:hover {
        opacity: 0.8;
        box-shadow: 0 0 4px @shadown-color;
        transition: all 0.4s;
        &::before {
          opacity: 1;
        }
      }
      &:active {
        transform: scale(0.97);
        box-shadow: 0 0 6px @shadown-color;
        transition: all 0.4s;
      }
    }
    .black-content {
      .update-time {
        color: @gray-color;
      }
      .empty-content::before {
        color: @gray-color;
      }
    }
    @keyframes removeFadeOut {
      0% {
        opacity: 1;
        margin-top: 0px;
      }
      50% {
        padding: 24px 14px 14px;
        max-height: 164px;
        opacity: 0;
        margin-top: 20px;
        margin-bottom: 10px;
      }
      100% {
        opacity: 0;
        max-height: 0;
        padding: 0;
        margin: 0;
      }
    }
    .remove-item {
      opacity: 1;
      max-height: 164px;
      animation: removeFadeOut 0.4s forwards;
    }
  }
}

.index-empty-container {
  height: 100%;
  cursor: pointer;
  .index-empty-content {
    &-img {
      width: 74%;
      margin: 0 auto;
      img {
        display: block;
        width: 100%;
      }
    }
    &-text {
      font-size: 14px;
      color: @text-color;
      margin-top: 40px;
      text-align: center;
    }
  }
}
</style>
