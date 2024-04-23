<template>
    <div>
        <slot></slot>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { hasParent } from '@/utils'

const show = ref(false)
const reserveDoms = ref([])

const clickEvent = (e) => {
    const triggerElement = e.target
    const firstChildElm = this.$slots.default[0].elm
    const defaultReserveDoms = Array.from(
        document.querySelectorAll('.el-loading-mask, .el-loading-spinner')
    )
    const reserves = defaultReserveDoms.concat(firstChildElm)
    if (!hasParent(
        triggerElement,
        reserves.concat(reserveDoms.value)
    )) {
        show.value = false
    }
}

const bindClick = () => {
    document.addEventListener('mousedown', clickEvent)
}

const removeClick = () => {
    document.removeEventListener('mousedown', clickEvent)
}

watch(show, (newShow) => {
    setTimeout(() => {
        if (newShow) {
            bindClick()
        } else {
            removeClick()
        }
    }, 0)
})

onMounted(() => {
    if (show.value) {
        bindClick()
    }
})

onBeforeUnmount(() => {
    removeClick()
})
</script>



<style scoped></style>
