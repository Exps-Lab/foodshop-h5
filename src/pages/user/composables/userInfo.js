import { ref, reactive } from 'vue'
import { getUserInfo } from '@api/user'

// 按照惯例，组合式函数名以“use”开头
export function useUserInfo () {
  const storageKey = 'userInfo'
  const loading = ref(false)
  let userInfo = reactive({
    avatar: '',
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
      userInfo = Object.assign(userInfo, res.data)
      localStorage.setItem(storageKey, JSON.stringify(userInfo))
    }).catch(e => {
    }).finally(() => {
      loading.value = false
    })
  }

  getUserData()

  return {
    userInfoLoading: loading.value,
    userData: userInfo
  }
}
