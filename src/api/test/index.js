import request from '@utils/request.js'

export function test (params) {
  return request({
    url: '/test/a',
    method: 'get',
    params
  })
}
