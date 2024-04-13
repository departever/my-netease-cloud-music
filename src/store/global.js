import { defineStore } from 'pinia'

export const useAxiosLoaderStore = defineStore({
  id: 'axiosloader', // 唯一的store标识
  state: () => ({
    axiosLoading: false, // 初始状态
  }),
  actions: {
    setAxiosLoading(loading) {
      this.axiosLoading = loading // 直接修改状态
    },
  },
})

