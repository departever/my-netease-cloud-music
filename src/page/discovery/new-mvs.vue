<template>
    <div class="new-mvs" v-if="mvs.length">
        <Title>推荐MV</Title>
        <ul class="list-wrap">
            <li :key="mv.id" class="list-item" v-for="mv in mvs">
                <MvCard :author="mv.artistName" :id="mv.id" :img="mv.picUrl" :name="mv.name"
                    :playCount="mv.playCount" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPersonalizedMv } from "@/api"

const mvs = ref([])

onMounted(async () => {
    const { result } = await getPersonalizedMv()
    mvs.value = result
})
</script>

<style lang="scss" scoped>
.new-mvs {
    @include list(25%);
}
</style>