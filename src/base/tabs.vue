<template>
  <ul :class="{ [align]: true }" class="tab-wrap">
    <template v-if="isRouteMode">
      <router-link
        :active-class="`${ROUTE_ACTIVE_CLS} ${activeItemClass}`"
        :key="index"
        :style="getItemStyle(tab, index)"
        :to="tab.to"
        class="tab-item"
        ref="routerLinks"
        tag="li"
        v-for="(tab, index) in normalizedTabs"
      >
        <span class="title">{{ tab.title }}</span>
      </router-link>
    </template>
    <template v-else>
      <li
        :class="getItemCls(tab, index)"
        :key="index"
        :style="getItemStyle(tab, index)"
        @click="onChangeTab(tab, index)"
        class="tab-item"
        v-for="(tab, index) in normalizedTabs"
      >
        <span class="title">{{ tab.title }}</span>
      </li>
    </template>
  </ul>
</template>

<script setup>
  import { computed, toRefs } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { isDef } from '@/utils';

  const ACTIVE_PROP = 'active';
  const ACTIVE_CHANGE = 'tabChange';
  const ROUTE_ACTIVE_CLS = 'active';
  const emit = defineEmits(['tabChange']);

  const props = defineProps({
    [ACTIVE_PROP]: {
      type: Number,
      default: 0,
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    align: {
      type: String,
      default: 'left',
    },
    itemStyle: {
      type: Object,
      default: () => ({}),
    },
    activeItemStyle: {
      type: Object,
      default: () => ({}),
    },
    itemClass: {
      type: String,
    },
    activeItemClass: {
      type: String,
    },
    // 不传的话对应大号字体 高亮加粗
    // small对应小号字体 高亮红色
    // split对应小号字体 分割线分隔 高亮背景色变灰文字变红
    type: {
      type: String,
    },
  });

  const { active } = toRefs(props);
  const router = useRouter();
  const route = useRoute();

  const isRouteMode = computed(() => {
    return props.tabs.length && isDef(props.tabs[0].to);
  });

  const normalizedTabs = computed(() => {
    return typeof props.tabs[0] === 'string' ? props.tabs.map(tab => ({ title: tab })) : props.tabs;
  });

  function onChangeTab(tab, index) {
    if (isRouteMode.value) {
      router.push(tab.to);
    } else {
      emit(ACTIVE_CHANGE, index);
    }
  }

  function isActive(tab, index) {
    if (isRouteMode.value) {
      const resolved = router.resolve(tab.to);
      if (resolved && resolved.resolved && resolved.resolved.path) {
        const { path: resolvedPath } = resolved.resolved;
        return resolvedPath === route.path;
      }
      return false;
    } else {
      return index === active.value;
    }
  }

  function getItemCls(tab, index) {
    let base = [];
    if (props.itemClass) {
      base.push(props.itemClass);
    }
    if (props.type) {
      base.push(props.type);
    }
    if (isActive(tab, index)) {
      if (props.activeItemClass) {
        base.push(props.activeItemClass);
      }
      base.push(ROUTE_ACTIVE_CLS);
    }
    return base.join(' ');
  }

  function getItemStyle(tab, index) {
    return Object.assign({}, props.itemStyle, isActive(tab, index) ? props.activeItemStyle : null);
  }
</script>

<style lang="scss" scoped>
  .tab-wrap {
    display: flex;

    &.center {
      justify-content: center;
    }

    &.right {
      justify-content: flex-end;
    }

    .tab-item {
      padding: 12px 0;
      margin: 0 12px;
      color: var(--tab-item-color);
      font-size: $font-size-medium;
      white-space: nowrap;
      cursor: pointer;

      &.active {
        color: var(--tab-item-active-color);

        &:hover {
          color: var(--tab-item-active-color);
        }
      }

      // 对应prop中的type字段
      &.small {
        font-size: $font-size-sm;

        &.active {
          color: $theme-color;
        }
      }

      &.theme {
        font-size: $font-size;

        &.active {
          color: $theme-color;
          border-bottom: 2px solid $theme-color;
          font-weight: $font-weight-bold;
        }
      }

      &.split {
        font-size: $font-size-sm;
        padding: 4px 12px;
        margin: 0 16px;
        border-radius: 999em;

        &.active {
          color: $theme-color;
          background: var(--shallow-theme-bgcolor);
        }

        &:not(:last-child) {
          &::after {
            position: relative;
            left: 28px;
            width: 1px;
            height: 100%;
            background: var(--border);
            display: inline-block;
            vertical-align: middle;
            content: ' ';
          }

          .title {
            vertical-align: middle;
          }
        }
      }

      &:hover {
        color: var(--tab-item-hover-color);
      }
    }
  }
</style>
