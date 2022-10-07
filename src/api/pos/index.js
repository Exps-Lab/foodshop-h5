import request from '@utils/request.js'

export function getPosByIp () {
  return request({
    url: '/h5/common/noauth/getPosByIp',
    method: 'get'
  })
}

export function searchWithRange (params) {
  return request({
    url: '/h5/common/noauth/place/searchWithRange',
    method: 'get',
    params
  })
}
