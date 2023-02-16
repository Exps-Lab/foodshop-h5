import Cookies from 'js-cookie'
import { Toast } from 'vant'
import { logoutSubmit } from '@api/login'
import { useUserInfo } from '@pages/user/hooks/userInfo'

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
    const loginUrl = import.meta.env.DEV
      ? 'src/pages/login/index.html'
      : 'login'
    location.href = `${location.origin}/${loginUrl}?redirecturi=${encodeURIComponent(url)}`
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
