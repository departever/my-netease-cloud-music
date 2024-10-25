<template>
  <el-carousel :interval="4000" class="banner-carousel" type="card">
    <el-carousel-item :key="banner.scm" v-for="banner in banners">
      <img :src="$utils.genImgUrl(banner.imageUrl, 1000, 400)" class="banner-img"/>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getBanner } from "@/api";

const banners = ref([]);

onMounted(async () => {
  try {
    const { banners: loadedBanners } = await getBanner();
    banners.value = loadedBanners;
  } catch (error) {
    console.error('Error loading banners:', error);
  }
});
</script>

<style lang="scss" scoped>
.banner-carousel {
  :deep(.el-carousel__container) {
    height: 200px;
  }

  .banner-img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
}
</style>
