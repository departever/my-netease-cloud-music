import { createRouter, createWebHistory } from 'vue-router';

// 内容需要居中的页面
const Discovery = () => import('@/page/discovery/index.vue');
// const PlaylistDetail = () => import('@/page/playlist-detail')
// const Playlists = () => import('@/page/playlists')
// const Songs = () => import('@/page/songs')
// const Search = () => import('@/page/search')
// const SearchSongs = () => import('@/page/search/songs')
// const SearchPlaylists = () => import('@/page/search/playlists')
// const SearchMvs = () => import('@/page/search/mvs')
// const Mvs = () => import('@/page/mvs')
const Mv = () => import('@/page/mv/index.vue')
const Test = () => import('@/page/test/index.vue')

export const layoutCenterNames = ['discovery']

// 需要显示在侧边栏菜单的页面
export const menuRoutes = [
  {
    path: '/discovery',
    name: 'discovery',
    component: Discovery,
    meta: {
      title: '发现音乐',
      icon: 'music',
    },
  },
]

export const routes = [
  {
    path: '/',
    redirect: '/discovery'
  },
  {
    path: '/discovery',
    component: Discovery,
  },
  {
    path: '/mv/:id',
    name: 'mv',
    component: Mv,
    props: (route) =>  ({id: +route.params.id}),
  },
  {
    path: '/test',
    component: Test,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

