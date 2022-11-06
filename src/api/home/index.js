import request from '@utils/request.js'

export function getShopList (params) {
  return request({
    url: '/h5/sale/noauth/shop/list',
    method: 'get',
    params
  })
}

export function getGlobalSearch (params) {
  return request({
    url: '/h5/sale/noauth/global/search',
    method: 'get',
    params
  })
}

export function getKingKongSuggest (params) {
  return request({
    url: '/h5/sale/noauth/shop/getCategory',
    method: 'get',
    params
  })
}

export function getSubCategory (params) {
  return request({
    url: '/h5/sale/noauth/shop/getSubCategory',
    method: 'get',
    params
  })
}

export function getPosCostTime (params) {
  return request({
    url: '/h5/sale/noauth/getPosCostTime',
    method: 'get',
    params
  })
}

export function getAllCity (params) {
  return request({
    url: '/h5/sale/noauth/getAllCity',
    method: 'get',
    params
  })
}
