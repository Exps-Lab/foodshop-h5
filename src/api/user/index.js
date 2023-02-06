import request from '@utils/request.js'

export function getUserInfo () {
  return request({
    url: '/h5/user/auth/getUserInfo',
    method: 'post',
    forbidAutoJumpLogin: true
  })
}
