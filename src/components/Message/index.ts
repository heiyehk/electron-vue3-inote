import { createApp, h, App } from 'vue';
import './index.css';

type MessageType = 'success' | 'info' | 'error' | 'warning';

let messageApp: App<Element> | null = null;
let messageEl: HTMLDivElement | null = null;
let timeouter: NodeJS.Timeout | null;

const render = (text: string, type: MessageType) => {
  return h(
    'div',
    {
      class: ['hy-message-content', 'flex-items', type ? `hy-message-${type}` : '']
    },
    [
      h('i', {
        class: ['iconfont', 'icon-warning']
      }),
      h(
        'span',
        {
          class: 'hy-message-text'
        },
        text
      )
    ]
  );
};

const useMessage = (text: string, type: MessageType = 'info', duration = 2800): void => {
  messageApp = null;
  messageApp = createApp({
    setup() {
      return () => {
        return render(text, type);
      };
    }
  });
  if (timeouter) {
    clearTimeout(timeouter as NodeJS.Timeout);
    timeouter = null;
  }
  if (!messageEl) {
    messageEl = document.createElement('div');
    document.body.appendChild(messageEl);
    messageEl.classList.add('hy-message');
    messageApp.mount('.hy-message');
  }
  timeouter = setTimeout(() => {
    (messageEl as HTMLDivElement).style.cssText = 'top: 20px;opacity: 0;';
    setTimeout(() => {
      messageEl?.remove();
      messageEl = null;
      clearTimeout(timeouter as NodeJS.Timeout);
      timeouter = null;
    }, 200);
  }, duration);
};

export default useMessage;
