<template>
  <div id="app">
    <Layout />
    <Player />
    <MiniPlayer />
    <Playlist />
  </div>
</template>

<script setup>
  import Layout from '@/layout/index.vue';
  import MiniPlayer from '@/components/mini-player.vue';
  import Playlist from '@/components/playlist.vue';
  import Player from '@/components/player.vue';
</script>

<style lang="scss">
  #app {
    height: 100%;
    background-color: var(--body-bgcolor);
    font-size: $font-size;
  }
</style>
