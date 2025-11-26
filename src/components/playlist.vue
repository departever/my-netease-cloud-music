<template>
  <Toggle
    :reserveDoms="reserveDoms"
    :show="isPlaylistShow"
    @update:show="updatePlaylistShow(false)"
  >
    <div class="playlist" ref="playlist" v-show="isPlaylistShow">
      <Tabs :tabs="tabs" align="center" v-model="activeTab" />
      <div class="header">
        <p class="total">总共{{ dataSource.length }}首</p>
        <div @click="clear" class="remove" v-if="dataSource.length">
          <Icon type="remove" />
          <span class="text">清空</span>
        </div>
      </div>
      <template v-if="dataSource.length">
        <div class="song-table-wrap">
          <SongTable :hideColumns="['index', 'img', 'albumName']" :songs="dataSource" />
        </div>
      </template>
      <div class="empty" v-else>你还没有添加任何歌曲</div>
    </div>
  </Toggle>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useMusicStore } from '@/store/music';
  import SongTable from './song-table.vue';

  const reserveDoms = ref([document.getElementById('mini-player')]);
  const tabs = ['播放列表', '历史记录'];
  const LIST_TAB = 0;
  const HISTORY_TAB = 1;
  const activeTab = ref(LIST_TAB);

  const musicStore = useMusicStore();

  const clear = () => {
    if (isPlaylist.value) {
      musicStore.clearPlaylist();
    } else {
      musicStore.clearHistory();
    }
  };

  const updatePlaylistShow = value => {
    musicStore.setPlaylistShow(value);
  };

  const dataSource = computed(() => {
    return isPlaylist.value ? musicStore.playlist : musicStore.playHistory;
  });

  const isPlaylist = computed(() => {
    return activeTab.value === LIST_TAB;
  });

  const isPlaylistShow = computed(() => musicStore.isPlaylistShow);
</script>

<style lang="scss" scoped>
  .playlist {
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    bottom: $mini-player-height;
    display: flex;
    flex-direction: column;
    background: var(--playlist-bgcolor);
    z-index: $playlist-z-index;
    @include box-shadow;
    // @include el-table-theme(var(--playlist-bgcolor));

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      margin: 0 20px;
      border-bottom: 1px solid var(--border);

      .total {
        font-size: $font-size-sm;
      }

      .remove {
        @include flex-center;
        cursor: pointer;
        font-size: $font-size-sm;

        .text {
          display: inline-block;
          margin-left: 4px;
        }
      }
    }

    .song-table-wrap {
      flex: 1;
      overflow-y: auto;
    }

    .empty {
      @include flex-center();
      flex: 1;
    }
  }
</style>
