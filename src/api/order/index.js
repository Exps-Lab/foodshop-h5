import request from '@utils/request.js'

export function getRecentAddress (params) {
  return request({
    url: '/h5/order/auth/getRecentAddress',
    method: 'get',
    params
  })
}

export function getConfirmDetail (params) {
  return request({
    url: '/h5/order/auth/getConfirmDetail',
    method: 'get',
    params
  })
}

export function createOrder (data) {
  return request({
    url: '/h5/order/auth/order/create',
    method: 'post',
    data
  })
}
