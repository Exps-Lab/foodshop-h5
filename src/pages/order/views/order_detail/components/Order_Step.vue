<!-- 订单流程弹窗 -->

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
      <p class="modal-title font-bold-weight">订单跟踪</p>
      <van-steps direction="vertical" active="-1">
        <van-step class="order-info-box" v-for="(step, index) in stepInfo" :key="index">
          <h3>{{step.title}}</h3>
          <p>{{step.value}}</p>
        </van-step>
      </van-steps>
    </section>
  </van-popup>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderInfo } from '@pages/order/hooks/orderInfo'

const props = defineProps({
  orderInfo: {
    type: Object,
    required: true,
    default: () => {}
  }
})

const show = ref(false)
const { calcSendTime } = useOrderInfo()

const showSendTimeText = computed(() => {
  const { create_time, send_cost_time } = props.orderInfo
  return (send_cost_time && create_time)
    ? `预计 ${calcSendTime(send_cost_time, create_time)} 送达`
    : '计算中...'
})

// 各状态对应step的配置
const statusStepMap = {
  0: ['create', 'prePay'],
  2: ['create', 'prePay', 'cancel'],
  3: ['create', 'prePay', 'pay', 'preSend'],
  4: ['create', 'prePay', 'pay', 'preSend', 'send'],
  default: []
}
const stepInfo = computed(() => {
  const infoMap = {
    create: {
      title: '订单提交成功',
      value: props.orderInfo.create_time
    },
    prePay: {
      title: '订单待支付',
      value: '待支付'
    },
    pay: {
      title: '订单已支付',
      value: props.orderInfo.pay_time
    },
    cancel: {
      title: '订单已取消',
      value: props.orderInfo.cancel_time
    },
    preSend: {
      title: '订单配送中',
      value: showSendTimeText.value
    },
    send: {
      title: '订单已送达',
      value: props.orderInfo.complete_time
    }
  }
  const { order_status = 'default' } = props.orderInfo
  return statusStepMap[order_status].reduce((step, now) => {
    step.push(infoMap[now])
    return step
  }, [])
})

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
      padding: 20px 20px 20px;
      .modal-title {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        padding-bottom: 20px;
      }
      .com-price {
        display: flex;
        align-items: baseline;
        justify-content: center;
        margin-bottom: 30px;
      }
      .order-info-box {
        padding: 0.14rem 0.1rem 0.2rem 0;
        &::after {
          border-bottom-width: 0;
        }
        :deep(.van-step__title) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }
      }
    }
  }
</style>
