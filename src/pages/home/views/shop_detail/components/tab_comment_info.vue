<!-- 商铺评论信息 -->

<template>
  <div class="store-box">
    <ComListPagination :filter="filter" :reqApiFun="reqFun">
      <template v-slot="slotProps">
        <section class="comment-container">
          <CommentCard :cardData="slotProps.listData" />
        </section>
      </template>
    </ComListPagination>
  </div>
</template>

<script setup>
  import { computed, reactive } from 'vue'
  import { getCommentByShopId } from '@/api/comment'
  import ComListPagination from '@common/components/Com_List_Pagination/index.vue'
  import CommentCard from '@common/components/Comment_Card/index.vue'

  const props = defineProps({
    shopId: {
      type: [Number, String],
      required: true
    }
  })

  const filter = reactive({
    shopId: props.shopId
  })
  const reqFun = computed(() => {
    return getCommentByShopId
  })
</script>

<style lang="less" scoped>
  .comment-container {
    padding: 10px 15px 10px;
    :deep(.comment-list) {
      background-color: @fill-2;
    }
  }
</style>
