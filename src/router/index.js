import { createRouter, createWebHistory } from "vue-router";

// 内容需要居中的页面
const Discovery = () => import("@/page/discovery/index.vue");
const PlaylistDetail = () => import("@/page/playlist-detail/index.vue");
const Playlists = () => import("@/page/playlists/index.vue");
const Songs = () => import("@/page/songs/index.vue");
const Search = () => import("@/page/search/index.vue");
const SearchSongs = () => import("@/page/search/songs.vue");
const SearchPlaylists = () => import("@/page/search/playlists.vue");
const SearchMvs = () => import("@/page/search/mvs.vue");
const Mvs = () => import("@/page/mvs/index.vue");
const Mv = () => import("@/page/mv/index.vue");

export const layoutCenterNames = ["discovery", "playlists", "songs", "mvs"];

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
  {
    path: "/mvs",
    name: "mvs",
    component: Mvs,
    meta: {
      title: "最新MV",
      icon: "mv",
    },
  },
];

const routes = [
  {
    path: "/",
    redirect: "/discovery",
  },
  {
    path: "/playlist/:id",
    name: "playlist",
    component: PlaylistDetail,
  },
  {
    path: "/search/:keywords",
    component: Search,
    props: true,
    children: [
      {
        path: "",
        redirect: { name: "searchSongs" },
      },
      {
        path: "songs",
        name: "searchSongs",
        component: SearchSongs,
      },
      {
        path: "playlists",
        name: "searchPlaylists",
        component: SearchPlaylists,
        props: true,
      },
      {
        path: "mvs",
        name: "searchMvs",
        component: SearchMvs,
        props: true,
      },
    ],
  },
  {
    path: "/mv/:id",
    name: "mv",
    component: Mv,
    props: (route) => ({ id: +route.params.id }),
  },
  {
    path: "/discovery",
    name: "discovery",
    component: Discovery,
  },
  {
    path: "/playlists",
    name: "playlists",
    component: Playlists,
  },
  {
    path: "/songs",
    name: "songs",
    component: Songs,
  },
  {
    path: "/mvs",
    name: "mvs",
    component: Mvs,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
