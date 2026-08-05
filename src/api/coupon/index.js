import request from '@utils/request.js'

export function claimCoupon (data) {
  return request({
    url: '/h5/coupon/auth/claim',
    method: 'post',
    data
  })
}

export function getUserCoupons () {
  return request({
    url: '/h5/coupon/auth/list',
    method: 'get'
  })
}

export function getShowValidCoupon () {
  return request({
    url: '/h5/coupon/noauth/showValid',
    method: 'get'
  })
}
