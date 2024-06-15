<template>
    <div class="with-pagination">
      <slot></slot>
      <div class="pagination-wrap">
        <Pagination :current-page="currentPage" :page-size="limit" :total="total"
          @current-change="handlePageChange" class="pagination" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  import { getPageOffset, scrollInto } from "@/utils"
  
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
      type: HTMLElement,
      default: null
    },
    total: {
      type: Number,
      default: 0
    }
  })
  
  const emit = defineEmits(['getDataSuccess', 'getDataError'])
  
  const currentPage = ref(1)
  
  const handlePageChange = (page) => {
    currentPage.value = page
    onPageChange()
  }
  
  const onPageChange = async () => {
    try {
      const result = await props.getData({
        limit: props.limit,
        offset: getPageOffset(currentPage.value, props.limit),
        ...props.getDataParams
      })
      emit("getDataSuccess", result)
      // 如果传入了滚动的目标对象 分页后自动滚入
      if (props.scrollTarget) {
        scrollInto(props.scrollTarget)
      }
    } catch (error) {
      emit("getDataError", error)
    }
  }
  
  watch(() => props.getDataParams, () => {
    currentPage.value = 1
    onPageChange()
  }, { deep: true })
  
  onMounted(() => {
    onPageChange()
  })
  </script>
  
<style lang="scss" scoped>
.pagination-wrap {
    margin-top: 16px;
}
</style>
