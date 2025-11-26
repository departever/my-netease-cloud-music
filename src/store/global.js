import { defineStore } from 'pinia';

export const useAxiosLoaderStore = defineStore({
  id: 'axiosloader',
  state: () => ({
    axiosLoading: false,
  }),
  actions: {
    setAxiosLoading(loading) {
      this.axiosLoading = loading;
    },
  },
});
