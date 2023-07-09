import request from '@utils/request.js'

export function getCommentCenterList (params) {
  return request({
    url: '/h5/user/auth/commentCenter/list',
    method: 'get',
    params
  })
}
