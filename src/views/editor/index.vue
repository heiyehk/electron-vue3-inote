<template>
  <IHeader class="header-editor" :class="headerClass" @option-click="clickOption" @on-close="closeWindow" />
  <IDropBar />
  <ColorMask
    :showState="showOptionsStatus"
    @on-change="changeBgClassName"
    @on-close="showOptionsStatus = false"
    @on-open="showOptionsStatus = false"
  />
  <main class="page-editor" :class="pageClass">
    <section class="editor-container">
      <IEditor
        :uid="uid"
        v-model="iEditorMarkdown"
        :content="iEditorHtml"
        :className="currentBgClassName"
        @on-input="changeEditContent"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref, watch } from 'vue';
import { BrowserWindow, remote, ipcRenderer } from 'electron';
import { useRoute, useRouter } from 'vue-router';
import ILoading from '@/components/ILoading.vue';

import { browserWindowOption } from '@/config';
import { twiceHandle, uuid } from '@/utils';
import { Notes } from '@/service';

import { createBrowserWindow, transitCloseWindow } from '@/utils';
import { notesState } from '@/store/notes.state';
import IDropBar from '@/components/IDropBar.vue';
import ColorMask from './components/ColorMask.vue';

// TODO 储存一份获取文本后的内容，供搜索使用
const IHeader = defineAsyncComponent(() => import('@/components/IHeader.vue'));
const IEditor = defineAsyncComponent({
  loader: () => import('./components/IEditor.vue'),
  loadingComponent: ILoading
});

const showOptionsStatus = ref(false);
const uid = ref('');
const currentBgClassName = ref('');
const currentWindow = remote.getCurrentWindow();
// markdown
const iEditorMarkdown = ref('');
// html
const iEditorHtml = ref('');
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
    // 编辑
    uid.value = routeUid;
    getCurUidItem(routeUid);
    return;
  }

  // 新建
  const uuidString = uuid();
  uid.value = uuidString;
  useRouter().push({
    query: {
      uid: uuidString
    }
  });
  const createDefault = {
    uid: uid.value,
    content: '',
    markdown: '',
    className: '',
    interception: ''
  };
  Notes.create(createDefault, {
    raw: true
  });
  // 监听创建便笺
  ipcRenderer.send('createNewNote', createDefault);
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
  iEditorHtml.value = info.content;
  iEditorMarkdown.value = info.markdown;
};

const clickOption = () => {
  showOptionsStatus.value = true;
};

let childrenWindow: BrowserWindow | null;

/** 打开主页列表 */
const openNotesList = () => {
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

/** 修改颜色背景 */
const changeBgClassName = (className: string) => {
  if (currentBgClassName.value === className) return;

  currentBgClassName.value = className;
  updateData('className');
  showOptionsStatus.value = false;
};

/** 修改内容 */
const changeEditContent = (contentHtml: string, markdown: string) => {
  iEditorHtml.value = contentHtml;
  iEditorMarkdown.value = markdown;
  if (!uid.value) return false;

  updateData('content');
};

/** 截取展示的html */
const getInterceptionHTML = async () => {
  const domHtml = new DOMParser().parseFromString(iEditorHtml.value, 'text/html');
  let interceptionHTML = '';
  // 这里处理主页面的节点数量
  let nodeIndex = 10;
  // 取节点前十个
  domHtml.body.childNodes.forEach((item, index) => {
    if (item.nodeName === '#text') {
      nodeIndex += 1;
      return;
    }
    if (index > nodeIndex) return;
    interceptionHTML += (item as Element).outerHTML;
  });

  return interceptionHTML;
};

/** 更新数据并进行后续操作 */
const updateData = async (updateType: 'className' | 'content') => {
  const interceptionHTML = await getInterceptionHTML();
  const dataJson: Record<string, any> = {
    uid: uid.value,
    content: iEditorHtml.value,
    markdown: iEditorMarkdown.value,
    className: currentBgClassName.value,
    interception: interceptionHTML
  };
  await Notes.update(dataJson, {
    where: {
      uid: uid.value
    }
  });

  if (updateType === 'className') {
    /**
     * updateNoteItem_className
     * 更新便笺内容
     */
    ipcRenderer.send('updateNoteItem_className', {
      uid: uid.value,
      className: currentBgClassName.value
    });
  } else {
    dataJson.updatedAt = new Date();
    // 更新便笺内容
    ipcRenderer.send('updateNoteItem_content', dataJson);
  }
};

const closeWindow = () => {
  if (iEditorHtml.value) return;
  // 如果是空就直接从数据库删除
  Notes.destroy({
    where: {
      uid: uid.value
    }
  }).then(() => {
    // 在关闭的时候如果没有内容就通知列表进行删除操作
    ipcRenderer.send('removeEmptyNoteItem', uid.value);
  });
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

const currentBlurHandle = () => {
  currentWindowBlurState.value = true;
  if (notesState.value.switchStatus.autoNarrowPure) {
    lockState.value = true;
  } else {
    lockState.value = false;
  }
};

const currentWindowFocusHandle = () => {
  currentWindowBlurState.value = false;
};

const immersionHandle = () => {
  if (notesState.value.switchStatus.autoNarrow) {
    currentWindow.on('blur', currentBlurHandle);

    currentWindow.on('focus', currentWindowFocusHandle);

    document.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        lockState.value = false;
        twiceHandle.start(() => {
          currentWindow.minimize();
        });
      }
    });
  } else {
    // 不在沉浸模式下取消所有功能以及事件
    currentWindowBlurState.value = false;
    currentWindow.off('blur', currentBlurHandle);
    currentWindow.off('focus', currentWindowFocusHandle);
  }
};

immersionHandle();

// 这里需要监听主窗口改变设置内容
watch(() => notesState.value.switchStatus.autoNarrow, immersionHandle);
</script>

<style lang="less" scoped>
.page-editor {
  height: 100%;
  background-color: @white-color;
  padding-top: @iconSize;
  // padding-bottom: @iconSize;
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
  position: fixed;
  z-index: 0;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  top: -@iconSize;
  transition: all 0.4s;
}

.header-show-style {
  top: 0;
  z-index: 3;
  transition: all 0.4s;
}

.window-blur-hide {
  padding-top: 0;
  padding-bottom: 0;
  transition: padding 0.4s;
}
</style>
