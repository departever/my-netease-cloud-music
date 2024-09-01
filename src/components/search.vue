<template>
  <div class="search">
    <el-input @click="onClickInput" @input="onInput" @keypress.enter="onEnterPress" @blur="onBlur" placeholder="搜索"
      :prefix-icon="Search" ref="input" v-model.trim="searchKeyword"></el-input>
    <Toggle :reserveDoms="[$refs.input && $refs.input.$el]" :show.sync="searchPanelShow">
      <div class="search-panel" v-show="searchPanelShow">
        <div class="search-suggest" v-if="suggestShow">
          <div :key="index" class="suggest-item" v-for="(normalizedSuggest, index) in normalizedSuggests">
            <div class="title">
              <Icon :size="12" :type="normalizedSuggest.icon" />
              {{ normalizedSuggest.title }}
            </div>
            <ul class="list">
              <li :key="item.id" @mousedown.prevent="normalizedSuggest.onClick(item)" class="item"
                v-for="item in normalizedSuggest.data">
                <HighlightText :highlightText="searchKeyword"
                  :text="normalizedSuggest.renderName ? normalizedSuggest.renderName(item) : item.name" />
              </li>
            </ul>
          </div>
        </div>
        <div class="search-hots" v-else>
          <div class="block">
            <p class="title">热门搜索</p>
            <div class="tags">
              <NButton :key="index" @click="onClickHot(hot)" class="button" v-for="(hot, index) in searchHots">
                {{ hot.first }}
              </NButton>
            </div>
          </div>
          <div class="block">
            <p class="title">搜索历史</p>
            <div class="tags" v-if="searchHistorys.length">
              <NButton :key="index" @click="onClickHot(history)" class="button"
                v-for="(history, index) in searchHistorys">
                {{ history.first }}
              </NButton>
            </div>
            <div class="empty" v-else>暂无搜索历史</div>
          </div>
        </div>
      </div>
    </Toggle>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import storage from 'good-storage';
import { useMusicStore } from '@/store/music';
import { useRouter } from 'vue-router';
import { getSearchHot, getSearchSuggest } from '@/api';
import { createSong, genArtistisText } from '@/utils/business';
import { debounce } from '@/utils';
import { Search } from '@element-plus/icons-vue';

const SEARCH_HISTORY_KEY = '__search_history__';
const searchPanelShow = ref(false);
const searchKeyword = ref('');
const searchHots = ref([]);
const searchHistorys = ref(storage.get(SEARCH_HISTORY_KEY, []));
const suggest = ref({});
const reserveDoms = ref([]);
const router = useRouter();

const musicStore = useMusicStore();

onMounted(async () => {
  const { result: { hots } } = await getSearchHot();
  searchHots.value = hots;
});

const onClickInput = () => {
  searchPanelShow.value = true;
};

const onBlur = () => {
  // 延时关闭，确保点击推荐选项时不会立即关闭面板
  setTimeout(() => {
    searchPanelShow.value = false;
  }, 200);
};

const onInput = debounce(async (value) => {
  if (!value.trim()) {
    return;
  }
  const { result } = await getSearchSuggest(value);
  suggest.value = result;
}, 500);

const onClickHot = (hot) => {
  const { first } = hot;
  goSearch(first);
};

const onEnterPress = () => {
  if (searchKeyword.value) {
    goSearch(searchKeyword.value);
  }
};

const goSearch = (keywords) => {
  searchHistorys.value.push({ first: keywords });
  storage.set(SEARCH_HISTORY_KEY, searchHistorys.value);
  router.push(`/search/${keywords}`);
  searchPanelShow.value = false;
};

const onClickSong = async (item) => {
  const {
    id,
    name,
    artists,
    duration,
    mvid,
    album: { id: albumId, name: albumName }
  } = item;
  const song = createSong({
    id,
    name,
    artists,
    duration,
    albumId,
    albumName,
    mvId: mvid
  });
  musicStore.startSong(song);
  musicStore.addToPlaylist(song);
};

const onClickPlaylist = (item) => {
  const { id } = item;
  router.push(`/playlist/${id}`);
  searchPanelShow.value = false;
};

const onClickMv = (mv) => {
  const { id } = mv;
  router.push(`/mv/${id}`);
};

const suggestShow = computed(() => {
  return (
    searchKeyword.value.length &&
    ['songs', 'playlists'].find(key => {
      return suggest.value[key] && suggest.value[key].length;
    })
  );
});

const normalizedSuggests = computed(() => {
  return [
    {
      title: '单曲',
      icon: 'music',
      data: suggest.value.songs,
      renderName(song) {
        return `${song.name} - ${genArtistisText(song.artists)}`;
      },
      onClick: onClickSong
    },
    {
      title: '歌单',
      icon: 'playlist',
      data: suggest.value.playlists,
      onClick: onClickPlaylist
    },
    {
      title: 'mv',
      icon: 'mv',
      data: suggest.value.mvs,
      renderName(mv) {
        return `${mv.name} - ${genArtistisText(mv.artists)}`;
      },
      onClick: onClickMv
    }
  ].filter(item => item.data && item.data.length);
});
</script>


<style lang="scss" scoped>
.search {
  position: relative;
  width: 150px;

  .search-panel {
    position: fixed;
    top: $header-height;
    bottom: $mini-player-height;
    right: 0;
    width: 350px;
    background: var(--search-bgcolor);
    z-index: $search-panel-z-index;
    font-size: $font-size-sm;
    overflow-y: auto;
    @include box-shadow;

    .block {
      padding: 16px 24px;

      .title {
        color: var(--font-color-grey);
        margin-bottom: 16px;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;

        .button {
          margin-bottom: 12px;
          margin-right: 6px;
          font-size: $font-size-sm;
        }
      }

      .empty {
        @include flex-center();
        color: var(--font-color-grey);
        font-size: $font-size;
        height: 100px;
      }
    }

    .suggest-item {
      margin-bottom: 16px;

      .title {
        margin: 16px 8px 8px;
        color: var(--font-color-grey-shallow);
      }

      .list {
        .item {
          padding: 12px 24px;
          cursor: pointer;
          @include text-ellipsis();

          &:hover {
            background: var(--light-bgcolor);
          }
        }
      }
    }
  }
}
</style>
