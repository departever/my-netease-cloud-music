const EMPTY_IMG =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

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

        observer.observe(el);
    },
    updated(el, binding) {
        //加入update钩子确保切换的时间刷新
        const loadImage = () => {
            el.src = binding.value;
            el.onerror = () => {
                el.src = EMPTY_IMG;
            };
        };

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                loadImage();
                observer.unobserve(el);
            }
        });

        observer.observe(el);
    },
    unmounted(el) {
        // 取消 observer 的观察，防止内存泄漏
        if (el._observer) {
            el._observer.disconnect();
            delete el._observer;
        }
    }
};
