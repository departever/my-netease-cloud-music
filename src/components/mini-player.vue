// 底部播放栏组件
<template>
  <div class="mini-player" id="mini-player">
    <!-- 歌曲内容 -->
    <div class="song">
      <template v-if="hasCurrentSong">
        <div @click="togglePlayerShow" class="img-wrap">
          <div class="mask"></div>
          <img :src="$utils.genImgUrl(currentSong.img, 80)" class="blur" />
          <div class="player-control">
            <Icon :size="24" :type="playControlIcon" color="white" />
          </div>
        </div>
        <div class="content">
          <div class="top">
            <p class="name">{{ currentSong.name }}</p>
            <p class="split">-</p>
            <p class="artists">{{ currentSong.artistsText }}</p>
          </div>
          <div class="time">
            <span class="played-time">{{
        $utils.formatTime(currentTime)
      }}</span>
            <span class="split">/</span>
            <span class="total-time">{{
          $utils.formatTime(currentSong.duration / 1000)
        }}</span>
          </div>
        </div>
      </template>
    </div>
    <!-- 控制台 -->
    <div class="control">
      <Icon :size="24" @click="prev" class="icon" type="prev" />
      <el-popover :visible="isPlayErrorPromptShow" placement="top" trigger="manual" width="160">
        <template v-slot:reference>
          <div @click="togglePlaying" class="play-icon">
            <Icon :size="24" :type="playIcon" />
          </div>
        </template>
        <p>请点击开始播放。</p>
      </el-popover>

      <Icon :size="24" @click="next" class="icon" type="next" />
    </div>

    <div class="mode">
      <!-- 模式 -->
      <el-popover placement="top" trigger="hover" width="160">
        <template v-slot:reference>
          <Icon :size="20" :type="modeIcon" @click="onChangePlayMode" class="mode-item" />
        </template>
        <p>{{ playModeText }}</p>
      </el-popover>

      <!-- 播放列表 -->
      <el-popover :visible="isPlaylistPromptShow" placement="top" trigger="manual" width="160">
        <template v-slot:reference>
          <Icon :size="20" @click="togglePlaylistShow" class="mode-item" type="playlist" />
        </template>
        <p>已更新歌单</p>
      </el-popover>

      <!-- 音量 -->
      <div class="volume-item">
        <Volume :volume="volume" @volumeChange="onVolumeChange" />
      </div>
      <!-- github -->
      <Icon :size="20" @click="goGitHub" class="mode-item" type="github" />
    </div>
    <div class="progress-bar-wrap">
      <ProgressBar :disabled="!hasCurrentSong" :percent="playedPercent" @percentChange="onProgressChange" />
    </div>
    <audio :src="currentSong.url" @canplay="ready" @ended="end" @timeupdate="updateTime" ref="audio"></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useMusicStore } from "@/store/music";
import Storage from "good-storage";
import { VOLUME_KEY, playModeMap, isDef } from "@/utils";

const musicStore = useMusicStore();

const DEFAULT_VOLUME = 0.75;
const isPlayErrorPromptShow = ref(false);
const songReady = ref(false);
const volume = ref(Storage.get(VOLUME_KEY, DEFAULT_VOLUME));
const audio = ref(null);
const isPlaylistPromptShow = ref(false);

onMounted(() => {
  audio.value.volume = volume.value;
});

function togglePlaying() {
  if (!musicStore.currentSong.id) {
    return;
  }
  musicStore.setPlayingState(!musicStore.playing);
}

function ready() {
  songReady.value = true;
}

async function play() {
  if (songReady.value) {
    try {
      await audio.value.play();
      isPlayErrorPromptShow.value = false;
    } catch (error) {
      isPlayErrorPromptShow.value = true;
      musicStore.setPlayingState(false);
    }
  }
}

function pause() {
  audio.value.pause();
}

function updateTime(e) {
  const time = e.target.currentTime;
  musicStore.setCurrentTime(time);
}

function prev() {
  if (songReady.value) {
    musicStore.startSong(musicStore.prevSong);
  }
}

function next() {
  if (songReady.value) {
    musicStore.startSong(musicStore.nextSong);
  }
}

function end() {
  next();
}

