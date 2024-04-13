<template>
    <div :style="wrapStyle" class="play-icon-wrap">
      <Icon :size="iconSize" class="play-icon" type="play" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    size: {
      type: Number,
      default: 24,
    }
  });
  
  const size = ref(props.size);
  const wrapStyle = computed(() => {
    return { width: `${size.value}px`, height: `${size.value}px` };
  });
  const iconSize = computed(() => size.value * 0.6);
  </script>
  
  <style lang="scss" scoped>
  .play-icon-wrap {
    @include flex-center();
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
  
    .play-icon {
      color: $theme-color;
    }
  }
  </style>
  