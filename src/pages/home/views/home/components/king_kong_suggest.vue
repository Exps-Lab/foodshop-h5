<template>
  <div class="category-container" v-loading="data.loading">
    <section
      class="box"
      v-for="item in data.suggestData"
      :key="item.category_id"
      @click="toCategoryPage(item)">
      <img class="img" :src="item.image_url" alt="categoryAvatar">
      <span class="name">{{item.name}}</span>
    </section>
    <section v-if="!data.suggestData.length && !data.loading" class="box no-data">暂无分类</section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getKingKongSuggest } from '@api/home'

const router = useRouter()
const data = reactive({
  loading: false,
  suggestData: []
})

const getSuggestData = () => {
  data.loading = true
  getKingKongSuggest()
    .then(res => {
      data.suggestData = res.data
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      data.loading = false
    })
}

const toCategoryPage = (data) => {
  const { name, id } = data
  router.push({
    path: '/shopTopic',
    query: {
      categoryId: id,
      categoryName: name
    }
  })
}

getSuggestData()
</script>

<style lang="less" scoped>
  .category-container {
    padding: 4px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    min-height: 150px;
    .box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 54px;
      padding: 8px 0;
      flex-basis: 25%;
      font-family: PingFangSC-Regular, PingFang SC;
      &.no-data {
        font-size: 14px;
        color: @text-3;
        flex-basis: 100%;
      }
      .img {
        width: 36px;
        margin-bottom: 4px;
      }
      .name {
        font-size: 12px;
      }
    }
  }
</style>