function onProgressChange(percent) {
  audio.value.currentTime = musicStore.currentSong.durationSecond * percent;
  musicStore.setPlayingState(true);
}

function onVolumeChange(percent) {
  audio.value.volume = percent;
  Storage.set(VOLUME_KEY, percent);
}

function onChangePlayMode() {
  const modeKeys = Object.keys(playModeMap);
  const currentModeIndex = modeKeys.findIndex(
    key => playModeMap[key].code === musicStore.playMode
  );
  const nextIndex = (currentModeIndex + 1) % modeKeys.length;
  const nextModeKey = modeKeys[nextIndex];
  const nextMode = playModeMap[nextModeKey];
  musicStore.setPlayMode(nextMode.code);
}

function togglePlaylistShow() {
  musicStore.setPlaylistShow(!musicStore.isPlaylistShow);
}

function togglePlayerShow() {
  musicStore.setPlayerShow(!musicStore.isPlayerShow);
}

function goGitHub() {
  window.open("https://github.com/departever/my-netease-cloud-music");
}

watch(() => musicStore.currentSong, (newSong, oldSong) => {
  if (!newSong.id) {
    audio.value.pause();
    audio.value.currentTime = 0;
    return;
  }
  if (oldSong && newSong.id === oldSong.id) {
    musicStore.setCurrentTime(0);
    audio.value.currentTime = 0;
    play();
    return;
  }
  songReady.value = false;
  setTimeout(() => {
    play();
  }, 1000);
});

watch(() => musicStore.playing, (newPlaying) => {
  newPlaying ? play() : pause();
});

const hasCurrentSong = computed(() => isDef(musicStore.currentSong.id));
const playIcon = computed(() => musicStore.playing ? "pause" : "play");
const currentMode = computed(() => playModeMap[musicStore.playMode]);
const modeIcon = computed(() => currentMode.value.icon);
const playModeText = computed(() => currentMode.value.name);
const playedPercent = computed(() => {
  const durationSecond = musicStore.currentSong.durationSecond;
  return Math.min(musicStore.currentTime / durationSecond, 1) || 0;
});
const playControlIcon = computed(() => musicStore.isPlayerShow ? "shrink" : "open");
const currentSong = computed(() => musicStore.currentSong);
const currentTime = computed(() => musicStore.currentTime);
</script>

<style lang="scss" scoped>
.mini-player {
  position: relative;
  position: fixed;
  z-index: $mini-player-z-index;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  height: $mini-player-height;
  padding: 8px 16px;
  padding-right: 24px;
  background: var(--body-bgcolor);

  .song {
    display: flex;
    flex: 4;
    overflow: hidden;

    .img-wrap {
      position: relative;
      margin-right: 8px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      @include img-wrap(40px);

      img {
        &.blur {
          filter: blur(2px);
        }
      }

      .player-control {
        @include abs-center;
      }

      .mask {
        @include abs-stretch;
        background: rgba(0, 0, 0, 0.2);
      }
    }

    .content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .top {
        display: flex;
        align-items: flex-end;
        white-space: nowrap;

        .name {
          color: var(--font-color-white);
          @include text-ellipsis;
        }

        .split {
          font-size: $font-size-xs;
          margin: 0 4px;
        }

        .artists {
          font-size: $font-size-xs;
          @include text-ellipsis;
        }
      }

      .time {
        font-size: $font-size-xs;
        color: var(--font-color-grey);

        .split {
          margin: 0 4px;
        }
      }
    }
  }

  .control {
    position: absolute;
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    @include flex-center();

    .play-icon {
      @include flex-center();
      position: relative;
      width: 45px;
      height: 45px;
      margin: 0 16px;
      border-radius: 50%;
      background: $theme-color;
      cursor: pointer;

      i {
        color: #fff;
      }

      .icon-play {
        transform: translateX(1px);
      }
    }

    .icon {
      color: $theme-color;
    }
  }

  .mode {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 6;

    .mode-item {
      display: block;
      margin-right: 16px;
      width: 22px;
    }

    .volume-item {
      margin-right: 22px;
    }
  }

  .progress-bar-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: -14px;
  }
}

.icon {
  color: var(--font-color);
  cursor: pointer;
}
</style>
