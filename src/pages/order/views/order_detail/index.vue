<!-- 订单详情页 -->

<template>
  <div class="main-content">
    <header class="bg-box"></header>
    <section class="content-box">
      <p class="status-text">
        <span class="main-title font-bold-weight">{{statusTitle.title}}</span>
        <van-icon class="arrow-icon" name="arrow" />
      </p>
      <section class="operator-box com-box">
        <span class="subtitle font-bold-weight">{{statusTitle.subtitle}}</span>
        <van-divider />
        <section class="btn-box">
          <section class="btn-item" v-for="(btn, index) in showButton" :key="index">
            <van-icon class="btn-icon" :name="btn.icon" />
            <span class="btn-text">{{btn.text}}</span>
          </section>
        </section>
      </section>
    </section>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { getOrderDetail } from '@/api/order'
  import { useOrderInfo } from '@pages/order/hooks/orderInfo'

  const route = useRoute()
  const { minusTime, countRemainTime, handleErr, calcSendTime } = useOrderInfo()

  const statusTitle = computed(() => {
    const { order_status = 'default' } = orderInfo.value
    const textMap = {
      0: {
        title: `待支付，剩余 ${minusTime.minutes}:${minusTime.seconds} `,
        subtitle: '15分钟内未支付，订单将自动取消'
      },
      2: {
        title: '订单已取消',
        subtitle: '您取消了订单'
      },
      3: {
        title: `订单配送中，预计${showSendTimeText.value}到达`,
        subtitle: '骑手正加急向您赶来'
      },
      4: {
        title: '订单已送达',
        subtitle: '感谢您的信任，期待再次光临'
      },
      default: {
        title: '加载中...',
        subtitle: '加载中...'
      }
    }
    return textMap[order_status]
  })
  const orderOperatorBtnEnums = {
    pay: {
      icon: 'after-sale',
      text: '去支付',
      handler: () => {}
    },
    cancel: {
      icon: 'stop-circle-o',
      text: '取消订单',
      handler: () => {}
    },
    oneMore: {
      icon: 'todo-list-o',
      text: '再来一单',
      handler: () => {}
    },
    comment: {
      icon: 'notes-o',
      text: '去评价',
      handler: () => {}
    },
    telShop: {
      icon: 'phone-o',
      text: '电话商家',
      handler: () => {}
    }
  }
  const statusShowBtn = {
    0: ['pay', 'cancel'],
    2: ['telShop', 'oneMore'],
    3: ['telShop', 'cancel'],
    4: ['comment', 'telShop', 'oneMore'],
    default: []
  }
  const showButton = computed(() => {
    const { order_status = 'default' } = orderInfo.value
    return statusShowBtn[order_status].reduce((btns, item) => {
      btns.push(orderOperatorBtnEnums[item])
      return btns
    }, [])
  })
  // 展示送达时间
  const showSendTimeText = computed(() => {
    const { send_cost_time } = orderInfo.value
    return calcSendTime(send_cost_time)
  })

  // 初始化数据
  const orderInfo = ref({})
  // 获取订单详情
  const preGetOrderDetail = async () => {
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

  const init = () => {
    preGetOrderDetail()
  }
  init()
</script>

<style lang="less" scoped>
  .com-box {
    background-color: #fff;
    border-radius: 8px;
    padding: 17px 12px;
    margin-top: 10px;
  }
  .main-content {
    min-height: 100vh;
    background-color: rgb(245, 245, 246);
    .bg-box {
      background-image: linear-gradient(rgba(2,182,253,.9), rgb(245, 245, 246));
      height: 200px;
    }
    .content-box {
      padding: 0 15px;
      transform: translateY(-160px);
      .status-text {
        color: #fff;
        font-size: 20px;
        line-height: 1.5;
        .arrow-icon {
          font-size: 14px;
          opacity: 0.6;
        }
      }
      .operator-box {
        .subtitle {
          font-size: 14px;
        }
        .btn-box {
          display: flex;
          align-items: center;
          justify-content: space-around;
          .btn-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            .btn-icon {
              font-size: 18px;
            }
            .btn-text {
              margin-top: 4px;
            }
          }
        }
      }
    }
  }
</style>
