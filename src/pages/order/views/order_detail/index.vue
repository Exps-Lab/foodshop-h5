<!-- 订单详情页 -->

<template>
  <div class="main-content">
    <p>订单详情页</p>
    <p v-if="minusTime.showTime">{{minusTime.minutes}}:{{minusTime.seconds}}</p>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { getOrderDetail } from '@/api/order'
  import { useOrderInfo } from '@pages/order/hooks/orderInfo'
  // import { orderTotalNeedPay, getDiscountInfo } from '@utils/calcGoodsPrice'

  const route = useRoute()
  const { minusTime, countRemainTime, handleErr } = useOrderInfo()

  // 初始化数据
  const orderInfo = ref({})
  // 获取订单详情
  const preGetOrderDetail = async () => {
    const orderNum = route.query.orderNum || '721841524578324480'
    try {
      const { data } = await getOrderDetail({ orderNum })
      const { order_expire_time, order_status } = data
      orderInfo.value = data
      // 未支付
      if (order_status === 0) {
        countRemainTime(order_expire_time)
      }
    } catch (err) {
      handleErr(err)
    }
  }

  const init = () => {
    preGetOrderDetail()
  }
  init()
</script>

<style lang="less" scoped>
  .main-content {
    min-height: 100vh;
    padding: 15px 15px 60px;
    background-color: rgb(245, 245, 246);
    :deep(.submit-btn) {
      max-width: 750px;
      left: 50%;
      transform: translateX(-50%);
      .van-submit-bar__bar {
        border-top: 1px solid @line-1;
      }
      .van-submit-bar__button {
        height: 35px;
        .van-button__text {
          font-weight: bold;
        }
      }
      .info-text {
        .red {
          color: @error-6;
        }
      }
    }
  }
</style>
