<template>
  <van-card
    @click="toDetail(props.goodsData)"
    :title="props.goodsData.name"
    :thumb="shopAvatar">
    <template #desc>
      <section class="info-box top-4">
        <span class="info-text right-6 rank">4.8分</span>
        <span class="info-text month-sale">月售3000</span>
      </section>
      <section class="info-box flex-box top-4">
        <p class="inner-info-box">
          <span class="info-text right-6">起送 ¥{{props.goodsData.mini_delivery_price}}</span>
          <span class="info-text">配送 ¥{{props.goodsData.delivery_fee}}</span>
        </p>
        <p class="inner-info-box" v-if="props.costTime !== false">
          <span class="info-text right-6">{{costTime}}</span>
          <span class="info-text" v-if="posInfo">{{posInfo}}</span>
        </p>
      </section>
      <section class="info-box discount-box flex-box top-6" v-if="goodsData.has_discount">
        <span
          class="discount-item"
          v-for="(discount, index) in goodsData.discount_Arr"
          :key="index">
          满{{discount.total_val}}减{{discount.discount_val}}
      </span>
      </section>
    </template>
  </van-card>
</template>

<script setup>
import { computed } from 'vue'
import { diffModuleJump } from '@utils'

const props = defineProps({
  goodsData: {
    type: Object,
    default: () => {}
  },
  costTime: {
    type: [String, Number, Boolean],
    default: '...'
  }
})

const shopAvatar = computed(() => {
  const { avatar } = props.goodsData.shop_image
  return (avatar && avatar.includes('static'))
    ? avatar
    : 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'
})
const posInfo = computed(() => {
  const { distance } = props.goodsData
  return distance !== undefined
    ? distance < 1
      ? `${Math.floor(distance * 100)}m`
      : `${distance}km`
    : ''
})
const costTime = computed(() => {
  const { costTime } = props
  return costTime
    ? costTime >= 24 * 60 ? '大于1天' : `${costTime}分钟`
    : '暂无'
})

const toDetail = (data) => {
  const { id: shop_id, pos } = data
  diffModuleJump(
    '/shopDetail',
    `shop_id=${shop_id}&current_pos=${pos.lat},${pos.lng}`,
    'home'
  )
}
</script>

<style lang="less" scoped>
  /* 单独定制商品卡片样式 */
  .van-card {
    background-color: #fff;
    border-radius: 10px;
    :deep(.van-card__title) {
      font-size: 16px;
      font-weight: bold;
      color: #222426;
      -webkit-line-clamp: 1;
    }
    :deep(.info-box) {
      &.top-2 {
        margin-top: 2px;
      }
      &.top-4 {
        margin-top: 4px;
      }
      &.top-6 {
        margin-top: 6px;
      }
      &.flex-box {
        display: flex;
        justify-content: space-between;
      }
      .info-text {
        color: #858687;
        &.right-6 {
          margin-right: 6px;
        }
      }
      .rank {
        color: #ff8000;
      }
      &.discount-box {
        justify-content: flex-start;
        transform: translateX(-2px);
        .discount-item {
          border: 1px solid rgba(255, 0, 0, 0.6);
          color: #f00;
          margin-right: 2px;
          border-radius: 4px;
          padding: 1px 3px;
          font-size: 12px;
          line-height: 1;
          transform: scale(0.9);
        }
      }
    }
  }
</style>
