
import { useRouter } from 'vue-router'
import { cancelOrder } from '@/api/order'
import { Dialog } from 'vant'
import { diffModuleJump } from '@utils'
import { useOrderInfo } from '@pages/order/hooks/orderInfo'

// 按照惯例，组合式函数名以“use”开头
export function useOrderBtns () {
  const router = useRouter()
  const { handleErr } = useOrderInfo()
  // 跳转支付订单
  const handlePayOrder = (orderInfo) => {
    const { order_num } = orderInfo
    router.push({
      path: '/order/payPlatform',
      query: {
        orderNum: order_num
      }
    })
  }
  // 取消订单
  const handleCancelOrder = async (orderInfo) => {
    const { order_num } = orderInfo
    try {
      const { msg } = await cancelOrder({ orderNum: order_num })
      await Dialog.alert({
        message: msg,
        theme: 'round-button'
      }).then(() => {
        location.reload()
      })
    } catch (err) {
      handleErr(err)
    }
  }
  // 联系商家
  const handleTelShop = (orderInfo) => {
    const { phone } = orderInfo.shopDetail
    window.location.href = `tel:${phone}`
  }
  // 再来一单
  const handleOneMore = (orderInfo) => {
    const { order_num, shop_id } = orderInfo
    diffModuleJump('/shopDetail', `shop_id=${shop_id}&order_num=${order_num}`, 'home')
  }

  // 所有按钮配置list
  const orderOperatorBtnEnums = {
    pay: {
      icon: 'after-sale',
      text: '去支付',
      handler: handlePayOrder
    },
    cancel: {
      icon: 'stop-circle-o',
      text: '取消订单',
      handler: handleCancelOrder
    },
    oneMore: {
      icon: 'todo-list-o',
      text: '再来一单',
      handler: handleOneMore
    },
    comment: {
      icon: 'notes-o',
      text: '去评价',
      handler: () => {}
    },
    telShop: {
      icon: 'phone-o',
      text: '电话商家',
      handler: handleTelShop
    }
  }
  // 每个订单状态对应的按钮
  const statusShowBtn = {
    0: ['pay', 'cancel'],
    2: ['telShop', 'oneMore'],
    3: ['telShop', 'cancel'],
    4: ['comment', 'telShop', 'oneMore'],
    default: []
  }

  // 获取对应订单状态的按钮
  const getStatusBtns = (orderStatus) => {
    return statusShowBtn[orderStatus].reduce((btns, item) => {
      btns.push(orderOperatorBtnEnums[item])
      return btns
    }, [])
  }

  return {
    getStatusBtns
  }
}
