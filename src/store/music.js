import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', {
  state: () => ({
    isPlaying: true,
  }),
  actions: {
    setPlayingState(state) {
      this.isPlaying = state;
    }
  }
});
