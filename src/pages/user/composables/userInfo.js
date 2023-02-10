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

  const setUserStorage = (data) => {
    localStorage.removeItem(storageKey)
    localStorage.setItem(storageKey, JSON.stringify(data))
  }

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
