<template>
    <div class="scroller" ref="scroller">
        <slot></slot>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';

BScroll.use(ScrollBar);
BScroll.use(MouseWheel);

const scroller = ref(null);
const data = ref([]); // 假设 data 是响应式的数据源

const defaultOptions = {
    mouseWheel: true,
    scrollY: true,
    scrollbar: true,
    probeType: 3,
};

const options = ref({});
const emit = defineEmits(['init']);

onMounted(() => {
    if (!scroller.value) {
        scroller.value = new BScroll(
            scroller.value,
            Object.assign({}, defaultOptions, options.value)
        );
        emit('init', scroller.value);
    } else {
        scroller.value.refresh();
    }
});

watch(data, () => {
    nextTick(() => {
        if (!scroller.value) {
            scroller.value = new BScroll(
                scroller.value,
                Object.assign({}, defaultOptions, options.value)
            );
            emit('init', scroller.value);
        } else {
            scroller.value.refresh();
        }
    });
}, { immediate: true });
</script>

<style lang="scss">
.scroller {
    position: relative;
    overflow: hidden;
    height: 100%;

    .bscroll-indicator {
        border: none !important;
        background: var(--scrollbar-color) !important;
    }
}
</style>