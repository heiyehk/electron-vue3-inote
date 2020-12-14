<template>
  <main class="page-index">
    <div class="search-box">
      <div class="search flex-items">
        <div class="search-input flex1">
          <input type="text" placeholder="搜索..." />
        </div>
        <button class="search-button">
          <i class="iconfont icon-search"></i>
        </button>
      </div>
    </div>
    <section class="content-container" :class="fadein ? 'fadein' : ''">
      <vueScroll />
      <!-- <button @click="getAll">getAllDBNotes</button> -->
      <template v-if="viewNotesList.length">
        <ul class="edit-list">
          <template v-for="item in viewNotesList" :key="item.uid">
            <li
              class="edit-item"
              :class="[item.className, item.content ? '' : 'empty-item', item.remove ? 'remove-item' : '']"
              @dblclick="dbclickOpenNote(item.uid)"
              @contextmenu.prevent="contextMenu($event, item.uid)"
            >
              <span class="update-time">{{ getTime(item.updatedAt) }}</span>
              <div class="edit-content module-editor empty-content" v-html="item.content"></div>
            </li>
          </template>
        </ul>
      </template>
      <template v-else>
        <div class="index-empty-container flex-center">
          <div class="index-empty-content">
            <div class="index-empty-content-img">
              <img src="/images/empty-content.svg" />
            </div>
            <div class="index-empty-content-text">点击上方“+”按钮创建新的便笺内容</div>
          </div>
        </div>
      </template>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { BrowserWindow, remote, ipcRenderer } from 'electron';
import dayjs from 'dayjs';
import { browserWindowOption, winURL } from '@/config';
import inotedb from '@/inotedb';
import vueScroll from '@/components/vue3scroll/index.vue';
import CreateRightClick from '@/components/rightClick';

export default defineComponent({
  components: {
    vueScroll
  },
  setup() {
    const fadein = ref(false);
    let viewNotesList = ref([] as ListDbNotes[]);
    const rightClick = new CreateRightClick();
    let childrenWindow: BrowserWindow | null;
    const year = dayjs().year();

    // 今天0点时间戳
    const todayZeroTimeStamp = dayjs()
      .hour(0)
      .minute(0)
      .second(0)
      .valueOf();

    // 现在时间戳
    const nowTimeStamp = dayjs().valueOf();

    onBeforeMount(() => {
      // inotedb.remove({}, { multi: true });
      getAllDBNotes();
      electronIpcEditor();
    });

    const getAllDBNotes = async () => {
      inotedb._db
        .find({})
        .sort({ updatedAt: -1 })
        .exec((e, d) => {
          viewNotesList.value = d as DBNotes[];
        });
    };

    const getAll = () => {
      inotedb._db
        .find({})
        .sort({ updatedAt: -1 })
        .exec((e, d) => {
          console.log(d);
        });
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

    const openEditorWindow = (uid: string) => {
      childrenWindow = new remote.BrowserWindow(browserWindowOption('editor'));
      if (process.env.NODE_ENV === 'development') {
        childrenWindow.webContents.openDevTools();
      }
      childrenWindow.loadURL(`${winURL}/#/editor?uid=${uid}`);
      childrenWindow.on('closed', () => {
        childrenWindow = null;
      });
    };

    const dbclickOpenNote = (uid: string) => {
      openEditorWindow(uid);
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
          className: 'error-bg',
          iconName: ['iconfont', 'icon-delete'],
          handler: () => {
            /**
             * deleteActiveItem_{uid}
             * 此处通信便笺编辑
             * 场景：如果打开窗口就进行关闭
             */
            ipcRenderer.send(`deleteActiveItem_${uid}`);
            removeDbItem(uid);
            inotedb.remove({
              uid
            });
          }
        }
      ]);
    };

    const removeDbItem = (uid: string) => {
      const rntIndex = viewNotesList.value.findIndex(x => x.uid === uid);
      if (rntIndex === -1) return;
      viewNotesList.value[rntIndex].remove = true;
      setTimeout(() => {
        viewNotesList.value.splice(rntIndex, 1);
      }, 400);
    };

    const electronIpcEditor = (): void => {
      /**
       * createNewNote
       * 持续监听创建便笺
       */
      remote.ipcMain.on('createNewNote', async (event, noteItem: DBNotes) => {
        viewNotesList.value.unshift(noteItem);
      });

      /**
       * updateNoteItem_className
       * 更新背景样式
       */
      remote.ipcMain.on('updateNoteItem_className', async (event, updateItem: UpdateNote) => {
        const cntIndex = viewNotesList.value.findIndex(x => x.uid === updateItem.uid);
        viewNotesList.value[cntIndex].className = updateItem.className as string;
      });

      /**
       * updateNoteItem_content
       * 更新content内容
       */
      remote.ipcMain.on('updateNoteItem_content', async (event, updateItem: UpdateNote) => {
        console.log(updateItem);
        const cntIndex = viewNotesList.value.findIndex(x => x.uid === updateItem.uid);
        viewNotesList.value[cntIndex].content = updateItem.content as string;
      });

      /**
       * removeEmptyNoteItem
       * 获取便笺编辑关闭后如果是空就进行删除
       */
      remote.ipcMain.on('removeEmptyNoteItem', async (event, uid: string) => {
        removeDbItem(uid);
      });

      /**
       * whetherToOpen
       * 判断本列表是否打开，聚焦显示
       */
      remote.ipcMain.on('whetherToOpen', event => {
        remote.getCurrentWindow().show();
        event.sender.send('getWhetherToOpen');
      });
    };

    return {
      fadein,
      viewNotesList,
      dbclickOpenNote,
      contextMenu,
      getTime,
      getAll
    };
  }
});
</script>

<style lang="less" scoped>
.page-index {
  height: calc(100% - 40px);
  background-color: #fff;
}

.search-box {
  padding: 0 12px;
  padding-top: 10px;
  box-sizing: border-box;
}
.search {
  background-color: @background-sub-color;
  height: 34px;
  opacity: 0.9;
  .search-input {
    input {
      display: block;
      width: 100%;
      height: 100%;
      border: none;
      background-color: transparent;
      font-size: 14px;
      padding: 0 18px;
    }
  }
  .search-button {
    display: block;
    border: none;
    width: 34px;
    height: 100%;
    padding: 0;
    .iconfont {
      font-size: 20px;
    }
    &:hover {
      background-color: #e0e0e0;
    }
  }
  &:hover {
    opacity: 1;
  }
  &:active {
    opacity: 1;
  }
}

// @keyframes fadein {
//   0% {
//     position: relative;
//     top: 60px;
//   }
//   100% {
//     position: relative;
//     top: 0;
//   }
// }

// .fadein {
//   animation: fadein 0.6s;
// }

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
        background-color: #fff;
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
      background-color: #fff;
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
        ::v-deep * {
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
        box-shadow: 0 0 4px #ccc;
        transition: all 0.4s;
        &::before {
          opacity: 1;
        }
      }
      &:active {
        transform: scale(0.97);
        box-shadow: 0 0 6px #ccc;
        transition: all 0.4s;
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

/deep/ .error-bg {
  background-color: red;
  color: #fff;
}

.index-empty-container {
  height: 100%;
  .index-empty-content {
    &-img {
      width: 50%;
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
    }
  }
}
</style>
