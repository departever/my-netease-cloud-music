<template>
  <div
    class="loading"
    element-loading-background="transparent"
    element-loading-spinner="el-icon-loading"
    element-loading-text="载入中"
    v-loading="loading"
    v-show="loading"
  ></div>
</template>

<script setup>
  const props = defineProps({
    loading: Boolean,
  });
</script>

<style lang="scss" scoped>
  .loading {
    height: 200px;
  }
</style>
