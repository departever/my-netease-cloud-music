<template>
    <div class="with-pagination">
        <slot></slot>
        <div class="pagination-wrap">
            <Pagination :current-page="currentPage" :page-size="limit" :total="total"
                @update:current-page="onPageChange" class="pagination" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { getPageOffset, scrollInto } from "@/utils";

const props = defineProps({
    getData: {
        type: Function,
        required: true
    },
    getDataParams: {
        type: Object,
        default: () => ({})
    },
    limit: {
        type: Number,
        default: 10
    },
    scrollTarget: {
        type: HTMLElement
    },
    total: {
        type: Number,
        default: 0
    }
});

const currentPage = ref(1);
const emit = defineEmits(['getDataSuccess', 'getDataError']);

const onPageChange = async (newPage = currentPage.value) => {
    try {
        const result = await props.getData({
            limit: props.limit,
            offset: getPageOffset(newPage, props.limit),
            ...props.getDataParams
        });
        emit('getDataSuccess', result);
        if (props.scrollTarget) {
            scrollInto(props.scrollTarget);
        }
    } catch (error) {
        emit('getDataError', error);
    }
};

onMounted(onPageChange);

watch(() => props.getDataParams, () => {
    currentPage.value = 1;
    onPageChange();
}, { deep: true });
</script>

<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 16px;
}
</style>
