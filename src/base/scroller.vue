<template>
    <div class="scroller" ref="scroller">
        <slot></slot>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'

BScroll.use(ScrollBar)
BScroll.use(MouseWheel)

const defaultOptions = {
    mouseWheel: true,
    scrollY: true,
    scrollbar: true,
    probeType: 3
}

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    options: {
        type: Object,
        default: () => ({})
    }
})

const scroller = ref(null)
const bsInstance = ref(null)

const getScroller = () => bsInstance.value

const refresh = () => {
    bsInstance.value.refresh()
}

const emit = defineEmits(['init']);

watch(
    () => props.data,
    async () => {
        nextTick(() => {
            if (!bsInstance.value) {
                bsInstance.value = new BScroll(
                    scroller.value,
                    Object.assign({}, defaultOptions, props.options)
                )
                emit('init', bsInstance.value)
            } else {
                bsInstance.value.refresh()
            }
        })
    },
    { immediate: true }
)

onMounted(() => {
    if (props.data.length) {
        nextTick(() => {
            if (!bsInstance.value) {
                bsInstance.value = new BScroll(
                    scroller.value,
                    Object.assign({}, defaultOptions, props.options)
                )
                emit('init', bsInstance.value)
            } else {
                bsInstance.value.refresh()
            }
        })
    }
})
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