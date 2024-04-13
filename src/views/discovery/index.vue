// 发现音乐页面
<template>
  <div class="discovery">
    <div class="discovery-content">
      <Banner />
      <NewPlaylists />
    </div>
  </div>
</template>

<script setup>
import Banner from "./banner.vue"
import NewPlaylists from "./new-playlists.vue";
</script>

<style lang="scss" scoped>
.discovery {
  padding: 18px 32px;
}
</style>