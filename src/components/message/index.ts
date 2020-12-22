import { createApp, h, App, VNode, RendererElement, RendererNode, reactive, Ref } from 'vue';

type RenderVNode = VNode<
  RendererNode,
  RendererElement,
  {
    [key: string]: any;
  }
>;

type MessageType = 'success' | 'info' | 'error' | 'warning';

interface MessageState {
  show: boolean;
  text: string;
  type: MessageType;
}

const messageState = reactive({
  show: false,
  text: '',
  type: 'info'
} as MessageState);

let messageApp: App<Element> | null = null;
let messageEl: HTMLDivElement | null = null;

const render = (text: string, type: MessageType) => {
  return h(
    'div',
    {
      class: ['hy-message', `hy-message-${type}`, 'flex-items']
    },
    [
      h('i', {
        class: ['iconfont', 'icon-warning']
      }),
      h(
        'span',
        {
          class: 'hy-message'
        },
        text
      )
    ]
  );
};

const useMessage = (text: string, type: MessageType): void => {
  if (!messageApp) {
    messageApp = createApp({
      setup() {
        return () => {
          return render(text, type);
        };
      }
    });
  }
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.id = 'hyMessage';
    document.body.appendChild(messageEl);
    messageApp.mount('#hyMessage');
  }
};

export default useMessage;
