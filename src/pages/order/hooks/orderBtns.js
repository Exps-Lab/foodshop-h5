
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
    Dialog.confirm({
      title: '取消确认',
      message: '您是否确认取消本次订单?'
    })
      .then(async () => {
        const { order_num } = orderInfo
        try {
          const { msg } = await cancelOrder({ orderNum: order_num })
          await Dialog.alert({
            message: msg,
            theme: 'round-button',
            confirmButtonColor: '#02B6FD'
          }).then(() => {
            location.reload()
          })
        } catch (err) {
          handleErr(err)
        }
      })
      .catch(() => {})
  }
  // 联系商家
  const handleTelShop = (orderInfo) => {
    const { phone } = orderInfo.shopDetail || orderInfo.shop
    window.location.href = `tel:${phone}`
  }
  // 再来一单
  const handleOneMore = (orderInfo) => {
    const { order_num, shop_id } = orderInfo
    diffModuleJump('/shopDetail', `shop_id=${shop_id}&order_num=${order_num}`, 'home')
  }
  // 跳转订单评论表单
  const handleComment = (orderInfo) => {
    const { order_num } = orderInfo
    router.push({
      path: '/order/comment',
      query: {
        orderNum: order_num
      }
    })
  }

  // 所有按钮配置list
  const orderOperatorBtnEnums = {
    pay: {
      type: 'primary',
      icon: 'after-sale',
      text: '去支付',
      handler: handlePayOrder
    },
    cancel: {
      type: 'default',
      icon: 'stop-circle-o',
      text: '取消订单',
      handler: handleCancelOrder
    },
    oneMore: {
      type: 'primary',
      icon: 'todo-list-o',
      text: '再来一单',
      handler: handleOneMore
    },
    comment: {
      type: 'warning',
      icon: 'notes-o',
      text: '去评价',
      handler: handleComment
    },
    telShop: {
      type: 'default',
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
  const getStatusBtns = (orderInfo) => {
    const { comment_id, order_status = 'default' } = orderInfo
    const tempBtns = statusShowBtn[order_status].reduce((btns, item) => {
      btns.push(orderOperatorBtnEnums[item])
      return btns
    }, [])
    // [note] 特殊情况处理：已评价订单不显示去评价按钮
    if (order_status === 4 && comment_id) {
      tempBtns.shift()
    }
    return tempBtns
  }

  return {
    getStatusBtns
  }
}
