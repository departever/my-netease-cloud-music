// mv详情页面
<template>
    <div class="mv" v-if="$utils.isDef(mvDetail.id)">
        <div class="mv-content">
            <div class="left">
                <p class="title">mv详情</p>

                <div class="player">
                    <VedioPlayer :url="mvPlayInfo.url" :poster="mvDetail.cover" ref="video" />
                </div>

                <div class="author-wrap">
                    <div class="avatar">
                        <img v-lazy="$utils.genImgUrl(artist.picUrl, 120)" />
                    </div>
                    <p class="author">{{ artist.name }}</p>
                </div>

                <p class="name">{{ mvDetail.name }}</p>

                <div class="desc">
                    <span class="date">发布：{{ $utils.formatDate(mvDetail.publishTime, "yyyy-MM-dd") }}</span>
                    <span class="count">播放：{{ mvDetail.playCount }}次</span>
                </div>

                <div class="comments">
                    <Comments :id="id" type="mv" />
                </div>
            </div>
            <div class="right">
                <p class="title">相关推荐</p>
                <div class="simi-mvs">
                    <Card :desc="`by ${simiMv.artistName}`" :key="simiMv.id" :name="simiMv.name"
                        @click="$utils.goMv(simiMv.id)" class="simi-mv-card" v-for="simiMv in simiMvs">
                        <template #img-wrap>
                            <MvCard :duration="simiMv.duration" :img="simiMv.cover" :playCount="simiMv.playCount" />
                        </template>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { watchEffect, ref, onMounted, watch } from 'vue';
import { getMvDetail, getMvUrl, getSimiMv } from "@/api/mv";
import { getArtists } from "@/api/artist"
import { usePlayerStore } from "@/store/music"

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const videoRef = ref(null);
const playerStore = usePlayerStore();
const mvDetail = ref({});
const mvPlayInfo = ref({});
const artist = ref({});
const simiMvs = ref([]);

const init = async () => {
    const [
        { data: mvDetailData },
        { data: mvPlayInfoData },
        { mvs: simiMvsData },
    ] = await Promise.all([
        getMvDetail(props.id),
        getMvUrl(props.id),
        getSimiMv(props.id),
    ]);
    const { artist: artistData } = await getArtists(mvDetailData.artistId);

    mvDetail.value = mvDetailData;
    mvPlayInfo.value = mvPlayInfoData;
    artist.value = artistData;
    simiMvs.value = simiMvsData;
};

onMounted(() => {
  init();

  watchEffect(() => {
    if (videoRef.value && videoRef.value.player) {
      const player = videoRef.value.player;
      player.on('play', () => {
        // 停止播放歌曲
        playerStore.setPlayingState(false);
      });
    }
  });
});

watch(() => props.id, (newId, oldId) => {
    if (newId !== oldId) {
        init();
    }
});
</script>

<style lang="scss" scoped>
.mv {
    padding: $page-padding;

    .title {
        margin-bottom: 16px;
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
    }

    .mv-content {
        display: flex;
        max-width: 950px;
        margin: auto;

        .left {
            flex: 1;

            .player {
                margin-bottom: 16px;
                overflow: hidden;
                border-radius: 4px;
            }

            .author-wrap {
                display: flex;
                align-items: center;
                margin-bottom: 32px;

                .avatar {
                    @include img-wrap(60px);
                    margin-right: 8px;

                    img {
                        @include round(60px);
                    }
                }

                .author {
                    font-size: $font-size-lg;
                }
            }

            .name {
                margin-bottom: 16px;
                font-size: $font-size-title-lg;
                font-weight: $font-weight-bold;
            }

            .desc {
                display: flex;
                color: var(--font-color-grey-shallow);
                font-size: $font-size-sm;

                .date {
                    display: inline-block;
                    margin-right: 24px;
                }
            }

            .comments {
                margin-top: 48px;
            }
        }

        .right {
            width: 36%;
            padding-left: 32px;

            .simi-mvs {
                padding: -8px 0;

                .simi-mv-card {
                    padding: 8px 0;
                }
            }
        }
    }
}
</style>