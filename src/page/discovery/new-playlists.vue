<template>
  <div class="recommend" v-if="list.length">
    <Title>推荐歌单</Title>
    <div class="list-wrap">
      <PlaylistCard
        v-for="item in list"
        :key="item.id"
        :desc="item.copywriter"
        :id="item.id"
        :img="item.picUrl"
        :name="item.name"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import PlaylistCard from '@/components/playlist-card.vue';
  import { getPersonalized } from '@/api';

  const list = ref([]);

  onMounted(async () => {
    const { result } = await getPersonalized({ limit: 10 });
    list.value = result;
  });
</script>

<style lang="scss" scoped>
  .list-wrap {
    margin: 0 -4px;
    display: flex;
    flex-wrap: wrap;
  }
</style>
