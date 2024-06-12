<template>
  <div @click="progressClick" class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div :class="{ show: alwaysShowBtn }" class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { prefixStyle, toCurrentRem } from "@/utils";

const transform = prefixStyle("transform");

const props = defineProps({
  percent: {
    type: Number,
    default: 0
  },
  alwaysShowBtn: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['percentChange']);

const progressBar = ref(null);
const progress = ref(null);
const progressBtn = ref(null);

const touch = ref({});

const setProgressOffset = (percent) => {
  if (percent >= 0 && !touch.value.initiated) {
    const barWidth = progressBar.value.clientWidth;
    const offsetWidth = percent * barWidth;
    _offset(offsetWidth);
  }
};

const _triggerPercent = () => {
  emit('percentChange', _getPercent());
};

const _offset = (offsetWidth) => {
  const offsetRem = toCurrentRem(offsetWidth);
  progress.value.style.width = `${offsetRem}`;
  progressBtn.value.style[transform] = `translate3d(${offsetRem},0,0)`;
};

const _getPercent = () => {
  const barWidth = progressBar.value.clientWidth;
  return progress.value.clientWidth / barWidth;
};

const progressClick = (e) => {
  if (!props.disabled) {
    const rect = progressBar.value.getBoundingClientRect();
    const offsetWidth = Math.max(
      0,
      Math.min(e.pageX - rect.left, progressBar.value.clientWidth)
    );
    _offset(offsetWidth);
    _triggerPercent();
  }
};

onMounted(() => {
  if (props.percent > 0) {
    setProgressOffset(props.percent);
  }
});

watch(() => props.percent, (newPercent) => {
  setProgressOffset(newPercent);
});
</script>

<style scoped lang="scss">
.progress-bar {
  height: 30px;
  cursor: pointer;

  .bar-inner {
    position: relative;
    top: 14px;
    height: 2px;
    background: var(--progress-bgcolor);

    .progress {
      position: absolute;
      height: 100%;
      background: $theme-color;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -15px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        display: none;
        position: relative;
        top: 8px;
        left: 9px;
        box-sizing: border-box;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: $theme-color;

        &.show {
          display: block;
        }
      }
    }
  }

  &:hover {
    .progress-btn {
      display: block !important;
    }
  }
}
</style>
