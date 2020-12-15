<template>
  <Header v-if="routeName !== 'editor'" />
  <div class="bg-white">
    <router-view v-slot="{ Component }">
      <transition name="main-fade">
        <div class="transition" :key="routeName" :data-title="routeName">
          <!-- TODO 处理在切换页面的时候，主页数据库导入一次之后更改数据不更新问题 -->
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUpdate } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/header.vue';

export default defineComponent({
  components: {
    Header
  },
  setup() {
    const routeName = ref(useRoute().name);

    onBeforeUpdate(() => {
      routeName.value = useRoute().name;
    });

    const keepAlive = ref(true);
    return {
      keepAlive,
      routeName
    };
  }
});
</script>

<style lang="less" scoped>
.main-fade-enter,
.main-fade-leave-to {
  display: none;
  opacity: 0;
  animation: main-fade 0.4s reverse;
}
.main-fade-enter-active,
.main-fade-leave-active {
  opacity: 0;
  animation: main-fade 0.4s;
}
@keyframes main-fade {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
