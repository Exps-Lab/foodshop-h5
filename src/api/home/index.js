import request from '@utils/request.js'

// 获取商铺列表
export function getShopList (params) {
  return request({
    url: '/h5/sale/noauth/shop/list',
    method: 'get',
    params
  })
}

// 商铺或商品模糊查询
export function getGlobalSearch (params) {
  return request({
    url: '/h5/sale/noauth/global/search',
    method: 'get',
    params
  })
}

// 获取金刚位一级分类信息
export function getKingKongSuggest (params) {
  return request({
    url: '/h5/sale/noauth/shop/getCategory',
    method: 'get',
    params
  })
}

// 获取二级分类信息
export function getSubCategory (params) {
  return request({
    url: '/h5/sale/noauth/shop/getSubCategory',
    method: 'get',
    params
  })
}

// 批量获取配送时长
export function getPosCostTime (params) {
  return request({
    url: '/h5/sale/noauth/getPosCostTime',
    method: 'get',
    params
  })
}

// 获取城市列表
export function getAllCity (params) {
  return request({
    url: '/h5/sale/noauth/getAllCity',
    method: 'get',
    params
  })
}
