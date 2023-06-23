<!-- 收银台 -->

<template>
  <div class="main">
    <section class="account-box">
      <section class="pay-minus-time">
        支付剩余时间
        <section v-if="minusTime.showTime">
          <span class="time-item font-bold-weight">{{minusTime.minutes}}: </span>
          <span class="time-item font-bold-weight">{{minusTime.seconds}}</span>
        </section>
        <span v-else class="time-item">计算中...</span>
      </section>
      <p class="com-price">
        <span class="com-symbol font-bold-weight">￥</span>
        <span class="red price font-bold-weight">{{orderInfo.pay_price}}</span>
      </p>
      <p class="shop-name text-ellipsis">{{orderInfo.shopDetail?.name}}</p>
    </section>
    <ChosePayChannel />
    <div class="submit-box">
      <van-button round block type="primary" recharge-btn @click="prePayOrder">确认交易</van-button>
    </div>
  </div>
  <PayOrderModal ref="PayOrderModalRef" :orderInfo="orderInfo" />
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { getOrderDetail } from '@/api/order'
  import { useOrderInfo } from '@pages/order/hooks/orderInfo'
  import PayOrderModal from '@components/Pay_Order_Modal/index.vue'
  import ChosePayChannel from '@components/Chose_Pay_Channel/index.vue'

  const route = useRoute()
  const { minusTime, countRemainTime, handleErr } = useOrderInfo()

  const PayOrderModalRef = ref(null)
  const prePayOrder = () => {
    PayOrderModalRef.value.showModal()
  }

  const orderInfo = ref({})
  // 获取订单详情
  const preGetAccountMoney = async () => {
    const orderNum = route.query.orderNum
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

  const init = async () => {
    await preGetAccountMoney()
  }
  init()
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    padding: 50px 15px;
    box-sizing: border-box;
    .account-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .pay-minus-time {
        font-size: 13px;
        display: flex;
        align-items: center;
        .time-item {
          color: @error-6;
          font-size: 14px;
          &:first-child {
            margin-left: 6px;
          }
        }
      }
      .com-price {
        display: flex;
        align-items: baseline;
        justify-content: center;
        margin: 15px 0 30px;
        .com-symbol {
          font-size: 18px;
          line-height: 1;
        }
        .price {
          font-size: 34px;
        }
      }
      .shop-name {
        max-width: 80%;
        color: @text-3;
        font-size: 13px;
        margin-bottom: 30px;
      }
    }
    .submit-box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 0 15px 30px;
      box-sizing: border-box;
    }
  }
</style>
