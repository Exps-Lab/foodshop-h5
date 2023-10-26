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

export function getOrderDetail (params) {
  return request({
    url: '/h5/order/auth/order/detail',
    method: 'get',
    params
  })
}

export function getOrderList (params) {
  return request({
    url: '/h5/order/auth/order/list',
    method: 'get',
    params
  })
}

export function cancelOrder (data) {
  return request({
    url: '/h5/order/auth/order/cancel',
    method: 'post',
    data
  })
}
