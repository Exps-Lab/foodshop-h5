import request from '@utils/request.js'

export function getPosByIp () {
  return request({
    url: '/h5/sale/noauth/getPosByIp',
    method: 'get'
  })
}

export function searchWithRange (params) {
  return request({
    url: '/h5/sale/noauth/place/searchWithRange',
    method: 'get',
    params
  })
}

export function searchWithoutKeyword (params) {
  return request({
    url: '/h5/sale/noauth/place/searchWithoutKeyword',
    method: 'get',
    params
  })
}
