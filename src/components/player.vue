<template>
  <transition name="slide">
    <div v-if="musicStore.hasCurrentSong" :class="getPlayerShowCls()" class="player">
      <div class="content">
        <div class="song">
          <div class="left">
            <img class="play-bar-support" src="@/assets/image/play-bar-support.png" />
            <img :class="{ playing }" class="play-bar" src="@/assets/image/play-bar.png" />
            <div class="img-outer-border" ref="disc">
              <div :class="{ paused: !playing }" class="img-outer" ref="discRotate">
                <div class="img-wrap">
                  <img v-lazy="$utils.genImgUrl(musicStore.currentSong.img, 400)" />
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="name-wrap">
              <p class="name">{{ musicStore.currentSong.name }}</p>
              <span @click="onGoMv" class="mv-tag" v-if="musicStore.currentSong.mvId">MV</span>
            </div>
            <div class="desc">
              <div class="desc-item">
                <span class="label">歌手：</span>
                <div class="value">{{ musicStore.currentSong.artistsText }}</div>
              </div>
            </div>
            <empty v-if="nolyric">还没有歌词哦~</empty>
            <Scroller :data="lyric" :options="{ disableTouch: true }" @init="onInitScroller" class="lyric-wrap" ref="scroller" v-else>
              <div>
                <div :class="getActiveCls(index)" :key="index" class="lyric-item" :ref="setLyricRef"
                  v-for="(l, index) in lyricWithTranslation">
                  <p :key="contentIndex" class="lyric-text" v-for="(content, contentIndex) in l.contents">{{ content }}</p>
                </div>
              </div>
            </Scroller>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <Comments :id="musicStore.currentSong.id" ref="comments" v-if="musicStore.currentSong.id" />
          </div>
          <div class="right" v-if="simiPlaylists.concat(simiSongs).length">
            <Loading :loading="simiLoading" v-if="simiLoading" />
            <div v-else>
              <div class="simi-playlists" v-if="simiPlaylists.length">
                <p class="title">包含这首歌的歌单</p>
                <div :key="simiPlaylist.id" class="simi-item" v-for="simiPlaylist in simiPlaylists">
                  <Card :img="simiPlaylist.coverImgUrl" :name="simiPlaylist.name" @click="onClickPlaylist(simiPlaylist.id)">
                    <template v-slot:desc>
                      <div class="desc">
                        <Icon :size="12" color="shallow" type="play" />
                        <p class="count">{{ $utils.formatNumber(simiPlaylist.playCount) }}</p>
                      </div>
                    </template>
                  </Card>
                </div>
              </div>
              <div class="simi-songs" v-if="simiSongs.length">
                <p class="title">相似歌曲</p>
                <div :key="simiSong.id" class="simi-item" v-for="simiSong in simiSongs">
                  <Card :desc="simiSong.artistsText" :img="simiSong.img" :name="simiSong.name" @click="onClickSong(simiSong)">
                    <template v-slot:img-mask>
                      <PlayIcon class="play-icon" />
                    </template>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLyric, getSimiSongs, getSimiPlaylists } from '@/api'
import lyricParser from '@/utils/lrcparse'
import { debounce, isDef } from '@/utils'
import { createSong, goMvWithCheck } from '@/utils/business'
import { useMusicStore } from '@/store/music'
import Comments from "@/components/comments.vue"


const WHEEL_TYPE = 'wheel'
const SCROLL_TYPE = 'scroll'
// 恢复自动滚动的定时器时间
const AUTO_SCROLL_RECOVER_TIME = 1000

const musicStore = useMusicStore()
const route = useRoute()
const router = useRouter()

const lyricScrolling = ref({

  [WHEEL_TYPE]: false,
  [SCROLL_TYPE]: false

})
const lyricTimer = ref({

  [WHEEL_TYPE]: null,
  [SCROLL_TYPE]: null

})

const lyric = ref([])
const tlyric = ref([])
const simiLoading = ref(false)
const simiPlaylists = ref([])
const simiSongs = ref([])
const nolyric = ref(false)
const scroller = ref(null)

const lyricRefs = ref([])

const setLyricRef = (el) => {
  if (el) {
    lyricRefs.value.push(el)
  }
}

const updateLyric = async () => {
  const result = await getLyric(musicStore.currentSong.id)
  nolyric.value = !isDef(result.lrc) || !result.lrc.lyric || !result.tlyric
  if (!nolyric.value) {
    const { lyric: parsedLyric, tlyric: parsedTlyric } = lyricParser(result)
    lyric.value = parsedLyric
    tlyric.value = parsedTlyric
  }
}

