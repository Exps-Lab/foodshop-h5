<!-- 商铺评论信息 -->

<template>
  <div class="store-box">
    <van-list
      v-loading="data.loading"
      :finished="data.finished"
      :finished-text="pagination.endText"
      :immediate-check="false"
      @load="onLoad">
      <p>{{data.commentList}}</p>
    </van-list>
  </div>
</template>

<script setup>
  import { reactive } from 'vue'
  import { getCommentByShopId } from '@/api/comment'
  import { Toast } from 'vant'

  const props = defineProps({
    shopId: {
      type: [Number, String],
      required: true
    }
  })

  const data = reactive({
    loading: false,
    finished: false,
    commentList: []
  })
  // 分页参数
  const pagination = reactive({
    pageSize: 10,
    pageNum: 0,
    total: 0,
    hasNext: false,
    endText: '没有更多了'
  })

  // 加载分页数据
  const onLoad = async () => {
    await getNextData()
  }
  const getNextData = async () => {
    pagination.pageNum++
    await getCommentList()
    data.loading = false
    if (!pagination.hasNext) {
      data.finished = true
    }
  }
  // 获取评论列表
  const getCommentList = async () => {
    try {
      const { data } = await getCommentByShopId({
        shopId: props.shopId,
        pageNum: pagination.pageNum
      })
      pagination.total = data.total
      pagination.hasNext = data.hasNext
      data.commentList = data.list
    } catch (err) {
      Toast('获取评论列表失败，请刷新重试')
    }
  }

  const init = async () => {
    await getNextData()
  }
  init()
</script>

<style lang="less" scoped>
  .store-box {}
</style>
