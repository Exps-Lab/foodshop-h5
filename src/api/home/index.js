import request from '@utils/request.js'

export function getShopList (params) {
  return request({
    url: '/h5/common/noauth/shop/list',
    method: 'get',
    params
  })
}

export function getGlobalSearch (params) {
  return request({
    url: '/h5/common/noauth/global/search',
    method: 'get',
    params
  })
}