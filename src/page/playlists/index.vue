<template>
  <div class="playlists" ref="playlists">
    <div class="top-play-list-card" v-if="state.topPlaylist.id">
      <TopPlaylistCard
        :desc="state.topPlaylist.description"
        :id="state.topPlaylist.id"
        :img="state.topPlaylist.coverImgUrl"
        :name="state.topPlaylist.name"
      />
    </div>
    <div class="tabs">
      <Tabs
        :tabs="tabs"
        @tabChange="onTabChange"
        align="right"
        type="small"
        :active="state.activeTabIndex"
      />
    </div>
    <div class="playlist-cards">
      <PlaylistCard
        v-for="item in state.playlists"
        :key="item.id"
        :desc="`播放量：${$utils.formatNumber(item.playCount)}`"
        :id="item.id"
        :img="item.coverImgUrl"
        :name="item.name"
      />
    </div>
    <Pagination
      :current-page.sync="state.currentPage"
      :page-size="PAGE_SIZE"
      :total="state.total"
      @current-change="onPageChange"
      class="pagination"
    ></Pagination>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, toRefs } from 'vue';
  import { getPlaylists, getTopPlaylists } from '@/api';
  import PlaylistCard from '@/components/playlist-card.vue';
  import TopPlaylistCard from '@/components/top-playlist-card.vue';
  import { getPageOffset, scrollInto } from '@/utils';

  const PAGE_SIZE = 50;
  const tabs = ref([
    '全部',
    '欧美',
    '华语',
    '流行',
    '说唱',
    '摇滚',
    '民谣',
    '电子',
    '轻音乐',
    '影视原声',
    'ACG',
    '怀旧',
    '治愈',
    '旅行',
  ]);
  const state = reactive({
    activeTabIndex: 0,
    playlists: [],
    currentPage: 0,
    total: 0,
    topPlaylist: {},
  });

  const initData = async () => {
    await getPlaylistsData();
    await getTopPlaylistsData();
  };

  const getPlaylistsData = async () => {
    const { playlists, total } = await getPlaylists({
      limit: PAGE_SIZE,
      offset: getPageOffset(state.currentPage, PAGE_SIZE),
      cat: tabs.value[state.activeTabIndex],
    });
    state.playlists = playlists;
    state.total = total;
  };

  const getTopPlaylistsData = async () => {
    const { playlists } = await getTopPlaylists({
      limit: 1,
      cat: tabs.value[state.activeTabIndex],
    });
    state.topPlaylist = playlists[0] || {};
  };

  const onPageChange = async page => {
    state.currentPage = page;
    await getPlaylistsData();
    scrollInto(document.querySelector('.playlists'));
  };

  const onTabChange = index => {
    state.activeTabIndex = index;
    state.currentPage = 0;
    initData();
  };

  onMounted(() => {
    initData();
  });
</script>

<style lang="scss" scoped>
  .playlists {
    padding: 12px;

    .top-play-list-card {
      margin-bottom: 16px;
    }

    .playlist-cards {
      display: flex;
      flex-wrap: wrap;
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 36px;
    }
  }
</style>
