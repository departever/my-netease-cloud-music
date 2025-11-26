<template>
  <div class="playlist-detail" v-if="playlist.id">
    <DetailHeader ref="header" :playlist="playlist" :songs="songs" />
    <div class="tabs-wrap">
      <Tabs :tabs="tabs" type="theme" :active="activeTab" @tabChange="handleTabChange" />
      <el-input
        :class="getInputCls()"
        @blur="onInputBlur"
        @focus="onInputFocus"
        class="input"
        placeholder="搜索歌单音乐"
        :prefix-icon="Search"
        v-model="searchValue"
        v-show="activeTab === SONG_IDX"
      ></el-input>
    </div>
    <div class="empty" v-if="searchValue && !filteredSongs.length">
      未能找到和
      <span class="keyword">"{{ searchValue }}"</span>
      相关的任何音乐
    </div>
    <div class="song-list-wrap" v-show="activeTab === SONG_IDX && filteredSongs.length">
      <VirtualList :highlightText="searchValue" :songs="filteredSongs" />
    </div>
    <div class="comments-wrap" v-show="activeTab === COMMENT_IDX">
      <Comments :id="id" @update="onCommentsUpdate" type="playlist" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { Search } from '@element-plus/icons-vue';
  import DetailHeader from './header.vue';
  import VirtualList from '@/components/virtual-list.vue';
  import Comments from '@/components/comments.vue';
  import { createSong } from '@/utils/business';
  import { scrollInto } from '@/utils';
  import { getListDetail, getSongDetail } from '@/api';
  import { useRoute } from 'vue-router';

  const MAX = 500;
  const SONG_IDX = 0;
  const COMMENT_IDX = 1;
  const tabs = ref(['歌曲列表', '评论']);
  const activeTab = ref(SONG_IDX);
  const playlist = ref({});
  const songs = ref([]);
  const searchValue = ref('');
  const inputFocus = ref(false);
  const route = useRoute();

  const handleTabChange = index => {
    activeTab.value = index;
  };

  const id = computed(() => Number(route.params.id));
  const filteredSongs = computed(() => {
    return songs.value.filter(({ name, artistsText, albumName }) =>
      `${name}${artistsText}${albumName}`.toLowerCase().includes(searchValue.value.toLowerCase())
    );
  });

  const init = async () => {
    const { playlist: newPlaylist } = await getListDetail({ id: id.value });
    playlist.value = newPlaylist;
    await genSonglist(newPlaylist);
  };

  watch(
    id,
    async (newId, oldId) => {
      if (newId !== oldId) {
        searchValue.value = '';
        await init();
        scrollToHeader();
      }
    },
    { immediate: true }
  );

  const genSonglist = async playlist => {
    const trackIds = playlist.trackIds.map(({ id }) => id);
    const songDetails = await getSongDetail(trackIds.slice(0, MAX));
    songs.value = songDetails.songs.map(({ id, name, al, ar, mv, dt }) =>
      createSong({
        id,
        name,
        artists: ar,
        duration: dt,
        mvId: mv,
        albumName: al.name,
        img: al.picUrl,
      })
    );
  };

  const onCommentsUpdate = ({ total }) => {
    tabs.value.splice(COMMENT_IDX, 1, `评论(${total})`);
  };

  const onInputFocus = () => {
    inputFocus.value = true;
  };

  const onInputBlur = () => {
    inputFocus.value = false;
  };

  const getInputCls = () => {
    return !inputFocus.value ? 'inactive' : '';
  };

  const scrollToHeader = () => {
    const headerElement = ref(null);
    if (headerElement.value) {
      scrollInto(headerElement.value);
    }
  };

  onMounted(() => {
    init();
  });
</script>

<style lang="scss" scoped>
  .playlist-detail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .tabs-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 24px;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;

      .input {
        width: 150px;

        &:not(:hover) {
          &.inactive {
            :deep(.el-input__inner) {
              background: transparent !important;
            }
          }
        }
      }
    }

    .empty {
      @include flex-center;
      height: 200px;

      .keyword {
        color: $blue;
      }
    }

    .song-list-wrap {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      padding: 0 24px;
    }

    .comments-wrap {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 16px 32px;
    }
  }
</style>
