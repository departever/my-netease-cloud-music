import { createApp, h, defineAsyncComponent, ref } from 'vue';

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
        const visible = ref(true);

        return () => h(Confirm, {
          text,
          title,
          onConfirm,
          modelValue: visible.value,
          'onUpdate:modelValue': (newVal) => {
            visible.value = newVal;
            if (!newVal) {
              instanceCache.unmount();
              instanceCache = null;
            }
          }
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
    instanceCache.modelValue = true; // 确保显示
  }
};
