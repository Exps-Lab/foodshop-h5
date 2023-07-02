<!-- 商铺基本信息 -->

<template>
  <div class="store-box">
    <section class="com-box">
      <p class="box-title font-bold-weight-4">商铺信息</p>
      <div class="box-main">
        <section class="box-left" @click="showAddressInMap">
          <van-icon class="box-icon" name="location-o" />
          <p class="box-text">{{props.shopInfo.address}} ></p>
        </section>
        <p class="box-right phone" @click="phoneShop"><van-icon class="icon" name="phone" /></p>
      </div>
      <div class="box-main">
        <section class="box-left">
          <van-icon class="box-icon" name="clock-o" />
          <p class="box-text">营业时间：{{openTime}}</p>
        </section>
      </div>
    </section>

    <section class="com-box">
      <p class="box-title font-bold-weight-4">商家承诺</p>
      <div class="box-main" @click="showSafeDoc">
        <section class="box-left">
          <van-icon class="box-icon" name="shield-o" />
          <p class="box-text">查看食品档案</p>
        </section>
        <p class="box-right arrow"><van-icon class="icon" name="arrow" /></p>
      </div>
      <div class="box-main">
        <section class="box-left">
          <van-icon class="box-icon" name="ecard-pay" />
          <p class="box-text">该商家支持在线支付</p>
        </section>
      </div>
      <div class="box-main">
        <section class="box-left">
          <van-icon class="box-icon" name="description" />
          <p class="box-text">支持开发票</p>
        </section>
      </div>
    </section>
    <SafeDoc ref="shopImageModal" :shopImage="shopImage"/>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SafeDoc from './safe_doc_modal.vue'

const router = useRouter()
const props = defineProps({
  shopInfo: {
    type: Object,
    default: () => {}
  }
})

// 营业时间
const openTime = computed(() => {
  const [open, close] = props.shopInfo.open_time || []
  return `${open} - ${close}`
})
// 店铺图片
const shopImage = computed(() => {
  return props.shopInfo.shop_image
})

// 拨打商家电话
const phoneShop = () => {
  window.location.href = `tel:${props.shopInfo.phone}`
}
// 在地图上展示商家
const showAddressInMap = () => {
  const { lat, lng } = props.shopInfo.pos || {}
  router.push({
    path: '/shopDetail/map',
    query: {
      shop_pos: `${lat},${lng}`,
      shop_name: props.shopInfo.name,
      shop_address: props.shopInfo.address
    }
  })
}

const shopImageModal = ref()
// 展示视频档案modal
const showSafeDoc = () => {
  shopImageModal.value.showModal()
}

</script>

<style lang="less" scoped>
  .store-box {
    .com-box {
      margin: 10px 0;
      padding: 15px 0 15px 20px;
      border-bottom: 3px solid @line-1;
      .box-title {
        font-size: 14px;
        line-height: 1.2;
        margin-bottom: 15px;
      }
      .box-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 24px;
        margin-bottom: 6px;
        .box-left {
          display: flex;
          flex-shrink: 1;
          .box-icon {
            font-size: 13px;
            margin-right: 14px;
          }
          .box-text {
            font-size: 13px;
            color: @text-3;
            line-height: 1.4;
            transform: translateY(-0.02rem);
          }
        }
        .box-right {
          margin-left: 0.1rem;
          flex-basis: 0.4rem;
          flex-shrink: 0;
          &.phone {
            padding-left: 10px;
            border-left: 1px solid @fill-3;
            .icon {
              font-size: 22px;
            }
          }
          &.arrow {
            color: @fill-5;
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
