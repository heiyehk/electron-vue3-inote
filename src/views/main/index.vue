<template>
  <Header v-if="routeName !== 'editor'" />
  <div class="bg-white">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <div class="transition" :key="routeName">
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
.fade-enter,
.fade-leave-to {
  display: none;
  opacity: 0;
  animation: fade 0.4s reverse;
}
.fade-enter-active,
.fade-leave-active {
  opacity: 0;
  animation: fade 0.4s;
}
@keyframes fade {
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
