<template>
  <div class="category-container">
    <section
      class="box"
      v-for="item in data.suggestData"
      :key="item.category_id"
      @click="toCategoryPage(item)">
      <img class="img" :src="item.image_url" alt="categoryAvatar">
      <span class="name">{{item.name}}</span>
    </section>
  </div>
</template>

<script setup>
  import { reactive, onMounted } from 'vue'
  import { getKingKongSuggest } from '@api/home'

  const data = reactive({
    suggestData: [],
  })

  const getSuggestData = () => {
    getKingKongSuggest().then(res => {
      data.suggestData = res.data
    }).catch(err => {
      console.log(err)
    })
  }

  const toCategoryPage = (data) => {
    console.log(data)
  }

  onMounted (() => {
    getSuggestData()
  });
</script>

<style lang="less" scoped>
  .category-container {
    padding: 4px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 54px;
      padding: 8px 0;
      flex-basis: 25%;
      .img {
        width: 36px;
        margin-bottom: 4px;
      }
      .name {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
  }
</style>
