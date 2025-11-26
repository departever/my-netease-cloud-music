<template>
  <div class="search-mvs">
    <WithPagination
      :getData="getSearch"
      :getDataParams="searchParams"
      :limit="40"
      :scrollTarget="searchRoot.$refs && searchRoot.$refs.header"
      :total="mvCount"
      @getDataSuccess="onGetMvs"
    >
      <ul class="list-wrap">
        <li :key="mv.id" class="list-item" v-for="mv in mvs">
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
  import { ref, inject } from 'vue';
  import { getSearch } from '@/api';
  import MvCard from '@/components/mv-card.vue';
  import WithPagination from '@/components/with-pagination.vue';

  const SEARCH_TYPE_MV = 1004;

  const mvs = ref([]);
  const mvCount = ref(0);

  const searchRoot = inject('searchRoot');

  const onGetMvs = ({ result: { mvs: newMvs, mvCount: newMvCount } }) => {
    mvs.value = newMvs;
    mvCount.value = newMvCount;
    searchRoot.onUpdateCount(newMvCount);
  };

  const searchParams = {
    keywords: searchRoot.value.keywords,
    type: SEARCH_TYPE_MV,
  };
</script>

<style lang="scss" scoped>
  .search-mvs {
    max-width: 1000px;
    padding: $page-padding;
    margin: auto;

    @include list(25%);
  }
</style>
