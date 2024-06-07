<template>
  <div class="menu">
    <user />
    <div class="menu-wrap">
      <div :key="index" class="menu-block" v-for="(menu, index) in menusWithPlaylist">
        <p class="menu-block-title" v-if="menu.title">{{ menu.title }}</p>
        <ul class="menu-list">
          <router-link :key="index" :to="item.path" v-slot="{ navigate, href, isActive, isExactActive }" v-for="(item, index) in menu.children">
            <li :class="['menu-item', { 'menu-item-active': isActive || isExactActive }]" @click="navigate">
              <Icon :size="16" :type="item.meta.icon" class="iconfont" />
              <span class="menu-title">{{ item.meta.title }}</span>
            </li>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import storage from "good-storage"
import { UID_KEY, isDef } from "@/utils"
import User from "@/components/user.vue"
import { menuRoutes } from "@/router"
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const menus = ref([
    {
        type: "root",
        children: menuRoutes
    }
])

const menusWithPlaylist = computed(() => {
    return userStore.isLogin && userStore.userMenus.length
        ? menus.value.concat(userStore.userMenus)
        : menus.value
})

onMounted(() => {
    const uid = storage.get(UID_KEY)
    if (isDef(uid)) {
        userStore.login(uid)
    }
})
</script>


<style lang="scss" scoped>
.menu {
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--menu-bgcolor);

  .menu-wrap {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;

    .menu-block {
      margin-bottom: 16px;

      .menu-block-title {
        font-size: $font-size-sm;
        color: var(--font-color-grey2);
        padding-left: 16px;
        margin-bottom: 8px;
      }

      .menu-list {
        .menu-item {
          @include text-ellipsis;
          padding: 12px 18px;
          cursor: pointer;

          &:hover {
            background: var(--menu-item-hover-bg);
          }

          &-active {
            color: $theme-color;
            background: var(--menu-item-active-bg);

            i {
              color: $theme-color;
            }
          }

          .iconfont {
            font-size: $font-size-medium-sm;
          }

          .menu-title {
            font-size: $font-size-medium-sm;
            margin-left: 8px;
          }
        }
      }
    }
  }
}
</style>
