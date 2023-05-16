import request from '@utils/request.js'

export function getRecentAddress (params) {
  return request({
    url: '/h5/order/auth/getRecentAddress',
    method: 'get',
    params
  })
}
