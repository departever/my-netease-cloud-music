import { createApp, h } from 'vue';
import Confirm from '@/base/confirm.vue';

let instanceCache;

export const confirm = (text, title, onConfirm = () => {}) => {
  if (typeof title === 'function') {
    onConfirm = title;
    title = undefined;
  }

  if (!instanceCache) {
    instanceCache = createApp({
      setup() {
        return () => h(Confirm, {
          text,
          title,
          onConfirm,
          visible: true
        });
      },
    });

    const container = document.createElement('div');
    document.body.appendChild(container);
    instanceCache.mount(container);
  } else {
    instanceCache.text = text;
    instanceCache.title = title;
    instanceCache.onConfirm = onConfirm;
    instanceCache.visible = true;
  }
};
