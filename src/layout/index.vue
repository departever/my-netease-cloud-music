<template>
    <div class="layout">
      <LayoutHeader />
      <div class="layout-body">
        <div class="layout-menu" v-show="isMenuShow">
          <LayoutMenu />
        </div>
        <div class="content" id="page-content">
          <router-view :class="routerViewCls" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useMusicStore } from '@/store/music'
  import LayoutHeader from "./header.vue"
  import LayoutMenu from "./menu.vue"
  import { layoutCenterNames } from "@/router"
  
  const musicStore = useMusicStore()
  const route = useRoute()
  
  const isMenuShow = computed(() => musicStore.isMenuShow)
  const routerViewCls = computed(() => {
    return layoutCenterNames.includes(route.name) ? "router-view-center" : ""
  })
  </script>

<style lang="scss" scoped>
.layout {
  height: 100%;

  .layout-body {
    display: flex;
    height: calc(100% - #{$header-height});

    .layout-menu {
      // 这个100%已经减去了头部height
      height: calc(100% - #{$mini-player-height});
    }

    .content {
      flex: 1;
      overflow-y: auto;
      min-width: $layout-content-min-width;
      margin-bottom: $mini-player-height;

      .router-view-center {
        max-width: $center-content-max-width;
        margin: auto;
      }
    }
  }
}
</style>
