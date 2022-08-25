import { createStore } from "vuex"

const store = createStore({
  state() {
    return {
      name: 'hello vite',
      age: 2
    }
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