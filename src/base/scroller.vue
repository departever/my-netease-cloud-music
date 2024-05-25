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
const scrollerInstance = ref(null);


const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    options: {
        type: Object,
        default: () => ({})
    }
});

const defaultOptions = {
    mouseWheel: true,
    scrollY: true,
    scrollbar: true,
    probeType: 3
}


const emit = defineEmits(['init']);

onMounted(() => {
    nextTick(() => {
        if (!scrollerInstance.value) {
            scrollerInstance.value = new BScroll(
                scroller.value,
                defaultOptions.value
            );
            emit('init', scrollerInstance.value);
        } else {
            scrollerInstance.value.refresh();
        }
    });
});

watch(() => props.data, () => {
    nextTick(() => {
        if (scrollerInstance.value) {
            scrollerInstance.value.refresh();
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