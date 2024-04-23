<template>
    <div class="routes-history">
        <Icon class="icon" :backdrop="true" type="back" @click="back" />
        <Icon :backdrop="true" type="forward" @click="forward" />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const back = () => {
    router.back();
};

const forward = () => {
    router.forward();
};
</script>

<style lang="scss" scoped>
.routes-history {
  display: flex;
  align-items: center;

  .icon {
    margin-right: 16px;
  }
}
</style>
