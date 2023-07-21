<!-- 订单支付弹窗 -->

<template>
  <van-popup
    round
    closeable
    position="bottom"
    class="info-modal"
    v-model:show="show"
    :before-close="handleCloseModal"
    :style="{ minHeight: '30%' }"
    :close-on-click-overlay="false">
    <!--  modal内容  -->
    <section class="modal-main">
      <p class="com-price">
        <span class="com-symbol font-bold-weight">￥</span>
        <span class="red price font-bold-weight">{{props.orderInfo.pay_price}}</span>
      </p>
      <ChosePayChannel />
      <van-button round block type="primary" class="sub-btn" @click="handlePayOrder">确认交易</van-button>
    </section>
  </van-popup>
</template>

<script setup>
import { Dialog } from 'vant'
import { ref, computed } from 'vue'
import { payOrder } from '@/api/pay'
import { useOrderInfo } from '@pages/order/hooks/orderInfo'
import ChosePayChannel from '@components/Chose_Pay_Channel/index.vue'

const show = ref(false)
const { handleErr, jumpOrderDetail, calcSendTime } = useOrderInfo()
const props = defineProps({
  orderInfo: {
    type: Object,
    required: true,
    default: () => {}
  }
})

const orderNum = computed(() => {
  return props.orderInfo.order_num
})
const showSendTimeText = computed(() => {
  const { create_time, send_cost_time } = props.orderInfo
  return (send_cost_time && create_time)
    ? `预计 ${calcSendTime(send_cost_time, create_time)} 送达`
    : '计算中...'
})

const handleCloseModal = () => {
  Dialog.confirm({
    title: '支付提示',
    message: '您是否放弃本次支付?'
  })
    .then(() => {
      jumpOrderDetail(orderNum.value)
    })
    .catch(() => {})
}

const handlePayOrder = async () => {
  try {
    const { msg } = await payOrder({ orderNum: orderNum.value })
    Dialog.alert({
      title: '支付成功',
      message: msg + '\n' + showSendTimeText.value,
      theme: 'round-button',
      confirmButtonColor: '#02B6FD'
    }).then(() => {
      hideModal()
      jumpOrderDetail(orderNum.value)
    })
  } catch (err) {
    handleErr(err)
  }
}

// 控制modal显隐
const showModal = () => {
  show.value = true
}
// 控制modal显隐
const hideModal = () => {
  show.value = false
}
defineExpose({
  showModal,
  hideModal
})
</script>

<style lang="less" scoped>
  .info-modal {
    .modal-main {
      padding: 60px 20px 30px;
      .com-price {
        display: flex;
        align-items: baseline;
        justify-content: center;
        margin-bottom: 30px;
        &.red {
          color: @error-6;
        }
        .com-symbol {
          font-size: 18px;
          line-height: 1;
        }
        .price {
          font-size: 30px;
        }
      }
      .sub-btn {
        margin-top: 30px;
      }
    }
  }
</style>
