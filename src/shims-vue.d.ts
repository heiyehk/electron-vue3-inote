declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/** 是否是暗黑模式，根据此处去做兼容 */
declare const isDark: () => boolean;
