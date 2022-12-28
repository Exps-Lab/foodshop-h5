import { createStore } from 'vuex'
import getters from './getters'
import UserChosePos from './user-chose-pos'

const store = createStore({
  modules: {
    userPos: UserChosePos
  },
  getters,
  state: {
    name: 'hello vite'
  },

  mutations: {
    SET_NAME (state, name) {
      state.name = name
    }
  },

  actions: {
    setName ({ commit, state }, name) {
      commit('SET_NAME', name)
    }
  }
})

export default store
