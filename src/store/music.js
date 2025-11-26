import { defineStore } from "pinia";
import storage from "good-storage";
import { PLAY_HISTORY_KEY, playModeMap, isDef, shallowEqual } from "@/utils";
import { getSongImg } from "@/utils/business";

export const useMusicStore = defineStore("music", {
  state: () => ({
    // 当前播放歌曲
    currentSong: {},
    // 当前播放时长
    currentTime: 0,
    // 播放状态
    playing: false,
    // 播放模式
    playMode: playModeMap.sequence.code,
    // 播放列表显示
    isPlaylistShow: false,
    // 播放提示显示
    isPlaylistPromptShow: false,
    // 歌曲详情页显示
    isPlayerShow: false,
    // 播放列表数据
    playlist: [],
    // 播放历史数据
    playHistory: storage.get(PLAY_HISTORY_KEY, []),
    // 菜单显示
    isMenuShow: true,
  }),
  getters: {
    currentIndex(state) {
      return state.playlist.findIndex(({ id }) => id === state.currentSong.id);
    },
    nextSong(state) {
      const nextStratMap = {
        [playModeMap.sequence.code]: this.getSequenceNextIndex,
        [playModeMap.loop.code]: this.getLoopNextIndex,
        [playModeMap.random.code]: this.getRandomNextIndex,
      };
      const getNextStrat = nextStratMap[state.playMode];
      const index = getNextStrat();

      return state.playlist[index];
    },
    prevSong(state) {
      const prevStratMap = {
        [playModeMap.sequence.code]: this.genSequencePrevIndex,
        [playModeMap.loop.code]: this.getLoopPrevIndex,
        [playModeMap.random.code]: this.getRandomPrevIndex,
      };
      const getPrevStrat = prevStratMap[state.playMode];
      const index = getPrevStrat();

      return state.playlist[index];
    },
    hasCurrentSong(state) {
      return isDef(state.currentSong.id);
    },
  },
  actions: {
    getSequenceNextIndex() {
      let nextIndex = this.currentIndex + 1;
      if (nextIndex > this.playlist.length - 1) {
        nextIndex = 0;
      }
      return nextIndex;
    },
    getLoopNextIndex() {
      return this.currentIndex;
    },
    getRandomNextIndex() {
      return this.getRandomIndex(this.playlist, this.currentIndex);
    },
    genSequencePrevIndex() {
      let prevIndex = this.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = this.playlist.length - 1;
      }
      return prevIndex;
    },
    getLoopPrevIndex() {
      return this.currentIndex;
    },
    getRandomPrevIndex() {
      return this.getRandomIndex(this.playlist, this.currentIndex);
    },
    getRandomIndex(playlist, currentIndex) {
      // 防止无限循环
      if (playlist.length === 1) {
        return currentIndex;
      }
      let index = Math.round(Math.random() * (playlist.length - 1));
      while (index === currentIndex) {
        index = Math.round(Math.random() * (playlist.length - 1));
      }
      return index;
    },
    setCurrentSong(song) {
      this.currentSong = song;
    },
    setCurrentTime(time) {
      this.currentTime = time;
    },
    setPlayingState(playing) {
      this.playing = playing;
    },
    setPlayMode(mode) {
      this.playMode = mode;
    },
    setPlaylistShow(show) {
      this.isPlaylistShow = show;
    },
    setPlayerShow(show) {
      this.isPlayerShow = show;
    },
    setPlaylistPromptShow(show) {
      this.isPlaylistPromptShow = show;
    },
    setPlaylist(playlist) {
      const isPlaylistShow = this.isPlaylistShow;
      const oldPlaylist = this.playlist;
      this.playlist = playlist;
      // If the playlist is not shown and the old playlist is different from the new one, show the prompt
      if (!isPlaylistShow && !shallowEqual(oldPlaylist, playlist, "id")) {
        this.isPlaylistPromptShow = true;
        // Replace setTimeout with a Pinia-friendly approach if needed
        setTimeout(() => {
          this.isPlaylistPromptShow = false;
        }, 2000);
      }
    },
    setPlayHistory(history) {
      this.playHistory = history;
    },
    setMenuShow(show) {
      this.isMenuShow = show;
    },
    async startSong(rawSong) {
      const song = Object.assign({}, rawSong);
      if (!song.img && song.albumId) {
        song.img = await getSongImg(song.id, song.albumId);
      }
      this.setCurrentSong(song);
      this.setPlayingState(true);

      const playHistoryCopy = this.playHistory.slice();
      const findedIndex = playHistoryCopy.findIndex(({ id }) => song.id === id);
      if (findedIndex !== -1) {
        playHistoryCopy.splice(findedIndex, 1);
      }
      playHistoryCopy.unshift(song);
      this.setPlayHistory(playHistoryCopy);
      storage.set(PLAY_HISTORY_KEY, playHistoryCopy);
    },
    clearCurrentSong() {
      this.setCurrentSong({});
      this.setPlayingState(false);
      this.setCurrentTime(0);
    },
    clearPlaylist() {
      this.setPlaylist([]);
      this.clearCurrentSong();
    },
    clearHistory() {
      const history = [];
      this.setPlayHistory(history);
      storage.set(PLAY_HISTORY_KEY, history);
    },
    addToPlaylist(song) {
      const copy = this.playlist.slice();
      if (!copy.find(({ id }) => id === song.id)) {
        copy.unshift(song);
        this.setPlaylist(copy);
      }
    },
  },
});
