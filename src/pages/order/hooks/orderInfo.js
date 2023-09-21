
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { diffModuleJump, padZero, formatTime } from '@utils'
import { Dialog } from 'vant'

// 按照惯例，组合式函数名以“use”开头
export function useOrderInfo () {
  const orderStatusTextMap = {
    0: '待支付',
    1: '已支付',
    2: '已取消',
    3: '配送中',
    4: '已送达'
  }
  const router = useRouter()
  const remainTime = ref(0)
  const minusTime = reactive({
    minutes: '',
    seconds: '',
    showTime: false
  })
  const timeShowDetail = (time) => {
    const minutes = padZero(Math.floor(time / 1000 / 60 % 60))
    const seconds = padZero(Math.floor(time / 1000 % 60))
    return {
      minutes,
      seconds
    }
  }
  // 计算订单剩余时间
  const countRemainTime = (time = 0) => {
    remainTime.value = time - Date.now()
    // [note] 控制时间兜底
    if (remainTime.value > 0) {
      const timer = setInterval(() => {
        if (remainTime.value < 1000) {
          clearInterval(timer)
          location.reload()
        } else {
          remainTime.value = remainTime.value - 1000
          Object.assign(minusTime, timeShowDetail(remainTime.value))
          minusTime.showTime = true
        }
      }, 1000)
    }
  }

  /**
   * 计算送达时间
   * @param sendCostTime 配送预计花费时间
   * @param pay_time 支付时间
   * @param isDayTime 是否返回年月日 时分秒
   * @returns {string}
   */
  const calcSendTime = (sendCostTime = 0, pay_time, isDayTime = false) => {
    const payTimeTemp = new Date(pay_time).getTime()
    const targetTime = new Date(payTimeTemp + sendCostTime * 60 * 1000)
    return isDayTime
      ? formatTime(targetTime, 'yyyy-MM-dd hh:mm:ss')
      : `${padZero(targetTime.getHours())}:${padZero(targetTime.getMinutes())}`
  }

  // 统一处理err
  const handleErr = (err) => {
    if (!err) return new Error('请传入错误信息')
    const { code, msg, data } = err.data
    Dialog.alert({
      message: msg,
      theme: 'round-button',
      confirmButtonColor: '#02B6FD'
    }).then(() => {
      // 20003 购物袋15分钟redis缓存已失效
      // 20004 余额不足，支付失败
      // 20005 查无此订单
      if (code === 20003 || code === 20005) {
        diffModuleJump('/home', '', 'home', true)
      } else if (code === 20004) {
        const { orderNum } = data
        jumpOrderDetail(orderNum)
      }
    })
  }

  // 统一跳转订单详情
  const jumpOrderDetail = (orderNum, type = 'replace') => {
    router[type]({
      path: '/order/orderDetail',
      query: {
        orderNum
      }
    })
  }

  return {
    handleErr,
    minusTime,
    calcSendTime,
    countRemainTime,
    jumpOrderDetail,
    orderStatusTextMap
  }
}
