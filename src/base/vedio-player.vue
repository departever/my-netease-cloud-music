<template>
  <div class="video-player" ref="playerContainer"></div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Player from 'xgplayer';
  import { toRem } from '@/utils';

  const props = defineProps(['url', 'poster']);
  const playerContainer = ref(null);

  onMounted(() => {
    if (!props.url) return;
    const player = new Player({
      el: playerContainer.value,
      url: props.url,
      poster: props.poster,
      videoInit: true,
      lang: 'zh-cn',
      width: '100%',
    });

    player.on('ready', () => {
      const videoWrapper = playerContainer.value;
      const height = videoWrapper.style.height;
      const remHeight = toRem(Number(height.replace('px', '')));
      videoWrapper.style.height = remHeight;
    });
  });

  watch(
    () => props.url,
    (newUrl, oldUrl) => {
      if (newUrl && newUrl !== oldUrl) {
        const player = new Player({
          el: playerContainer.value,
          url: newUrl,
          videoInit: true,
          lang: 'zh-cn',
          width: '100%',
        });
        player.reload();
      }
    }
  );
</script>

<style>
  .xgplayer-error {
    display: none;
  }
</style>
