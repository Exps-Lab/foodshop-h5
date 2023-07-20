import request from '@utils/request.js'

export function submitComment (data) {
  return request({
    url: '/h5/order/auth/comment/submit',
    method: 'post',
    data
  })
}

export function getCommentByShopId (params) {
  return request({
    url: '/h5/order/noauth/comment/getByShopId',
    method: 'get',
    params
  })
}
