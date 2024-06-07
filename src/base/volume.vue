<template>
    <div class="volume">
        <Icon :size="20" :type="getIconType()" @click="toggleSilence" class="icon" />
        <div class="progress-wrap">
            <ProgressBar :percent="volumePercent" @percentChange="onProgressChange" alwaysShowBtn />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
    volume: {
        type: Number,
        default: 1,
    }
});

const emit = defineEmits(['volumeChange']);

const volumePercent = ref(props.volume);
const lastVolume = ref(volumePercent.value);

const onProgressChange = (percent) => {
    if (percent < 0.05) {
        percent = 0;
    }
    volumePercent.value = percent;
    emit('volumeChange', percent);
};

const isSilence = computed({
    get() {
        return volumePercent.value === 0;
    },
    set(newSilence) {
        const target = newSilence ? 0 : lastVolume.value;
        if (newSilence) {
            lastVolume.value = volumePercent.value;
        }
        volumePercent.value = target;
        onProgressChange(target);
    }
});

const getIconType = () => {
    return isSilence.value ? 'silence' : 'horn';
};

const toggleSilence = () => {
    isSilence.value = !isSilence.value;
};

watch(() => props.volume, (newVolume) => {
    volumePercent.value = newVolume;
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
