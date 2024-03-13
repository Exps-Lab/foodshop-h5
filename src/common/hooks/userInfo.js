import { ref, reactive } from 'vue'
import { getUserInfo } from '@api/user'

// 按照惯例，组合式函数名以“use”开头
export function useUserInfo () {
  const loading = ref(false)
  const defaultAvatar = 'http://static.foodshops.fun/WzEaxHRQsmA2rea.png'
  let userInfo = reactive({
    avatar: defaultAvatar,
    username: '',
    c_time: '',
    u_id: ''
  })

  // 统一抽离获取用户信息入口
  const getUserData = async () => {
    loading.value = true
    const { data } = await getUserInfo()
    data.avatar = data.avatar || defaultAvatar
    userInfo = Object.assign(userInfo, data)

    loading.value = false
    return userInfo
  }

  return {
    userInfoLoading: loading.value,
    getUserData: getUserData
  }
}
