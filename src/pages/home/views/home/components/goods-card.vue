<template>
  <van-card
    :title="props.goodsData.name"
    thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg">
    <template #desc>
      <section class="info-box top-4">
        <span class="info-text right-6 rank">4.8分</span>
        <span class="info-text month-sale">月售3000</span>
      </section>
      <section class="info-box flex-box top-4">
        <p class="inner-info-box">
          <span class="info-text right-6">起送 ￥{{props.goodsData.mini_delivery_price}}</span>
          <span class="info-text">配送 ￥{{props.goodsData.delivery_fee}}</span>
        </p>
        <p class="inner-info-box">
          <span class="info-text right-6">20分钟</span>
          <span class="info-text">{{posInfo}}</span>
        </p>
      </section>
    </template>
  </van-card>
</template>

<script setup>
  import { reactive, onMounted, computed } from 'vue'

  const props = defineProps({
    goodsData: {
      type: Object,
      default: () => {}
    },
  })

  const posInfo = computed(() => {
    const { distance } = props.goodsData
    return distance < 1 ? `${Math.floor(distance * 100)}m` : `${distance}km`
  })

  const goods = reactive({
  })

  onMounted (() => {
  });
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
    }
  }
</style>
