<template>
    <div @click="onClick" class="horizontal-card">
        <slot name="img-wrap">
            <div class="img-wrap">
                <img v-lazy="$utils.genImgUrl(img, 50)" />
                <slot name="img-mask"></slot>
            </div>
        </slot>
        <div class="content">
            <div class="name">{{ name }}</div>
            <div class="desc">
                <slot name="desc">{{ desc }}</slot>
            </div>
        </div>
    </div>
</template>


<script setup>
/**
 * 左边是图片 右边上下两行文字的卡片
 */
// 定义props
const props = defineProps({
    img: String,
    name: String,
    desc: String
})

// 定义事件
const emit = defineEmits(['click'])

// 点击事件处理函数
const onClick = (e) => {
    emit('click', e)
}
</script>

<style lang="scss" scoped>
.horizontal-card {
    display: flex;
    padding: 0 4px;
    cursor: pointer;

    &:hover {
        background: var(--light-bgcolor);
    }

    .img-wrap {
        position: relative;
        @include img-wrap(50px);

        img {
            border-radius: 4px;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 8px;
        overflow: hidden;

        .name {
            margin-bottom: 4px;
            font-size: $font-size-medium-sm;
            @include text-ellipsis();
        }

        .desc {
            font-size: $font-size-sm;
            color: var(--font-color-grey-shallow);
            @include text-ellipsis();
        }
    }
}
</style>
