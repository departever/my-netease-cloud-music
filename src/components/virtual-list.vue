<template>
  <div class="virtual-list-wrapper">
    <!-- 表头 -->
    <div class="virtual-list-header" v-if="showHeader">
      <span class="header-index"></span>
      <span class="header-img"></span>
      <span class="header-name">音乐标题</span>
      <span class="header-artist">歌手</span>
      <span class="header-album">专辑</span>
      <span class="header-duration">时长</span>
    </div>
    <!-- 虚拟列表容器 -->
    <div ref="containerRef" class="virtual-list" @scroll="handleScroll">
      <!-- 占位层：撑起滚动高度 -->
      <div class="virtual-list-spacer" :style="{ height: totalHeight + 'px' }"></div>
      <!-- 内容层：绝对定位，只渲染可见项目 -->
      <div class="virtual-list-content" :style="{ transform: `translateY(${offsetY}px)` }">
        <SongRow
          v-for="(song, index) in visibleSongs"
          :key="song.id"
          :song="song"
          :index="startIndex + index + 1"
          :is-active="isActiveSong(song)"
          :highlight-text="highlightText"
          @click="onRowClick(song)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useMusicStore } from '@/store/music';
  import { debounce } from '@/utils';
  import SongRow from '@/components/song-row.vue';

  const props = defineProps({
    songs: {
      type: Array,
      default: () => [],
    },
    highlightText: {
      type: String,
      default: '',
    },
    itemHeight: {
      type: Number,
      default: 60, // 每行高度
    },
    buffer: {
      type: Number,
      default: 2, // 上下缓冲区数量，防止滚动白屏
    },
    showHeader: {
      type: Boolean,
      default: true, // 默认显示表头
    },
  });

  const containerRef = ref(null);
  const containerHeight = ref(480); // 容器实际高度，动态获取

  const musicStore = useMusicStore();
  const currentSong = computed(() => musicStore.currentSong);
  const isActiveSong = song => song.id === currentSong.value.id;

  // 使用 ResizeObserver 监听容器高度变化
  let resizeObserver = null;

  // 防抖处理 resize
  const handleResize = debounce(height => {
    containerHeight.value = height;
  }, 100);

  onMounted(() => {
    if (containerRef.value) {
      // 初始获取高度
      containerHeight.value = containerRef.value.clientHeight;

      // 监听高度变化
      resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          handleResize(entry.contentRect.height);
        }
      });
      resizeObserver.observe(containerRef.value);
    }
  });

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  // 可见项目数量（根据容器高度动态计算）
  const visibleCount = computed(() => Math.ceil(containerHeight.value / props.itemHeight));

  // 列表总高度
  const totalHeight = computed(() => props.songs.length * props.itemHeight);

  // 当前滚动位置
  const scrollTop = ref(0);

  // 起始索引（考虑缓冲区）
  const startIndex = computed(() => {
    const index = Math.floor(scrollTop.value / props.itemHeight) - props.buffer;
    return Math.max(0, index);
  });

  // 结束索引（考虑缓冲区）
  const endIndex = computed(() => {
    const index = startIndex.value + visibleCount.value + props.buffer * 2;
    return Math.min(props.songs.length, index);
  });

  // 内容层的偏移量
  const offsetY = computed(() => startIndex.value * props.itemHeight);

  // 可见的歌曲列表
  const visibleSongs = computed(() => {
    return props.songs.slice(startIndex.value, endIndex.value);
  });

  // 滚动处理
  const handleScroll = event => {
    scrollTop.value = event.target.scrollTop;
  };

  const onRowClick = song => {
    musicStore.startSong(song);
    musicStore.setPlaylist(props.songs);
  };
</script>

<style lang="scss" scoped>
  .virtual-list-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .virtual-list-header {
    display: flex;
    align-items: center;
    height: 20px;
    padding: 0 10px;
    color: var(--font-color-grey2);
    font-size: 12px;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
    background-color: var(--body-bgcolor);

    .header-index {
      width: 70px;
      flex-shrink: 0;
    }

    .header-img {
      width: 50px;
      margin-right: 20px;
      flex-shrink: 0;
    }

    .header-name {
      flex: 1;
      min-width: 0;
    }

    .header-artist,
    .header-album,
    .header-duration {
      flex: 0 0 120px;
      margin-right: 20px;
    }
  }

  .virtual-list {
    flex: 1;
    height: 0;
    min-height: 200px;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    position: relative;
    background-color: var(--body-bgcolor);

    &::-webkit-scrollbar {
      display: none;
    }

    .virtual-list-spacer {
      pointer-events: none;
    }

    .virtual-list-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }
</style>
