import request from '@utils/request.js'

export function addAddress (data) {
  return request({
    url: '/h5/user/auth/address/add',
    method: 'post',
    data
  })
}

export function updateAddress (data) {
  return request({
    url: '/h5/user/auth/address/update',
    method: 'post',
    data
  })
}

export function getAddressList () {
  return request({
    url: '/h5/user/auth/address/list',
    method: 'get'
  })
}

export function getAddressDetail (params) {
  return request({
    url: '/h5/user/auth/address/detail',
    method: 'get',
    params
  })
}

export function deleteAddress (data) {
  return request({
    url: '/h5/user/auth/address/delete',
    method: 'post',
    data
  })
}
