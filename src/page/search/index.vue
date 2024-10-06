<template>
    <div class="search-detail">
        <div class="header" ref="header">
            <span class="keywords">{{ keywords }}</span>
            <span class="found">找到{{ count }}个结果</span>
        </div>
        <div class="tabs-wrap">
            <Tabs :tabs="tabs" itemClass="search-tab-item" />
        </div>
        <Empty class="empty" v-if="showEmpty">暂无结果</Empty>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { ref, watch, computed, provide } from "vue";
import { useAxiosLoaderStore } from "@/store/global";

const props = defineProps({
    keywords: String
});

const tabs = [
    {
        title: "歌曲",
        key: "songs",
        to: "songs",
    },
    {
        title: "歌单",
        key: "playlists",
        to: "playlists",
    },
    {
        title: "MV",
        key: "mvs",
        to: "mvs",
    },
];

const count = ref(0);

const axiosLoading = useAxiosLoaderStore();

const showEmpty = computed(() => !axiosLoading.value && count.value === 0);

const searchRoot = ref({
    keywords: props.keywords,
    header: ref(null),
    onUpdateCount: (newCount) => {
        count.value = newCount;
    },
});

watch(
    () => props.keywords,
    (newKeywords) => {
        searchRoot.value.keywords = newKeywords;
    },
    { immediate: true }
);

provide('searchRoot', searchRoot);
</script>

<style lang="scss" scoped>
.search-detail {
    .header {
        padding: 20px 32px;

        .keywords {
            display: inline-block;
            margin-right: 4px;
            font-size: $font-size-title-lg;
            font-weight: $font-weight-bold;
        }

        .found {
            font-size: $font-size-sm;
            color: var(--font-color-grey-shallow);
            letter-spacing: 2px;
        }
    }

    .tabs-wrap {
        padding: 0 28px;
        border-bottom: 1px solid var(--border);

        :deep(.search-tab-item) {
            font-size: $font-size;
        }
    }
}
</style>