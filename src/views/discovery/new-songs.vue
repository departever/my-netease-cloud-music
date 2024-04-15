<template>
    <div class="new-songs" v-if="list.length">
        <Title>最新音乐</Title>
        <div class="list-wrap">
            <div :key="listIndex" class="list" v-for="(list, listIndex) in thunkedList">
                <SongCard :key="item.id" :order="getSongOrder(listIndex, index)" @click="onClickSong(listIndex, index)"
                    class="song-card" v-bind="normalizeSong(item)" v-for="(item, index) in list" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getNewSongs } from '@/api/discovery';
import SongCard from '@/components/song-card.vue';
import { createSong } from '@/utils/business';

const songsLimit = 10;
const chunkLimit = Math.ceil(songsLimit / 2);
const list = ref([]);

onMounted(async () => {
    const { result } = await getNewSongs();
    list.value = result;
});

const getSongOrder = (listIndex, index) => {
    return listIndex * chunkLimit + index + 1;
};

const normalizeSong = (song) => {
    const {
        id,
        name,
        song: {
            mvid,
            artists,
            album: { blurPicUrl },
            duration
        }
    } = song;
    return createSong({
        id,
        name,
        img: blurPicUrl,
        artists,
        duration,
        mvId: mvid
    });
};

// 这里因为getSongOrder是从1开始显示, 所以当做数组下标需要减一
const onClickSong = (listIndex, index) => {
    const normalizedSongIndex = getSongOrder(listIndex, index) - 1;
    const normalizedSong = normalizedSongs.value[normalizedSongIndex];
    startSong(normalizedSong);
    setPlaylist(normalizedSongs.value);
};

const thunkedList = computed(() => [
    list.value.slice(0, chunkLimit),
    list.value.slice(chunkLimit, list.value.length)
]);

const normalizedSongs = computed(() => list.value.map(song => normalizeSong(song)));
</script>

<style lang="scss" scoped>
.new-songs {
    margin-bottom: 36px;

    .list-wrap {
        display: flex;

        .list {
            flex: 1;
            overflow: hidden;
        }
    }
}
</style>