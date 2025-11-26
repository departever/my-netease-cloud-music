// 发现音乐页面
<template>
  <div class="discovery">
    <div class="discovery-content">
      <Banner />
      <NewPlaylists />
      <NewSongs />
      <NewMvs />
    </div>
  </div>
</template>

<script setup>
  import Banner from './banner.vue';
  import NewPlaylists from './new-playlists.vue';
  import NewSongs from './new-songs.vue';
  import NewMvs from './new-mvs.vue';
</script>

<style lang="scss" scoped>
  .discovery {
    padding: 18px 32px;
  }
</style>
