<template>
    <div class="songs">
        <div class="tabs">
            <Tabs :tabs="tabs" @tabChange="getSongs" align="right" type="small" :active="activeTabIndex" />
        </div>
        <VirtualList :songs="songs" header-row-class-name="header-row" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTopSongs } from "@/api";
import { createSong } from "@/utils/business";
import VirtualList from "@/components/vitural-list.vue";

const activeTabIndex = ref(0);
const songs = ref([]);
const tabs = ref([
    { title: "全部", type: 0 },
    { title: "华语", type: 7 },
    { title: "欧美", type: 96 },
    { title: "日本", type: 8 },
    { title: "韩国", type: 16 }
]);

async function fetchSongs() {
    const { data } = await getTopSongs(tabs.value[activeTabIndex.value].type);
    songs.value = data.map(song => {
        const {
            id,
            name,
            artists,
            duration,
            mvid,
            album: { picUrl, name: albumName }
        } = song;
        return createSong({
            id,
            name,
            artists,
            duration,
            albumName,
            img: picUrl,
            mvId: mvid
        });
    });
}

function getSongs(newIndex) {
    activeTabIndex.value = newIndex;
    fetchSongs();
}

onMounted(() => {
    fetchSongs();
});
</script>

<style lang="scss">
.songs {
    padding: 12px;

    .header-row {
        display: none;
    }
}
</style>
