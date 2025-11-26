<template>
  <span v-if="backdrop" :style="{ width: backDropSize, height: backDropSize }" class="backdrop">
    <i :class="['iconfont', 'icon-component', getIconCls]" :style="getIconStyle" @click="onClick" />
  </span>
  <i
    v-else
    :class="['iconfont', 'icon-component', getIconCls]"
    :style="getIconStyle"
    @click="onClick"
  />
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { toRem } from '@/utils/rem';

  const props = defineProps({
    size: {
      type: Number,
      default: 16,
    },
    type: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    backdrop: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['click']);

  const getIconCls = computed(() => {
    let cls = `icon-${props.type}`;
    if (props.color) {
      cls += ` icon-color-${props.color}`;
    }
    return cls;
  });

  const onClick = e => {
    emit('click', e);
  };

  const getIconStyle = computed(() => {
    const chromeMinSize = 12;
    const retStyle = { fontSize: toRem(props.size) };
    if (props.size < chromeMinSize) {
      const ratio = props.size / chromeMinSize;
      retStyle.transform = `scale(${ratio})`;
    }
    return retStyle;
  });

  const backDropSizeRatio = 1.56;
  const backDropSize = computed(() => toRem(backDropSizeRatio * props.size));
</script>

<style lang="scss" scoped>
  .backdrop {
    display: inline-block;
    @include flex-center;
    border-radius: 50%;

    &:hover {
      background: var(--round-hover-bgcolor);
    }
  }

  .icon-component {
    cursor: pointer;
  }

  .icon-color {
    // 通过prop传入这几个字段
    // 可以使用默认的几个颜色
    &-theme {
      color: $theme-color;
    }

    &-white {
      color: $white;
    }

    &-shallow {
      color: var(--font-color-shallow-grey);
    }
  }
</style>