const updateSimi = async () => {
  simiLoading.value = true
  const [simiPlaylistsResult, simiSongsResult] = await Promise.all([
    getSimiPlaylists(musicStore.currentSong.id),
    getSimiSongs(musicStore.currentSong.id)
  ]).finally(() => {
    simiLoading.value = false
  })
  simiPlaylists.value = simiPlaylistsResult.playlists
  simiSongs.value = simiSongsResult.songs.map(song => {
    const {
      id,
      name,
      artists,
      mvid,
      album: { picUrl },
      duration
    } = song
    return createSong({
      id,
      name,
      artists,
      duration,
      img: picUrl,
      mvId: mvid
    })
  })
}

const updateSong = async () => {
  await updateLyric()
  await updateSimi()
}

const getPlayerShowCls = () => (musicStore.isPlayerShow ? 'show' : 'hide')
const getActiveCls = index => (activeLyricIndex.value === index ? 'active' : '')

const onInitScroller = scrollerInstance => {
  scroller.value = scrollerInstance
  const onScrollStart = type => {
    clearTimer(type)
    lyricScrolling.value[type] = true
  }
  const onScrollEnd = type => {
    clearTimer(type)
    lyricTimer.value[type] = setTimeout(() => {
      lyricScrolling.value[type] = false                        
    }, AUTO_SCROLL_RECOVER_TIME)
  }
  scroller.value.on('scrollStart', onScrollStart.bind(null, SCROLL_TYPE))
  scroller.value.on("mousewheelStart", onScrollStart.bind(null, WHEEL_TYPE))
  scroller.value.on('scrollEnd', onScrollEnd.bind(null, SCROLL_TYPE))
  scroller.value.on("mousewheelEnd", onScrollEnd.bind(null, WHEEL_TYPE))
}

const scrollToActiveLyric = () => {
  if (activeLyricIndex.value !== -1) {
    const activeLyricElement = lyricRefs.value[activeLyricIndex.value]
    if (activeLyricElement) {
      scroller.value.getScroller().scrollToElement(activeLyricElement, 200, 0, true)
    }
  }
}

const clearTimer = type => {
  if (lyricTimer.value[type]) {
    clearTimeout(lyricTimer.value[type])
  }
}

const onClickPlaylist = id => {
  if (id === Number(route.params.id)) {
    musicStore.setPlayerShow(false)
  } else {
    router.push(`/playlist/${id}`)
  }
}

const onClickSong = song => {
  musicStore.startSong(song)
  musicStore.addToPlaylist(song)
}

const onGoMv = () => {
  musicStore.setPlayerShow(false)
  goMvWithCheck(musicStore.currentSong.mvId)
}

const resizeScroller = debounce(() => {
  if (scroller && scroller.getScroller) {
    scroller.getScroller().refresh()
  }
}, 500)

const addResizeListener = () => {
  window.addEventListener('resize', resizeScroller)
}

const removeResizeListener = () => {
  window.removeEventListener('resize', resizeScroller)
}

const playing = computed(() => musicStore.playing);

const activeLyricIndex = computed(() => {
  return lyricWithTranslation.value
    ? lyricWithTranslation.value.findIndex((l, index) => {
      const nextLyric = lyricWithTranslation.value[index + 1]
      return (
        musicStore.currentTime >= l.time &&
        (nextLyric ? musicStore.currentTime < nextLyric.time : true)
      )
    })
    : -1
})

const lyricWithTranslation = computed(() => {
  let ret = []
  const lyricFiltered = lyric.value.filter(({ content }) => Boolean(content))
  if (lyricFiltered.length) {
    lyricFiltered.forEach(l => {
      const { time, content } = l
      const lyricItem = { time, content, contents: [content] }
      const sameTimeTLyric = tlyric.value.find(
        ({ time: tLyricTime }) => tLyricTime === time
      )
      if (sameTimeTLyric) {
        const { content: tLyricContent } = sameTimeTLyric
        if (content) {
          lyricItem.contents.push(tLyricContent)
        }
      }
      ret.push(lyricItem)
    })
  } else {
    ret = lyricFiltered.map(({ time, content }) => ({
      time,
      content,
      contents: [content]
    }))
  }
  return ret
})

watch(
  () => musicStore.isPlayerShow,
  show => {
    if (show) {
      updateSimi()
      addResizeListener()
      nextTick(() => {
        scrollToActiveLyric()
      })
    } else {
      removeResizeListener()
    }
  }
)

watch(
  () => musicStore.currentSong,
  (newSong, oldSong) => {
    if (!newSong.id) {
      musicStore.setPlayerShow(false)
      return
    }
    if (newSong.id === oldSong.id) {
      return
    }
    if (musicStore.isPlayerShow) {
      updateSong()
    } else {
      updateLyric()
    }
  }
)

