<template>
    <div class="comment">
        <template v-if="loading">
            <Loading :loading="loading" />
        </template>
        <template v-else>
            <div class="block" v-if="shouldHotCommentShow">
                <p class="title">精彩评论</p>
                <Comment :border="!$utils.isLast(index, hotComments)" :comment="comment" :key="comment.id"
                    v-for="(comment, index) in hotComments" />
            </div>
            <div class="block" v-if="shouldCommentShow">
                <p class="title" ref="commentTitle">
                    最新评论
                    <span class="count">({{ total }})</span>
                </p>
                <Comment :border="!$utils.isLast(index, comments)" :comment="comment" :key="comment.id"
                    v-for="(comment, index) in comments" />
            </div>
            <Pagination :modelValue="currentPage" :page-size="PAGE_SIZE" :total="total"
                @update:modelValue="onPageChange" class="pagination" />
        </template>
        <empty v-if="!loading && !shouldHotCommentShow && !shouldCommentShow">还没有评论哦~</empty>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { getSongComment, getPlaylistComment, getHotComment, getMvComment } from "@/api/comment";
import { getPageOffset, scrollInto } from "@/utils";
import Comment from "@/components/comment.vue";

const SONG_TYPE = "song";
const PLAYLIST_TYPE = "playlist";
const MV_TYPE = "mv";
const PAGE_SIZE = 20;

const emit = defineEmits(['update']);

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: SONG_TYPE
  }
});

const loading = ref(false);
const hotComments = ref([]);
const comments = ref([]);
const total = ref(0);
const currentPage = ref(1);

const commentRequestMap = {
  [PLAYLIST_TYPE]: getPlaylistComment,
  [SONG_TYPE]: getSongComment,
  [MV_TYPE]: getMvComment
};

const getComment = async () => {
  loading.value = true;
  const commentRequest = commentRequestMap[props.type];
  try {
    const { hotComments: newHotComments = [], comments: newComments = [], total: newTotal } = await commentRequest({
      id: props.id,
      pageSize: PAGE_SIZE,
      offset: getPageOffset(currentPage.value, PAGE_SIZE)
    });

    if (props.type === PLAYLIST_TYPE && currentPage.value === 1) {
      const { hotComments: exactHotComments = [] } = await getHotComment({
        id: props.id,
        type: 2
      });
      hotComments.value = exactHotComments;
    } else {
      hotComments.value = newHotComments;
    }

    comments.value = newComments;
    total.value = newTotal;
    emit("update", { newComments, newHotComments, newTotal });
  } finally {
    loading.value = false;
  }
};

const onPageChange = async () => {
  await getComment();
  nextTick(() => {
    scrollInto(this.$refs.commentTitle);
  });
};

watch(() => props.id, (newId) => {
  if (newId) {
    currentPage.value = 1;
    getComment();
  }
}, { immediate: true });

const shouldHotCommentShow = computed(() => hotComments.value.length > 0 && currentPage.value === 1);
const shouldCommentShow = computed(() => comments.value.length > 0);

onMounted(() => {
  getComment();
});

defineExpose({
  onPageChange,
  shouldHotCommentShow,
  shouldCommentShow
});

</script>


<style lang="scss" scoped>
.block {
    margin-bottom: 48px;

    .title {
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        margin-bottom: 4px;

        .count {
            font-size: $font-size;
        }
    }
}

.pagination {
    text-align: right;
}
</style>
