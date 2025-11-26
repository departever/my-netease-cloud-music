<template>
  <span v-html="highlightedText"></span>
</template>

<script setup>
  import { computed } from 'vue';

  // 使用ref来创建响应式的props
  const props = defineProps({
    text: String,
    highlightText: String,
  });

  // 创建一个计算属性来生成高亮文本
  const highlightedText = computed(() => {
    if (!props.highlightText) {
      return props.text;
    }
    const titleToMatch = props.text.toLowerCase();
    const keyWord = props.highlightText.toLowerCase();
    const matchIndex = titleToMatch.indexOf(keyWord);
    if (matchIndex === -1) {
      return props.text;
    }
    const beforeStr = props.text.slice(0, matchIndex);
    const afterStr = props.text.slice(matchIndex + keyWord.length);
    const hitStr = props.text.slice(matchIndex, matchIndex + keyWord.length);
    return `${beforeStr}<span class="high-light-text">${hitStr}</span>${afterStr}`;
  });
</script>

<style lang="scss" scoped>
  .high-light-text {
    color: $blue;
  }
</style>
