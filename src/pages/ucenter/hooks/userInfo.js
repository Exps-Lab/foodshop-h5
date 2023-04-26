import { ref, reactive } from 'vue'
import { getUserInfo } from '@api/user'

// 按照惯例，组合式函数名以“use”开头
export function useUserInfo () {
  const storageKey = 'userInfo'
  const loading = ref(false)
  const defaultAvatar = 'http://static.foodshop.fun/WzEaxHRQsmA2rea.png'
  let userInfo = reactive({
    avatar: defaultAvatar,
    username: '',
    c_time: '',
    u_id: ''
  })

  // 统一抽离获取用户信息入口
  const getUserData = () => {
    const storageUserInfo = JSON.parse(localStorage.getItem(storageKey) || '{}')
    if (!storageUserInfo.username) {
      reqUserInfo()
    } else {
      userInfo = Object.assign(userInfo, storageUserInfo)
    }
    loading.value = false
  }

  const reqUserInfo = () => {
    loading.value = true
    getUserInfo().then(res => {
      res.data.avatar = res.data.avatar || defaultAvatar
      userInfo = Object.assign(userInfo, res.data)
      setUserStorage(userInfo)
    }).catch(e => {
    }).finally(() => {
      loading.value = false
    })
  }

  // 用户信息数据分别单独更新，所有不统一抽离更新请求函数，只抽出增删storage相关方法
  // 更新用户storage
  const setUserStorage = (data) => {
    localStorage.removeItem(storageKey)
    localStorage.setItem(storageKey, JSON.stringify(data))
  }

  // 删除用户storage
  const removeUserStorage = () => {
    localStorage.removeItem(storageKey)
  }

  getUserData()

  return {
    userInfoLoading: loading.value,
    userData: userInfo,
    setUserStorage,
    removeUserStorage
  }
}
