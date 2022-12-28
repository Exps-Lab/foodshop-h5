
// 处理用户选择的位置Store
const UserChosePosStore = {
  namespaced: true,
  state: {
    lat: '',
    lng: '',
    city: '', // 城市
    title: '', // 具体地标
    address: '' // 具体街道地址
  },
  mutations: {
    setLatLng (state, value) {
      state.lat = value.lat
      state.lng = value.lng
    },
    setCity (state, value) {
      state.city = value
    },
    setAddress (state, value) {
      state.address = value
    },
    setAllInfo (state, value) {
      const { lat, lng, city = '', address = '', title = '' } = value
      state.lat = lat
      state.lng = lng
      state.city = city
      state.title = title
      state.address = address
    }
  },
  actions: {
    setUserPos ({ commit, state }, value) {
      commit('SET_POS', value)
    }
  }
}

export default UserChosePosStore
