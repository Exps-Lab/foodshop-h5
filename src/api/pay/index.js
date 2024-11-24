import request from '@utils/request.js'

export function payOrder (data) {
  return request({
    url: '/h5/pay/auth/order/pay',
    method: 'post',
    data
  })
}
