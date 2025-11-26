<template>
  <div class="mvs" ref="page">
    <div class="tabs-wrap">
      <span class="tabs-type">地区：</span>
      <Tabs
        :tabs="areaTabs"
        class="tabs"
        type="split"
        :active="activeAreaTabIndex"
        @tabChange="activeAreaTabIndex = $event"
      />
    </div>
    <div class="tabs-wrap">
      <span class="tabs-type">类型：</span>
      <Tabs
        :tabs="typeTabs"
        class="tabs"
        type="split"
        :active="activeTypeTabIndex"
        @tabChange="activeTypeTabIndex = $event"
      />
    </div>
    <div class="tabs-wrap">
      <span class="tabs-type">排序：</span>
      <Tabs
        :tabs="sortTabs"
        class="tabs"
        type="split"
        :active="activeSortTabIndex"
        @tabChange="activeSortTabIndex = $event"
      />
    </div>
    <WithPagination
      :getData="getAllMvs"
      :getDataParams="getDataParams"
      :limit="40"
      :scrollTarget="page"
      :total="mvCount"
      @getDataSuccess="onGetMvs"
    >
      <ul class="list-wrap">
        <li v-for="mv in mvs" :key="mv.id" class="list-item">
          <MvCard
            :author="mv.artistName"
            :duration="mv.duration"
            :id="mv.id"
            :img="mv.cover"
            :name="mv.name"
            :playCount="mv.playCount"
          />
        </li>
      </ul>
    </WithPagination>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted } from 'vue';
  import { getAllMvs } from '@/api';
  import MvCard from '@/components/mv-card.vue';
  import WithPagination from '@/components/with-pagination.vue';

  const areaTabs = ['全部', '内地', '港台', '欧美', '日本', '韩国'];
  const typeTabs = ['全部', '官方版', '原声', '现场版', '网易出品'];
  const sortTabs = ['上升最快', '最热', '最新'];

  const mvs = ref([]);
  const mvCount = ref(0);
  const activeAreaTabIndex = ref(0);
  const activeTypeTabIndex = ref(0);
  const activeSortTabIndex = ref(0);
  const page = ref(null);

  const getDataParams = computed(() => ({
    area: areaTabs[activeAreaTabIndex.value],
    order: sortTabs[activeSortTabIndex.value],
    type: typeTabs[activeTypeTabIndex.value],
  }));

  const onGetMvs = ({ data, count }) => {
    mvs.value = data;
    if (count) {
      mvCount.value = count;
    }
  };

  onMounted(() => {
    getAllMvs();
  });
</script>

<style lang="scss" scoped>
  .mvs {
    padding: $page-padding;
    margin: auto;

    .tabs-wrap {
      margin-bottom: 16px;
      display: flex;
      align-items: center;

      .tabs-type {
        font-size: $font-size-sm;
      }
    }

    @include list(25%);
  }
</style>
