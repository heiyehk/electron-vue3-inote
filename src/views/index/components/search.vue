<template>
  <div class="search-box">
    <div class="search flex-items">
      <div class="search-input flex1">
        <input v-model="searchWord" type="text" placeholder="搜索..." @input="searchDb" />
      </div>
      <button class="search-button" @click="searchDb">
        <i class="iconfont icon-search"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { INote } from '@/service';
import { Op } from 'sequelize';

export default defineComponent({
  emits: ['search'],
  setup(props, { emit }) {
    const searchWord = ref('');
    const searchDb = async () => {
      if (searchWord.value === '') {
        emit('search', []);
        return;
      }
      const data = await INote.findAll({
        raw: true,
        order: [['updatedAt', 'DESC']],
        where: {
          content: {
            [Op.like]: '%' + searchWord.value + '%'
          }
        }
      });
      emit('search', data);
    };
    return {
      searchWord,
      searchDb
    };
  }
});
</script>

<style lang="less" scoped>
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
</style>
