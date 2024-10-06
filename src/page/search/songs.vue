<template>
    <div class="search-songs">
        <WithPagination :getData="getSearch" :getDataParams="searchParams" :limit="30"
            :scrollTarget="searchRoot.$refs && searchRoot.$refs.header" :total="songCount"
            @getDataSuccess="onGetSearch">
            <div class="table">
                <SongTable :highlightText="keywords" :songs="songs" :stripe="true" />
            </div>
        </WithPagination>
    </div>
</template>

<script setup lang="jsx">
import { ref, inject, computed } from "vue";
import { getSearch } from "@/api";
import SongTable from "@/components/song-table.vue";
import WithPagination from "@/components/with-pagination.vue";
import { createSong } from "@/utils/business";

const songs = ref([]);
const songCount = ref(0);

const searchRoot = inject("searchRoot");

const onGetSearch = ({ result: { songs: newSongs, songCount: newSongCount } }) => {
    songs.value = newSongs.map(song => {
        const { id, mvid, name, alias, artists, duration, album } = song;
        return createSong({
            id,
            name,
            alias,
            artists,
            duration,
            mvId: mvid,
            albumName: album.name,
            albumId: album.id,
        });
    });
    songCount.value = newSongCount;
    searchRoot.value.onUpdateCount(newSongCount);
};

const keywords = computed(() => searchRoot.value.keywords);
const searchParams = computed(() => ({
    keywords: keywords.value,
}));
</script>

<style lang="scss" scoped>
.search-songs {
  .pagination {
    margin-top: 16px;
    text-align: right;
  }
}
</style>