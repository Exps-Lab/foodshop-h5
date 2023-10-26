import request from '@utils/request.js'

export function addCollect (data) {
  return request({
    url: '/h5/user/auth/collect/add',
    method: 'post',
    data
  })
}

export function removeCollect (data) {
  return request({
    url: '/h5/user/auth/collect/remove',
    method: 'post',
    data
  })
}

export function getCollectList (params) {
  return request({
    url: '/h5/user/auth/collect/list',
    method: 'get',
    params
  })
}
