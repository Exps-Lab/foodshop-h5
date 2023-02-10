import request from '@utils/request.js'

export function getUserInfo () {
  return request({
    url: '/h5/user/auth/getUserInfo',
    method: 'get',
    forbidAutoJumpLogin: true
  })
}

export function updateUserName (data) {
  return request({
    url: '/h5/user/auth/updateUserName',
    method: 'post',
    data
  })
}

export function updateUserAvatar (data) {
  return request({
    url: '/h5/user/auth/updateUserAvatar',
    method: 'post',
    data
  })
}
