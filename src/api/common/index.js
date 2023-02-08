import request from '@utils/request'

// 获取文件上传凭证token
export function uploadToken () {
  return request({
    url: '/h5/user/noauth/uploadToken',
    method: 'get'
  })
}
