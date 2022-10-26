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

export function getKingKongSuggest (params) {
  return request({
    url: '/h5/common/noauth/shop/getCategory',
    method: 'get',
    params
  })
}

export function getPosCostTime (params) {
  return request({
    url: '/h5/common/noauth/getPosCostTime',
    method: 'get',
    params
  })
}

export function getAllCity (params) {
  return request({
    url: '/h5/common/noauth/getAllCity',
    method: 'get',
    params
  })
}
