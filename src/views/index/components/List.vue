<template>
  <ul class="edit-list">
    <template v-for="item in viewNotesList" :key="item.uid">
      <li
        class="edit-item"
        v-mask
        :class="[item.className, item.content ? '' : 'empty-item', item.remove ? 'remove-item' : '']"
        @dblclick="openEditorWindow(item.uid)"
        @contextmenu.prevent="contextMenu($event, item.uid)"
      >
        <span class="update-time">{{ getTime(item.updatedAt) }}</span>
        <div class="edit-content module-editor empty-content" v-html="item.interception"></div>
      </li>
    </template>
  </ul>
  <Teleport to="body">
    <IMessageBox v-model="deleteMessageShow" @on-confirm="deleteNotes">
      <p class="text">是否删除此便笺</p>
      <div style="margin-top: 10px;">
        <label for="checkbox" class="flex-items">
          <input id="checkbox" type="checkbox" v-model="deleteTipChecked" />
          <span style="margin-left: 6px;font-size: 15px;">不在询问</span>
        </label>
      </div>
    </IMessageBox>
  </Teleport>
</template>

<script setup lang="ts">
import CreateRightClick from '@/components/IRightClick';
import { browserWindowOption, constImagesPath } from '@/config';
import { Notes } from '@/service';
import { DBNotesListType, DBNotesType } from '@/types/notes';
import { createBrowserWindow } from '@/utils';
import dayjs from 'dayjs';
import { ipcRenderer, remote } from 'electron';
import { onBeforeMount, onMounted, PropType, Ref, ref, watch } from 'vue';
import { notesState } from '@/store/notes.state';
import IMessageBox from '@/components/IMessageBox.vue';
import { readdir, readdirSync, rmdir, rmdirSync, unlinkSync } from 'fs-extra';
import { join } from 'path';

const props = defineProps({
  list: {
    type: Array as PropType<DBNotesListType[]>,
    default: []
  },
  searchValue: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['changeBlockState']);
const viewNotesList = ref<DBNotesListType[]>([]);
const deleteTipChecked: Ref<boolean | undefined> = ref(false);
const deleteMessageShow = ref(false);
const liRef = ref<HTMLLIElement[]>([]);

const rightClick = new CreateRightClick();

const year = dayjs().year();
// 今天0点时间戳
const todayZeroTimeStamp = dayjs()
  .hour(0)
  .minute(0)
  .second(0)
  .valueOf();

const bwsWinOption = browserWindowOption('editor');
const openEditorWindow = (uid: string) => {
  let countFlag = false;
  ipcRenderer.send(`${uid}_toOpen`);
  ipcRenderer.on(`get_${uid}_toOpen`, () => {
    countFlag = true;
    return;
  });
  setTimeout(() => {
    if (!countFlag) createBrowserWindow(bwsWinOption, `/editor?uid=${uid}`, true);
  }, 100);
};

watch(
  () => props.searchValue,
  nv => {
    if (nv) {
      if (props.list && props.list.length) {
        viewNotesList.value = props.list;
      } else {
        viewNotesList.value = [];
      }
    } else {
      getAllDBNotes();
    }
  }
);

const setLiRef = (el: HTMLLIElement) => {
  console.log(el);
  liRef.value.push(el);
};

onMounted(() => {});

onBeforeMount(() => {
  getAllDBNotes();
  electronIpcEditor();
});

const getAllDBNotes = async () => {
  const notesAllList = await Notes.findAll({
    raw: true,
    order: [['updatedAt', 'DESC']],
    attributes: ['uid', 'className', 'interception', 'updatedAt']
  });
  viewNotesList.value = (notesAllList as unknown) as DBNotesListType[];

  if (notesAllList.length) {
    emits('changeBlockState', 1);
  } else {
    emits('changeBlockState', 2);
  }
};

const deleteCurrentUid = ref('');
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
        if (notesState.value.switchStatus.deleteTip) {
          deleteMessageShow.value = true;
        } else {
          deleteNotes();
        }
      }
    }
  ]);
};

