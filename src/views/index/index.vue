<template>
  <main class="page-index">
    <Search @on-search="searchHandle" />
    <section class="content-container flex" :class="stateClass">
      <!-- 防止在有数据的情况下闪烁 -->
      <div v-if="blockState !== 0" class="max-content">
        <Empty :state="blockState" :content="blockEmptyContent" @onDblclick="openNewWindow" />
      </div>
      <div class="max-content">
        <List :list="viewNotesList" :search-value="searchValue" @change-block-state="changeBlockState" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';
import Search from './components/Search.vue';

import { browserWindowOption } from '@/config';
import { createBrowserWindow } from '@/utils';
import { DBNotesType, DBNotesListType } from '@/types/notes';
import Empty from './components/Empty.vue';
import ILoading from '@/components/ILoading.vue';

const List = defineAsyncComponent({
  loader: () => import('./components/List.vue'),
  loadingComponent: ILoading
});

const viewNotesList = ref<DBNotesListType[]>([]);
const searchValue = ref('');
/**
 * 控制主页的显示接面
 * `0`: 空白
 * `1`: 显示列表
 * `2`: 显示空状态
 * `3`: 显示未找到内容
 */
const blockState = ref(0);
const blockEmptyContent = ref('');
const editorWinOptions = browserWindowOption('editor');
// 打开新窗口
const openNewWindow = () => {
  if (blockState.value === 2) {
    createBrowserWindow(editorWinOptions, '/editor', false);
  }
};

const searchHandle = (data: DBNotesType[], value: string) => {
  searchValue.value = value;
  if (!data.length && value) {
    blockState.value = 3;
    blockEmptyContent.value = '未找到内容';
  } else {
    if (data.length) {
      viewNotesList.value = data;
    } else {
      viewNotesList.value = [];
      blockEmptyContent.value = '';
    }
  }
};

const changeBlockState = (state: number) => {
  blockState.value = state;
  blockEmptyContent.value = '';
};

const stateClass = computed(() => {
  if (blockState.value === 1) return 'block-list-show';
  if (blockState.value === 2 || blockState.value === 3) return 'block-empty-show';
  return 'block-show';
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
}

.block-empty-show {
  .max-content:first-child {
    transform: translateX(0);
    opacity: 1;
    transition: all 0.2s;
  }

  .max-content:last-child {
    transform: translateX(0);
    opacity: 0;
    transition: all 0.2s;
  }
}

.block-list-show {
  .max-content:first-child {
    transform: translateX(-100%);
    opacity: 0;
    transition: all 0.2s;
  }

  .max-content:last-child {
    transform: translateX(-100%);
    opacity: 1;
    transition: all 0.2s;
  }
}

.max-content {
  min-width: 100%;
  min-height: 100%;
  position: relative;
}
</style>
