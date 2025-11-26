<template>
  <div class="pagination" v-if="total > pageSize">
    <!-- 使用 $attrs 绑定事件监听器 -->
    <el-pagination
      :pageSize="pageSize"
      :total="total"
      layout="prev, pager, next"
      v-bind="$attrs"
    ></el-pagination>
  </div>
</template>

<script setup>
  const props = defineProps(['pageSize', 'total']);
</script>

<style scoped>
  .pagination {
    text-align: right;
  }
</style>