const deleteNotes = async () => {
  if (deleteTipChecked?.value) {
    notesState.value.switchStatus.deleteTip = false;
    deleteTipChecked.value = undefined;
  }
  await Notes.destroy({
    where: {
      uid: deleteCurrentUid.value
    }
  });
  await removeNoteItem(deleteCurrentUid.value);
  /**
   * deleteActiveItem_{uid}
   * 此处通信便笺编辑
   * 场景：如果打开窗口就进行关闭
   */
  ipcRenderer.send(`deleteActiveItem_${deleteCurrentUid.value}`);
  await deleteNotesUidDir();
  deleteCurrentUid.value = '';
};

/** 删除便笺后删除本地文件夹 */
const deleteNotesUidDir = async () => {
  const uidDir = await join(remote.app.getPath('userData'), constImagesPath, deleteCurrentUid.value);
  const imagesPath = await readdirSync(uidDir);
  for (const imgPath of imagesPath) {
    await unlinkSync(join(uidDir, imgPath));
  }
  await rmdirSync(uidDir);
};

const electronIpcEditor = (): void => {
  /**
   * createNewNote
   * 持续监听创建便笺
   */
  remote.ipcMain.on('createNewNote', (event, noteItem: DBNotesType) => {
    viewNotesList.value.unshift(noteItem);
    console.log('createNewNote');
    emits('changeBlockState', 1);
  });

  /**
   * updateNoteItem_className
   * 更新背景样式
   */
  remote.ipcMain.on('updateNoteItem_className', (event, updateItem: DBNotesType) => {
    const cntIndex = viewNotesList.value.findIndex(x => x.uid === updateItem.uid);
    if (cntIndex === -1) return;
    viewNotesList.value[cntIndex].className = updateItem.className as string;
  });

  /**
   * updateNoteItem_content
   * 更新content内容
   */
  remote.ipcMain.on('updateNoteItem_content', (event, updateItem: DBNotesType) => {
    const cntIndex = viewNotesList.value.findIndex(x => x.uid === updateItem.uid);
    if (cntIndex === -1) return;
    viewNotesList.value[cntIndex].interception = updateItem.interception as string;
    viewNotesList.value[cntIndex].updatedAt = updateItem.updatedAt!;
  });

  /**
   * removeEmptyNoteItem
   * 获取便笺编辑关闭后如果是空就进行删除
   */
  remote.ipcMain.on('removeEmptyNoteItem', (event, uid: string) => {
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

const removeNoteItem = (uid: string) => {
  const rntIndex = viewNotesList.value.findIndex(x => x.uid === uid);
  if (rntIndex === -1) return;
  viewNotesList.value[rntIndex].remove = true;
  setTimeout(() => {
    viewNotesList.value.splice(rntIndex, 1);
    if (!viewNotesList.value.length) {
      emits('changeBlockState', 2);
    }
  }, 400);
};

const getTime = (time: Date) => {
  const date = dayjs(time);
  const dateYear = date.year();
  const dateTimeStamp = date.valueOf();
  // 如果不在这个年份就需要渲染年份
  if (year !== dateYear) return date.format('YYYY-MM-DD');
  // 如果不在今天就渲染年月
  if (dateTimeStamp < todayZeroTimeStamp) return date.format('MM-DD HH:mm');
  // 否则渲染时分
  return date.format('HH:mm');
};
</script>

<style lang="less" scoped>
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

    li.edit-item {
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
      overflow: hidden;
      box-shadow: 0 0 4px #ddd;
      background-color: @white-color;
      max-height: 240px;

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
        overflow: hidden;
        line-height: 1.8;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;

        :deep(*) {
          margin: 0;
          font-size: 14px;
          line-height: 1.8;
          word-break: break-all;
        }

        :deep(img) {
          display: inline-block;
          max-width: 100%;
          word-break: break-all;
        }

        :deep(pre) {
          background-color: #f8f8f8;

          code {
            border-radius: 5px;
            padding: 0.5em;
          }
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
        z-index: 2;
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

.item-mask {
  position: relative;

  &::after {
    content: '';
    width: 100%;
    height: 50px;
    background-image: linear-gradient(transparent, #fff 60%);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
