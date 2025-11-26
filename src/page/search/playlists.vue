<template>
  <div class="search-playlists">
    <WithPagination
      :getData="getSearch"
      :getDataParams="searchParams"
      :limit="50"
      :scrollTarget="searchRoot.$refs && searchRoot.$refs.header"
      :total="playlistCount"
      @getDataSuccess="onGetPlaylists"
    >
      <div class="list-wrap">
        <PlaylistCard
          :desc="`播放量：${$utils.formatNumber(item.playCount)}`"
          :id="item.id"
          :img="item.coverImgUrl"
          :key="item.id"
          :name="item.name"
          v-for="item in playlists"
        />
      </div>
    </WithPagination>
  </div>
</template>

<script setup>
  import { ref, inject } from 'vue';
  import { getSearch } from '@/api';
  import PlaylistCard from '@/components/playlist-card.vue';
  import WithPagination from '@/components/with-pagination.vue';

  const SEARCH_TYPE_PLAYLIST = 1000;

  const playlists = ref([]);
  const playlistCount = ref(0);

  const searchRoot = inject('searchRoot');

  const onGetPlaylists = ({
    result: { playlists: newPlaylists, playlistCount: newPlaylistCount },
  }) => {
    playlists.value = newPlaylists;
    playlistCount.value = newPlaylistCount;
    searchRoot.onUpdateCount(newPlaylistCount);
  };

  const searchParams = {
    keywords: searchRoot.value.keywords,
    type: SEARCH_TYPE_PLAYLIST,
  };
</script>

<style lang="scss" scoped>
  .search-playlists {
    max-width: 1000px;
    padding: $page-padding;
    margin: auto;

    .list-wrap {
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>
