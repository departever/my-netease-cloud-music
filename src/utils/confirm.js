import { createApp, h, defineAsyncComponent } from 'vue';

let instanceCache;

export const confirm = async (text, title, onConfirm = () => {}) => {
  if (typeof title === 'function') {
    onConfirm = title;
    title = undefined;
  }

  if (!instanceCache) {
    const Confirm = defineAsyncComponent(() => import('@/base/confirm.vue'));
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
