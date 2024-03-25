<template>
  <div class="header">
    <div class="leftside">
      <div class="buttons">
        <div @click="backToHome" class="mac-button red">
          <Icon :size="9" type="home" />
        </div>
        <div @click="exitFullScreen" class="mac-button yellow">
          <Icon :size="9" type="minus" />
        </div>
        <div @click="fullScreen" class="mac-button green">
          <Icon :size="9" type="fullscreen" />
        </div>
      </div>
      <!-- 收起播放器 -->
      <div @click="pickUpPlayer" class="shrink-player" v-if="isPlayerShow">
        <Icon :backdrop="true" type="down" />
      </div>
      <!-- 路由记录器 -->
      <div class="history" v-show="!isPlayerShow">
          <!-- 待完成 -->
      </div>
    </div>
    <div class="rightside">
      <div class="search-box">
        <!-- 待完成搜索框 -->
      </div>
      <!-- 待完成主题切换 -->
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import Icon from '@/subcomponents/Icon.vue';
import { requestFullScreen, exitFullscreen, isFullscreen } from '@/utils/common';

const isPlayerShow = ref(false);

const backToHome = () => {
  // ...
};

const exitFullScreen = () => {
  if (isFullscreen()) {
    exitFullscreen();
  }
};

const fullScreen = () => {
  requestFullScreen(document.documentElement);
};

const pickUpPlayer = () => {
  // ...
};
</script>

<style lang="scss" scoped>
@import "@/style/element-overwrite";

.header {
  display: flex;
  justify-content: space-between;
  height: $header-height;
  background-color: var(--header-bgcolor);
  padding-right: 36px;

  @include el-input-theme(var(--header-input-color),
    var(--header-input-bgcolor),
    var(--header-input-placeholder-color));

  ::v-deep .iconfont {
    color: var(--header-font-color);
  }

  .leftside {
    padding: 14px 14px 0 8px;
    display: flex;

    .font-weight {
      white-space: nowrap;
    }

    .buttons {
      display: flex;

      &:hover {
        .mac-button>i {
          opacity: 1;
        }
      }

      .mac-button {
        @include round(12px);
        @include flex-center;
        margin-right: 8px;
        cursor: pointer;

        &.red {
          background: #ed655a;
        }

        &.green {
          background: #72be47;
        }

        &.yellow {
          background: #e0c04c;
        }

        i {
          opacity: 0;
          transition: opacity 0.3s;
          color: $black;
          font-weight: $font-weight-bold;
          transform-origin: center center;
        }
      }
    }

    .shrink-player {
      position: relative;
      top: -6px;
      margin-left: 16px;
    }

    .history {
      margin-left: 65px;
    }

    .actions {
      margin-left: 70px;
    }
  }

  .rightside {
    display: flex;
    align-items: center;

    .search-box {
      margin-right: 16px;
    }
  }
}
</style>