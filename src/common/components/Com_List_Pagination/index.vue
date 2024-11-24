<!-- 纯净的分页组件 -->

<template>
  <van-list
    class="self-list-box"
    v-loading="loading"
    :finished="finished"
    :finished-text="pagination.endText"
    :immediate-check="false"
    @load="onLoad">
    <slot :listData="listData"></slot>
  </van-list>
</template>

<script setup>
  import { Toast } from 'vant'
  import { reactive, ref, watch } from 'vue'

  const loading = ref(false)
  const finished = ref(false)
  const props = defineProps({
    reqApiFun: {
      type: Function,
      required: true,
      default: function () {}
    },
    filter: {
      type: Object,
      default: () => {}
    },
    pageSize: {
      type: Number,
      default: 10
    }
  })

  // 源数据
  const listData = ref([])

  // 处理分页参数
  const pagination = reactive({
    pageSize: props.pageSize,
    pageNum: 0,
    total: 0,
    hasNext: false,
    endText: '没有更多了'
  })

  // 重置搜索条件并搜索
  const searchAfterReset = async () => {
    pagination.pageNum = 1
    pagination.total = 0
    pagination.hasNext = false
    listData.value = []
    await preGetList()
  }

  const getNextData = async () => {
    pagination.pageNum++
    await preGetList()
    loading.value = false
    if (!pagination.hasNext) {
      finished.value = true
    }
  }

  const handleFilterParams = () => {
    const propFilter = Object.assign({}, props.filter)
    propFilter.pageNum = pagination.pageNum
    propFilter.pageSize = pagination.pageSize
    return propFilter
  }

  const preGetList = async () => {
    try {
      if (!loading.value) {
        const filter = handleFilterParams()
        loading.value = true
        const { data: { total, hasNext, list } } = await props.reqApiFun(filter)

        pagination.total = total
        pagination.hasNext = hasNext
        listData.value = listData.value.concat(list)
        loading.value = false
      }
    } catch (err) {
      Toast.fail(err.data.msg)
    }
  }

  const onLoad = async () => {
    await getNextData()
  }
  const init = async () => {
    await getNextData()
  }
  init()

  watch(
    () => props.filter,
    (now) => {
      searchAfterReset()
    }, {
      deep: true
    }
  )

  defineExpose({
    searchAfterReset,
    total: pagination.total
  })
</script>

<style lang="less" scoped>
</style>
