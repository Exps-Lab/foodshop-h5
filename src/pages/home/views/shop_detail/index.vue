<template>
  <div class="detail-content">
    <div class="avatar-bg" :style="{ background: shopBgUrl }"></div>
    <div class="shop-container">
      <section class="shop-main-info" @click="showDetailInfo">
        <p class="shop-name text-ellipsis">{{shopBaseInfo.name}}</p>
        <img class="shop-icon" :src="shopBaseInfo.shop_image?.avatar" alt="avatar">
        <p class="extra-info">
          <span class="send-time">配送约{{shopBaseInfo.send_time}}分钟</span>
        </p>
        <p class="note-box text-ellipsis">公告：{{shopBaseInfo.intro_text}}</p>
      </section>
      <section class="shop-content-nav">
        <van-tabs shrink sticky border swipeable
          line-width="20px" line-height="2px" @click-tab="menuTabClick" v-model:active="activeMenuName">
          <van-tab title="点餐" name="order">内容 1</van-tab>
          <van-tab title="商家" name="store">
            <StoreInfo :shopInfo="shopBaseInfo" />
          </van-tab>
        </van-tabs>
      </section>
      <section class="menu-box"></section>
    </div>
    <section class="shopping-bag-box"></section>

    <!--  商铺基本信息弹窗  -->
    <InfoDetailModal ref="infoModal" :shopInfo="shopBaseInfo" />
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import InfoDetailModal from './components/info_detail_modal.vue'
  import StoreInfo from './components/store_info.vue'
  import { getShopDetail, getShopGoods, searchShopGoods } from '@api/shop'

  const router = useRouter()
  const route = useRoute()
  const brandMain = 'rgb(2, 182, 253)'
  const { shop_id, current_pos } = route.query

  const shopBaseInfo = reactive({})
  const getShopInfo = async () => {
    const { data } = await getShopDetail({ shop_id, current_pos })
    Object.assign(shopBaseInfo, data)
  }
  // 商铺顶部背景
  const shopBgUrl = computed(() => {
    const avatar = shopBaseInfo.shop_image?.avatar || ''
    return `linear-gradient(rgba(34, 36, 38, 0.5), rgba(34, 36, 38, 0.5)), ${avatar} center top / cover`
  })
  getShopInfo()

  // 控制店铺详情modal
  const infoModal = ref()
  const showDetailInfo = () => {
    infoModal.value.showModal()
  }

  // 控制菜单切换
  const activeMenuName = ref('store')
  const menuTabClick = ({ title, name }) => {
    console.log(name)
  }


</script>
 
<style lang="less" scoped>
  .detail-content {
    min-height: 100vh;
    .avatar-bg {
      height: 112px;
      position: relative;
    }
    .shop-container {
      position: relative;
      background-color: #fff;
      margin-top: -30px;
      border-radius: 12px 12px 0 0;
      .shop-main-info {
        padding: 14px 16px;
        position: relative;
        .shop-name {
          font-size: 21px;
          font-weight: bold;
          max-width: 250px;
        }
        .shop-icon {
          position: absolute;
          top: -10px;
          right: 20px;
          width: 65px;
          height: 65px;
          object-fit: cover;
          border-radius: 10px;
          background-color: @fill-4;
        }
        .extra-info {
          margin-top: 8px;
          .send-time {
            color: @text-3;
          }
        }
        .note-box {
          margin-top: 8px;
          color: @text-4;
          font-weight: 500;
        }
      }
      .shop-content-nav {
        margin-top: 10px;
        :deep(.van-tabs) {
          .van-tab--shrink {
            margin-right: 25px;
            .van-tab__text {
              font-size: 16px;
            }
          }
          .van-tab--active {
            .van-tab__text {
              font-weight: bold;
            }
          }
          .van-tabs__line {
            background-color: @brand1-6;
          }
        }
      }
    }
  }
</style>
