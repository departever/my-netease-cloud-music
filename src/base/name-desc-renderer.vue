<template>
  <div v-if="alias">
    <HighlightText
      v-for="(desc, index) in alias"
      :key="index"
      class="name-desc"
      :text="desc"
      :highlightText="highlightText"
    />
  </div>
</template>

<script setup>
  const props = defineProps({
    alias: {
      type: Array,
      required: true,
    },
    highlightText: {
      type: String,
      required: true,
    },
  });
</script>

<style scoped>
  .name-desc {
    display: block;
    margin-top: 8px;
    color: gray;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
