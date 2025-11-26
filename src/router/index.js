import { createRouter, createWebHistory } from "vue-router";

// 懒加载页面组件
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

// 需要显示在侧边栏菜单的页面（同时也是需要居中布局的页面）
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

// 内容需要居中的页面名称（从 menuRoutes 自动提取）
export const layoutCenterNames = menuRoutes.map(route => route.name);

// 其他路由（非菜单路由）
const otherRoutes = [
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
];

// 合并所有路由
const routes = [...otherRoutes, ...menuRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
