import { createApp, h, App, VNode, RendererElement, RendererNode } from 'vue';
import './index.css';

type ClassName = string | string[];

interface MenuOptions {
  /**
   * 文本
   */
  text: string;

  /**
   * 是否在使用后就关闭
   */
  once?: boolean;

  /**
   * 单独的样式名
   */
  className?: ClassName;

  /**
   * 图标样式名
   */
  iconName?: ClassName;

  /**
   * 函数
   */
  handler(): void;
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
    return h(
      'ul',
      {
        class: ['right-click-menu-list']
      },
      [
        ...menu.map(item => {
          return h(
            'li',
            {
              class: item.className,
              // vue3.x中简化了render，直接onclick即可，onClick也可以
              onclick: () => {
                // 如果只是一次，那么点击之后直接关闭
                if (item.once) this.remove();
                return item.handler();
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
        })
      ]
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
    if (!this.rightClickElBox || !this.rightClickEl) {
      const createRender = this.render(menu);
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
    this.setRightClickElStyle(event, menu.length);
  };
}

export default CreateRightClick;
