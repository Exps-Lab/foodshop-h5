<template>
  <div class="topic-content">
    <van-search readonly shape="round" :background="brandMain" placeholder="请输入商家或商品名称" @focus="toGlobalSearchPage"/>
    <section class="slide-sub-category">
      <div class="slide-box">
        <div
          v-for="item in subCategory.data"
          :key="item.id"
          @click="changeActive(item)"
          :class="['slide-item', item.name === subCategory.activeName && 'active']">
          <img class="slide-img" :src="item.image_url" alt="categoryImg" />
          <p class="slide-text">{{item.name}}</p>
        </div>
      </div>
    </section>
    <SuggestList :needTitle="false" :filter="suggestListFilter" />
  </div>
</template>

<script setup>
  import { reactive } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getSubCategory } from '@api/home'
  import SuggestList from '@common/components/Suggest_List/index.vue'

  const router = useRouter()
  const route = useRoute()
  const brandMain = 'rgb(2, 182, 253)'
  const { categoryId, categoryName } = route.query

  const subCategory = reactive({
    activeName: categoryName,
    data: []
  })
  const getSubCategoryData = async () => {
    const { data } = await getSubCategory({ categoryId })
    data.filter(item => {
      if (item.name.includes('全部')) {
        item.name = item.name.split('全部')[1]
      }
    })
    subCategory.data = data
  }
  const changeActive = (item) => {
    const { name } = item
    subCategory.activeName = name
    suggestListFilter.shop_type = name
  }

  // 列表筛选条件
  const suggestListFilter = reactive({
    distance: 1,
    shop_type: subCategory.activeName,
  })

  const toGlobalSearchPage = () => {
    console.log('跳转商品/商铺搜索页面')
  }

  getSubCategoryData()
</script>
 
<style lang="less" scoped>
  .topic-content {
    background-color: rgb(245, 245, 246);
    min-height: 100vh;
    .slide-sub-category {
      .slide-box {
        display: flex;
        align-items: center;
        overflow: auto;
        padding: 12px;
        .slide-item {
          min-width: 72px;
          text-align: center;
          &.active {
            .slide-img {
              background-image: linear-gradient(180deg, #FFD9B3 0%, rgba(255, 217, 179, 0) 100%);
            }
            .slide-text {
              color: @brand1-6;
            }
          }
          .slide-img {
            margin: 0 auto;
            height: 45px;
            width: 45px;
            border-radius: 50%;
            overflow: hidden;
            background-image: linear-gradient(180deg, #FFFFFF 0%, #F5F5F6 100%);
          }
          .slide-text {
            font-size: 12px;
            line-height: 20px;
          }
        }
      }
    }
  }
</style>
