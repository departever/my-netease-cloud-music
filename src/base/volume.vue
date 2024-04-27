<template>
    <div class="volume">
        <Icon :size="20" :type="getIconType" @click="toggleSilence" class="icon" />
        <div class="progress-wrap" v-show="showProgress">
            <ProgressBar :percent="volumePercent" @percentChange="onProgressChange" alwaysShowBtn />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    volume: {
        type: Number,
        default: 1,
    }
});

const volumePercent = ref(props.volume);
const lastVolume = ref(props.volume);
const showProgress = ref(true);

const isSilence = computed({
    get: () => volumePercent.value === 0,
    set: (newSilence) => {
        const target = newSilence ? 0 : lastVolume.value;
        if (newSilence) {
            lastVolume.value = volumePercent.value;
        }
        volumePercent.value = target;
        onProgressChange(target);
    }
});

const onProgressChange = (percent) => {
    if (percent < 0.05) {
        percent = 0;
    }
    volumePercent.value = percent;
    showProgress.value = percent !== 0;
};

const getIconType = computed(() => isSilence.value ? 'silence' : 'horn');

const toggleSilence = () => {
    isSilence.value = !isSilence.value;
    showProgress.value = !isSilence.value;
};


watch(volumePercent, (newVolume) => {
    if (newVolume !== 0) {
        lastVolume.value = newVolume;
    }
    showProgress.value = newVolume !== 0;
});
</script>

<style lang="scss" scoped>
.volume {
    display: flex;
    align-items: center;
    width: 150px;

    .icon {
        color: var(--font-color);
        cursor: pointer;
        margin-right: 8px;
    }

    .progress-wrap {
        flex: 1;
    }
}
</style>
