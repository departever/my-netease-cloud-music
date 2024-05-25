<template>
  <el-table v-if="songs.length" :data="songs" class="song-table" :cell-class-name="tableCellClassName"
    header-cell-class-name="title-th" style="width: 99.9%" @row-click="onRowClick">
    <el-table-column v-for="(column, index) in showColumns" :key="index" :prop="column.prop" :label="column.label"
      :width="column.width">
      <template v-slot:default="scope">
        <div v-if="column.prop === 'index'" class="index-wrap">
          <Icon v-if="isActiveSong(scope.row)" class="horn" type="horn" color="theme" />
          <span v-else>{{ pad(scope.$index + 1) }}</span>
        </div>
        <div v-if="column.prop === 'img'" class="img-wrap">
          <img :src="scope.row.img" />
          <PlayIcon class="play-icon" />
        </div>
        <div v-if="column.prop === 'name'">
          <div class="song-table-name-cell">
            <HighlightText class="song-table-name" :text="scope.row.name" :highlight-text="highlightText" />
            <Icon v-if="scope.row.mvId" class="mv-icon" @click="goMvWithCheck(scope.row.mvId)" type="mv" color="theme"
              :size="18" />
          </div>
          <NameDescRenderer v-if="scope.row.alias" :alias="scope.row.alias" :highlightText="highlightText" />
        </div>
        <div v-if="column.prop === 'artistsText'">
          {{ scope.row.artistsText }}
        </div>
        <div v-if="column.prop === 'albumName'">
          {{ scope.row.albumName }}
        </div>
        <span v-if="column.prop === 'durationSecond'">
          {{ $utils.formatTime(scope.row.durationSecond) }}
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMusicStore } from '@/store/music';
import { ElTable, ElTableColumn } from 'element-plus';
import { pad } from '@/utils';
import { goMvWithCheck } from '@/utils/business'

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
  renderNameDesc: {
    type: Function,
  },
});

const musicStore = useMusicStore();
const currentSong = computed(() => musicStore.currentSong);
const isActiveSong = (song) => song.id === currentSong.value.id;

const columns = ref([]);

const showColumns = computed(() => {
  const hideColumns = props.hideColumns.slice();
  const reference = props.songs[0];
  const { img } = reference;
  if (!img) {
    hideColumns.push('img');
  }
  return columns.value.filter(column => {
    return !hideColumns.find(hideColumn => hideColumn === column.prop);
  });
});

const onRowClick = (song) => {
  musicStore.startSong(song);
  musicStore.setPlaylist(props.songs);
};

const tableCellClassName = ({ row, columnIndex }) => {
  let retCls = [];
  if (isActiveSong(row) && columnIndex === showColumns.value.findIndex(({ prop }) => prop === 'name')) {
    retCls.push('song-active');
  }
  return retCls.join(' ');
};

// 定义columns
columns.value = [
  {
    prop: "index",
    label: "",
    width: "70",
  },
  {
    prop: "img",
    label: " ",
    width: "100",
  },
  {
    prop: "name",
    label: "音乐标题",
    className: "title-td",
  },
  {
    prop: "artistsText",
    label: "歌手",
  },
  {
    prop: "albumName",
    label: "专辑",
  },
  {
    prop: "durationSecond",
    label: "时长",
    width: "100",
  },
];
</script>

<style lang="scss">
.song-table {
  .title-th {
    color: var(--font-color-grey2);
    font-weight: normal;
  }

  .title-td {
    color: var(--font-color-white);
  }

  .padding-space {
    padding-left: 24px;
  }

  .song-active {
    color: $theme-color;

    .high-light-text {
      color: $theme-color;
    }
  }

  .index-wrap {
    text-align: center;
    color: var(--font-color-grey-shallow);
  }

  .img-wrap {
    position: relative;
    @include img-wrap(60px);

    img {
      border-radius: 4px;
    }

    .play-icon {
      @include abs-center;
    }
  }

  .high-light-text {
    color: $blue;
  }

  .song-table-name-cell {
    @include text-ellipsis;
    display: flex;
    align-items: center;
    flex: 0 0 24px;

    .song-table-name {
      overflow: hidden;
      @include text-ellipsis;
    }

    .mv-icon {
      width: 24px;
      margin-left: 4px;
    }
  }
}
</style>