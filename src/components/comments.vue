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
      <Pagination :current-page="currentPage" :page-size="PAGE_SIZE" :total="total" @current-change="handlePageChange"
        class="pagination" />
    </template>
    <empty v-if="!loading && !shouldHotCommentShow && !shouldCommentShow">还没有评论哦~</empty>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { getSongComment, getPlaylistComment, getHotComment, getMvComment } from "@/api"
import { getPageOffset, scrollInto } from "@/utils"
import Comment from "./comment.vue"

const SONG_TYPE = "song"
const PLAYLIST_TYPE = "playlist"
const MV_TYPE = "mv"

const PAGE_SIZE = 20

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: SONG_TYPE
  }
})

const emit = defineEmits(['update'])

const loading = ref(false)
const hotComments = ref([])
const comments = ref([])
const total = ref(0)
const currentPage = ref(1)
const commentTitle = ref(null)

const getComment = async () => {
  loading.value = true
  const commentRequestMap = {
    [PLAYLIST_TYPE]: getPlaylistComment,
    [SONG_TYPE]: getSongComment,
    [MV_TYPE]: getMvComment
  }
  const commentRequest = commentRequestMap[props.type]
  const { hotComments: hot = [], comments: comm = [], total: tot } = await commentRequest({
    id: props.id,
    pageSize: PAGE_SIZE,
    offset: getPageOffset(currentPage.value, PAGE_SIZE)
  }).finally(() => {
    loading.value = false
  })

  if (props.type === PLAYLIST_TYPE && currentPage.value === 1) {
    const { hotComments: exactHotComments = [] } = await getHotComment({
      id: props.id,
      type: 2 // 歌单type
    })
    hotComments.value = exactHotComments
  } else {
    hotComments.value = hot
  }

  comments.value = comm
  total.value = tot
  emit("update", { comments: comm, hotComments: hot, total: tot })
}

const handlePageChange = (page) => {
  currentPage.value = page
  onPageChange()
}

const onPageChange = async () => {
  await getComment()
  nextTick(() => {
    scrollInto(commentTitle.value)
  })
}

watch(() => props.id, (newId) => {
  if (newId) {
    currentPage.value = 1
    getComment()
  }
}, { immediate: true })

const shouldHotCommentShow = computed(() => {
  return hotComments.value.length > 0 && currentPage.value === 1
})

const shouldCommentShow = computed(() => {
  return comments.value.length > 0
})

onMounted(() => {
  getComment()
})
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
