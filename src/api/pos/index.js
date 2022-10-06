import request from '@utils/request.js'

export function getPosByIp () {
  return request({
    url: '/h5/common/noauth/getPosByIp',
    method: 'get'
  })
}
