<template>
  <div class="virtual-list" @scroll="handleScroll">
    <div class="virtual-list-inner" :style="{ height: totalHeight + 'px', transform: `translateY(${startIndex * itemHeight}px)` }">
      <div v-for="(song, index) in visibleSongs" :key="song.id" class="song-row" @click="onRowClick(song)">
        <div class="index-wrap">
          <Icon v-if="isActiveSong(song)" class="horn" type="horn" color="theme" />
          <span v-else>{{ pad(startIndex + index + 1) }}</span>
        </div>
        <div class="img-wrap">
          <img :src="song.img" />
          <PlayIcon class="play-icon" />
        </div>
        <div class="song-table-name-cell">
          <HighlightText class="song-table-name" :text="song.name" :highlight-text="highlightText" />
          <Icon v-if="song.mvId" class="mv-icon" @click="goMvWithCheck(song.mvId)" type="mv" color="theme" :size="18" />
        </div>
        <span class="artists-text">{{ song.artistsText }}</span>
        <span class="album-name">{{ song.albumName }}</span>
        <span class="duration">{{ $utils.formatTime(song.durationSecond) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMusicStore } from '@/store/music';
import { pad } from '@/utils';
import { goMvWithCheck } from '@/utils/business';

const props = defineProps({
  hideColumns: {
    type: Array,
    default: () => [],
  },
  songs: {
    type: Array,
    default: () => [],
  },
  highlightText: {
    type: String,
    default: "",
  },
});

const musicStore = useMusicStore();
const currentSong = computed(() => musicStore.currentSong);
const isActiveSong = (song) => song.id === currentSong.value.id;

const itemHeight = 60; // 每一行的高度
const visibleCount = 10; // 可视区域显示的项数
const totalHeight = computed(() => props.songs.length * itemHeight);

const startIndex = ref(0);
const visibleSongs = computed(() => {
  return props.songs.slice(startIndex.value, startIndex.value + visibleCount);
});

const handleScroll = (event) => {
  const scrollTop = event.target.scrollTop;
  startIndex.value = Math.floor(scrollTop / itemHeight);
};

const onRowClick = (song) => {
  musicStore.startSong(song);
  musicStore.setPlaylist(props.songs);
};

watch(totalHeight, (newValue) => {
  console.log('Total Height:', newValue);
});
</script>

<style lang="scss">
.virtual-list {
  height: 800px;
  overflow-y: auto;
  position: relative;
  background-color: var(--body-bgcolor) !important;

  .virtual-list-inner {
    position: absolute;
    width: 100%;
  }

  .song-row {
    display: flex;
    align-items: center;
    height: 60px;
    padding: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--body-bgcolor) !important;
    color: var(--font-color);

    &:hover {
      background-color: var(--playlist-hover-bgcolor) !important;
    }

    &.song-active {
      color: $theme-color;
    }
  }

  .index-wrap { 
    text-align: center;
    color: var(--font-color-grey-shallow);
    width: 70px;
  }

  .img-wrap {
    position: relative;
    @include img-wrap(60px);
    margin-right: 20px;

    img {
      border-radius: 4px;
    }

    .play-icon {
      @include abs-center;
    }
  }

  .song-table-name-cell {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .mv-icon {
      width: 24px;
      margin-left: 4px;
    }
  }

  .artists-text,
  .album-name,
  .duration {
    flex: 0 0 120px;
    margin-right: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>