watch(
  () => activeLyricIndex.value,
  (newIndex, oldIndex) => {
    if (
      newIndex !== oldIndex &&
      !lyricScrolling.value[WHEEL_TYPE] &&
      !lyricScrolling.value[SCROLL_TYPE]
    ) {
      nextTick(() => {
        scrollToActiveLyric()
      })
    }
  }
)

watch(route, () => {
  musicStore.setPlayerShow(false)
})

onMounted(() => {
  resizeScroller()
  addResizeListener()
})

onBeforeUnmount(() => {
  removeResizeListener()
})
</script>


<style lang="scss" scoped>
@use 'sass:math';

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(1turn);
  }
}

$img-left-padding: 36px;
$img-outer-border-d: 320px;
$img-outer-d: 300px;

.player {
  position: fixed;
  top: $header-height;
  bottom: $mini-player-height;
  left: 0;
  right: 0;
  padding: 0 36px;
  background: var(--player-bgcolor);
  z-index: $song-detail-z-index;
  overflow: hidden;
  overflow-y: auto;
  transition: transform 0.5s;

  &.hide {
    transform: translateY(105%);
  }

  &.show {
    transform: none;
  }

  .content {
    max-width: 870px;
    margin: auto;

    .song {
      display: flex;

      .left {
        position: relative;
        padding: 80px 70px 0 $img-left-padding;
        display: flex;
        justify-content: center;

        $support-d: 30px;
        $support-d-half: math.div($support-d, 2);

        .play-bar-support {
          position: absolute;
          left: calc($img-left-padding + #{math.div($img-outer-border-d, 2)} - #{$support-d-half});
          top: -#{$support-d-half};
          width: $support-d;
          height: $support-d;
          z-index: 2;
        }

        .play-bar {
          $w: 100px;
          $h: 146px;
          position: absolute;
          top: 0;
          left: calc($img-left-padding + #{math.div($img-outer-border-d, 2)} - 6px);
          width: $w;
          height: $h;
          z-index: 1;
          transform-origin: 0 0;
          transform: rotate(-30deg);
          transition: all 0.3s;

          &.playing {
            transform: rotate(5deg);
          }
        }

        .img-outer-border {
          @include round($img-outer-border-d);
          @include flex-center;
          background: var(--song-shallow-grey-bg);

          .img-outer {
            @include round($img-outer-d);
            @include flex-center;
            background: $black;
            background: linear-gradient(-45deg, #333540, #070708, #333540);
            animation: rotate 20s linear infinite;

            &.paused {
              animation-play-state: paused;
            }

            .img-wrap {
              @include img-wrap(200px);

              img {
                border-radius: 50%;
              }
            }
          }
        }
      }

      .right {
        flex: 1;
        padding-top: 45px;

        .name-wrap {
          display: flex;
          align-items: center;
          margin-bottom: 16px;

          .name {
            font-size: $font-size-title-lg;
            color: var(--font-color-white);
          }

          .mv-tag {
            display: inline-block;
            margin-left: 8px;
            padding: 2px;
            border: 1px solid currentColor;
            border-radius: 2px;
            color: $theme-color;
            cursor: pointer;
          }
        }

        .artists {
          margin-bottom: 16px;
        }

        .desc {
          display: flex;
          font-size: $font-size-sm;
          margin-bottom: 30px;

          .desc-item {
            display: flex;
            margin-right: 32px;

            .label {
              display: inline-block;
              margin-right: 4px;
            }

            .value {
              color: $blue;
            }
          }
        }

        .lyric-wrap {
          width: 380px;
          height: 350px;
          mask-image: linear-gradient(180deg,
              hsla(0, 0%, 100%, 0) 0,
              hsla(0, 0%, 100%, 0.6) 15%,
              #fff 25%,
              #fff 75%,
              hsla(0, 0%, 100%, 0.6) 85%,
              hsla(0, 0%, 100%, 0));

          .lyric-item {
            margin-bottom: 16px;
            font-size: $font-size-sm;

            &.active {
              font-size: $font-size;
              color: var(--font-color-white);
              font-weight: $font-weight-bold;
            }

            .lyric-text {
              margin-bottom: 8px;
            }
          }
        }
      }
    }

    .bottom {
      display: flex;
      margin-top: 48px;
      margin-bottom: 36px;

      .left {
        flex: 1;
      }

      .right {
        padding-left: 36px;
        width: 28%;
        overflow: hidden;

        .simi-playlists {
          margin-bottom: 36px;
        }

        .simi-songs {
          .play-icon {
            @include abs-center;
          }
        }

        .simi-item {
          margin-bottom: 6px;
        }

        .title {
          font-size: $font-size-lg;
          font-weight: $font-weight-bold;
          margin-bottom: 12px;
        }

        .desc {
          display: flex;
          align-items: center;

          .count {
            margin-left: 4px;
          }                               
        }
      }
    }
  }
}
</style>
