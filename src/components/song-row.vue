<template>
  <div class="song-row" :class="{ 'song-active': isActive }" @click="$emit('click')">
    <div class="index-wrap">
      <Icon v-if="isActive" class="horn" type="horn" color="theme" />
      <span v-else>{{ pad(index) }}</span>
    </div>
    <div class="img-wrap">
      <img :src="song.img" />
      <PlayIcon class="play-icon" />
    </div>
    <div class="song-table-name-cell">
      <HighlightText class="song-table-name" :text="song.name" :highlight-text="highlightText" />
      <Icon
        v-if="song.mvId"
        class="mv-icon"
        @click.stop="goMvWithCheck(song.mvId)"
        type="mv"
        color="theme"
        :size="18"
      />
    </div>
    <span class="artists-text">{{ song.artistsText }}</span>
    <span class="album-name">{{ song.albumName }}</span>
    <span class="duration">{{ $utils.formatTime(song.durationSecond) }}</span>
  </div>
</template>

<script setup>
  import { pad } from '@/utils';
  import { goMvWithCheck } from '@/utils/business';

  defineProps({
    song: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    highlightText: {
      type: String,
      default: '',
    },
  });

  defineEmits(['click']);
</script>

<style lang="scss" scoped>
  .song-row {
    display: flex;
    align-items: center;
    height: 60px;
    padding: 10px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--body-bgcolor);
    color: var(--font-color);
    cursor: pointer;
    box-sizing: border-box;

    &:hover {
      background-color: var(--playlist-hover-bgcolor);
    }

    &.song-active {
      color: $theme-color;
    }
  }

  .index-wrap {
    text-align: center;
    color: var(--font-color-grey-shallow);
    width: 70px;
    flex-shrink: 0;
  }

  .img-wrap {
    position: relative;
    @include img-wrap(50px);
    margin-right: 20px;
    flex-shrink: 0;

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
    min-width: 0;

    .song-table-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mv-icon {
      width: 24px;
      margin-left: 4px;
      flex-shrink: 0;
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
</style>
