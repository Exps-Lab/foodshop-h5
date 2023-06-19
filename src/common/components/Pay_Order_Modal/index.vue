<!-- 订单支付弹窗 -->

<template>
  <van-popup
    round
    closeable
    position="bottom"
    class="info-modal"
    v-model:show="show"
    :style="{ minHeight: '30%' }">
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
import { diffModuleJump } from '@utils'
import ChosePayChannel from '@components/Chose_Pay_Channel/index.vue'

const show = ref(false)
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

const handlePayOrder = async () => {
  try {
    const { msg } = await payOrder({ orderNum: orderNum.value })
    Dialog.alert({
      message: msg + `${orderNum.value}`
    }).then(() => {
      hideModal()
      // jumpOrderDetail()
    })
  } catch (err) {
    handleErr(err)
  }
}

// 统一处理err
const handleErr = (err) => {
  const { code, msg } = err.data
  Dialog.alert({
    message: msg
  }).then(() => {
    // 支付余额不足，跳转订单详情页
    if (code === 20004) {
      jumpOrderDetail()
    }
  })
}

const jumpOrderDetail = () => {
  // 支付成功跳转replace订单详情
  diffModuleJump('/order/orderConfirm', `orderNum=${orderNum.value}`, 'order', true)
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
