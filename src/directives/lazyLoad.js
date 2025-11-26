const EMPTY_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export default {
  mounted(el, binding) {
    const loadImage = () => {
      el.src = binding.value;
      el.onerror = () => {
        el.src = EMPTY_IMG; // 图片加载失败后的替代图片
      };
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadImage();
        observer.unobserve(el);
      }
    });

    el._observer = observer;
    observer.observe(el);
  },
  updated(el, binding) {
    // 在 updated 中处理 src 更新的逻辑
    if (el.src !== binding.value) {
      el.src = EMPTY_IMG; // 在更新时设置为占位图
      el._observer.disconnect(); // 断开旧的观察
      el._observer.observe(el); // 重新观察
    }
  },
  unmounted(el) {
    // 取消 observer 的观察，防止内存泄漏
    if (el._observer) {
      el._observer.disconnect();
      delete el._observer;
    }
  },
};
