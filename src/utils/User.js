import Cookies from 'js-cookie'
import { Toast } from 'vant'
import { diffModuleJump } from '@utils/index'
import { logoutSubmit } from '@api/login'
import { useUserInfo } from '@common/hooks/userInfo'

class User {
  constructor () {
    this.TokenKey = 'userSessionId'
  }

  getLoginToken () {
    return Cookies.get(this.TokenKey)
  }

  setLoginToken (token) {
    return Cookies.set(this.TokenKey, token)
  }

  removeLoginToken () {
    return Cookies.remove(this.TokenKey)
  }

  // 统一处理登录
  login (redirecturi) {
    const url = redirecturi || window.location.href
    const query = `redirecturi=${encodeURIComponent(url)}`
    diffModuleJump('/login', query, 'login')
  }

  // 登出
  logout () {
    const { removeUserStorage } = useUserInfo()
    logoutSubmit()
      .then(res => {
        Toast('已退出登录!')
        this.removeLoginToken()
        removeUserStorage()
        location.reload()
      }).catch(err => {
        console.log(err)
      })
  }
}

export default new User()
