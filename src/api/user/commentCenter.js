import request from '@utils/request.js'

export function getAccountMoney (params) {
  return request({
    url: '/h5/user/auth/account/money/get',
    method: 'get',
    params
  })
}

export function updateAccountMoney (data) {
  return request({
    url: '/h5/user/auth/account/money/update',
    method: 'post',
    data
  })
}
