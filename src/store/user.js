import { defineStore } from "pinia";
import storage from 'good-storage'
import { UID_KEY } from '@/utils'
import { notify, isDef } from '@/utils'
import { getUserDetail, getUserPlaylist } from "@/api"

export const useUserStore = defineStore("user", {
  state: () => ({
    // 登录用户
    user: {},
    // 登录用户歌单
    userPlaylist: [],
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setUserPlaylist(playlist) {
      this.userPlaylist = playlist;
    },
    async login(uid) {
      const error = () => {
        notify.error("登录失败，请输入正确的uid。");
        return false;
      };

      if (!isDef(uid)) {
        return error();
      }

      try {
        const user = await getUserDetail(uid);
        const { profile } = user;
        this.setUser(profile);
        storage.set(UID_KEY, profile.userId);
      } catch (e) {
        return error();
      }

      const { playlist } = await getUserPlaylist(uid);
      this.setUserPlaylist(playlist);
      return true;
    },
    logout() {
      this.setUser({});
      this.setUserPlaylist([]);
      storage.set(UID_KEY, null);
    },
  },
  getters: {
    isLogin: (state) => {
      return isDef(state.user.userId);
    },
    userMenus: (state) => {
      const userCreateList = [];
      const userCollectList = [];

      state.userPlaylist.forEach((playlist) => {
        const { userId } = playlist;
        if (state.user.userId === userId) {
          userCreateList.push(playlist);
        } else {
          userCollectList.push(playlist);
        }
      });

      const genPlaylistChildren = (playlist) =>
        playlist.map(({ id, name }) => ({
          path: `/playlist/${id}`,
          meta: {
            title: name,
            icon: "playlist-menu",
          },
        }));

      const retMenus = [];

      if (userCreateList.length) {
        retMenus.push({
          type: "playlist",
          title: "创建的歌单",
          children: genPlaylistChildren(userCreateList),
        });
      }

      if (userCollectList.length) {
        retMenus.push({
          type: "playlist",
          title: "收藏的歌单",
          children: genPlaylistChildren(userCollectList),
        });
      }

      return retMenus;
    },
  },
});
