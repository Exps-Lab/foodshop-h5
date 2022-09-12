import request from '@utils/request.js'

export function getCapture (params) {
  return request({
    url: '/h5/user/noauth/getCapture',
    method: 'get',
    params
  })
}

export function loginSubmit (data) {
  return request({
    url: '/h5/user/noauth/login',
    method: 'post',
    data
  })
}
