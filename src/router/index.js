import { createRouter, createWebHistory } from "vue-router";

// 内容需要居中的页面
const Discovery = () => import("@/page/discovery/index.vue");
const PlaylistDetail = () => import('@/page/playlist-detail/index.vue')
const Playlists = () => import("@/page/playlists/index.vue");
const Songs = () => import("@/page/songs/index.vue");
// const Search = () => import('@/page/search')
// const SearchSongs = () => import('@/page/search/songs')
// const SearchPlaylists = () => import('@/page/search/playlists')
// const SearchMvs = () => import('@/page/search/mvs')
// const Mvs = () => import('@/page/mvs')
const Mv = () => import("@/page/mv/index.vue");
const Test = () => import("@/page/test/index.vue");

export const layoutCenterNames = ["discovery", "playlists"];

// 需要显示在侧边栏菜单的页面
export const menuRoutes = [
  {
    path: "/discovery",
    name: "discovery",
    component: Discovery,
    meta: {
      title: "发现音乐",
      icon: "music",
    },
  },
  {
    path: "/playlists",
    name: "playlists",
    component: Playlists,
    meta: {
      title: "推荐歌单",
      icon: "playlist-menu",
    },
  },
  {
    path: "/songs",
    name: "songs",
    component: Songs,
    meta: {
      title: "最新音乐",
      icon: "yinyue",
    },
  },
];

export const routes = [
  {
    path: "/",
    redirect: "/discovery",
  },
  {
    path: "/discovery",
    component: Discovery,
  },
  {
    path: "/playlists",
    name: "playlists",
    component: Playlists,
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: PlaylistDetail,
  },
  {
    path: "/mv/:id",
    name: "mv",
    component: Mv,
    props: (route) => ({ id: +route.params.id }),
  },
  {
    path: "/test",
    component: Test,
  },
  {
    path: "/songs",
    component: Songs,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
