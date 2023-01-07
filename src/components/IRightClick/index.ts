import { createApp, h, App, VNode, RendererElement, RendererNode } from 'vue';
import './index.css';

type ClassName = string | string[] | (() => string | string[]);

export interface MenuOptions {
  /** 文本 */
  text: string;

  /** 是否在使用后就关闭 */
  once?: boolean;

  /** 单独的样式名 */
  className?: ClassName;

  disabled?: boolean | (() => boolean) | (() => Promise<boolean | unknown>);

  /** 图标样式名 */
  iconName?: ClassName;

  /** 函数 */
  handler?: (e: Event) => void;

  render?: boolean | (() => boolean) | (() => Promise<boolean>);
}

type RenderVNode = VNode<
  RendererNode,
  RendererElement,
  {
    [key: string]: any;
  }
>;

class CreateRightClick {
  rightClickEl?: App<Element>;
  rightClickElBox?: HTMLDivElement | null;

  constructor() {
    this.removeRightClickHandler();
  }

  /**
   * 渲染dom
   * @param menu
   */
  render(menu: MenuOptions[]): RenderVNode {
    const renderLiEl = (item: MenuOptions) => {
      // 判断是否禁用了
      let isDisabled = false;

      const isDisabledHandle = async () => {
        if (typeof item.disabled === 'function') {
          isDisabled = await (item.disabled() as Promise<boolean>);
        }

        if (typeof item.disabled === 'boolean') {
          isDisabled = item.disabled;
        }
      };

      isDisabledHandle();

      const className = () => {
        let classNameStr = '';
        if (isDisabled) classNameStr = 'disabled-item';

        if (typeof item.className === 'function') classNameStr += ` ${item.className()}`;

        if (item.className) classNameStr += ` ${item.className}`;

        return classNameStr;
      };

      return h(
        'li',
        {
          class: className(),
          // vue3.x中简化了render，直接onclick即可，onClick也可以
          onclick: (e: Event) => {
            if (isDisabled) return;

            // 如果只是一次，那么点击之后直接关闭
            if (item.once) this.remove();

            if (item.handler) {
              return item.handler(e);
            }
          }
        },
        [
          // icon
          h('i', {
            class: item.iconName
          }),
          // text
          h(
            'span',
            {
              class: 'right-click-menu-text'
            },
            item.text
          )
        ]
      );
    };

    return h(
      'ul',
      {
        class: ['right-click-menu-list']
      },
      [...menu.map(renderLiEl)]
    );
  }

  /**
   * 给右键的样式
   * @param event 鼠标事件
   */
  setRightClickElStyle(event: MouseEvent, len: number): void {
    if (!this.rightClickElBox) return;
    this.rightClickElBox.style.height = `${len * 36}px`;
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    const { clientWidth, clientHeight } = this.rightClickElBox;
    let cssText = `height: ${len * 36}px;opacity: 1;transition: all 0.2s;`;
    if (clientX + clientWidth < innerWidth) {
      cssText += `left: ${clientX + 2}px;`;
    } else {
      cssText += `left: ${clientX - clientWidth}px;`;
    }
    if (clientY + clientHeight < innerHeight) {
      cssText += `top: ${clientY + 2}px;`;
    } else {
      cssText += `top: ${clientY - clientHeight}px;`;
    }
    cssText += `height: ${len * 36}px`;
    this.rightClickElBox.style.cssText = cssText;
  }

  remove(): void {
    if (this.rightClickElBox) {
      this.rightClickElBox.remove();
      this.rightClickElBox = null;
    }
  }

  removeRightClickHandler(): void {
    document.addEventListener('click', e => {
      if (this.rightClickElBox) {
        const currentEl = e.target as Node;
        if (!currentEl || !this.rightClickElBox.contains(currentEl)) {
          this.remove();
        }
      }
    });
  }

  /**
   * 鼠标右键悬浮
   * @param event
   * @param menu
   */
  useRightClick = (event: MouseEvent, menu: MenuOptions[] = []): void => {
    this.remove();
    const filterMenuMap = menu.filter(item => {
      if (item.render !== undefined) {
        if (item.render === true) {
          return item;
        }
        if (typeof item.render === 'function' && item.render() === true) {
          return item;
        }
      } else {
        return item;
      }
    });
    if (!this.rightClickElBox || !this.rightClickEl) {
      const createRender = this.render(filterMenuMap);
      this.rightClickEl = createApp({
        setup() {
          return () => createRender;
        }
      });
    }
    if (!this.rightClickElBox) {
      this.rightClickElBox = document.createElement('div');
      this.rightClickElBox.id = 'rightClick';
      document.body.appendChild(this.rightClickElBox);
      this.rightClickEl.mount('#rightClick');
    }
    this.setRightClickElStyle(event, filterMenuMap.length);
  };
}

export default CreateRightClick;
