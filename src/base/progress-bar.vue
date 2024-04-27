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
import { ref, onMounted, watch } from 'vue';
import { prefixStyle, toCurrentRem } from "@/utils";

const transform = prefixStyle("transform");

const progressBar = ref(null);
const progress = ref(null);
const progressBtn = ref(null);
const percent = ref(0);
const alwaysShowBtn = ref(false);
const disabled = ref(false);
const touch = ref({});

const emit = defineEmits(['percentChange']);

onMounted(() => {
  if (percent.value > 0) {
    setProgressOffset(percent.value);
  }
});

function progressClick(e) {
  if (!disabled.value) {
    const rect = progressBar.value.getBoundingClientRect();
    const offsetWidth = Math.max(
      0,
      Math.min(e.pageX - rect.left, progressBar.value.clientWidth)
    );
    _offset(offsetWidth);
    _triggerPercent();
  }
}

function setProgressOffset(newPercent) {
  if (newPercent >= 0 && !touch.value.initiated) {
    const barWidth = progressBar.value.clientWidth;
    const offsetWidth = newPercent * barWidth;
    _offset(offsetWidth);
  }
}

function _triggerPercent() {
  emit("percentChange", _getPercent());
}

function _offset(offsetWidth) {
  const offsetRem = toCurrentRem(offsetWidth);
  progress.value.style.width = `${offsetRem}`;
  progressBtn.value.style[transform] = `translate3d(${offsetRem}, 0, 0)`;
}

function _getPercent() {
  const barWidth = progressBar.value.clientWidth;
  return progress.value.clientWidth / barWidth;
}

watch(percent, (newPercent) => {
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
