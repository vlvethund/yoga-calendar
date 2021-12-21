import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedOpen: false,
    successSnackbarOpen: false,
    failureSnackbarOpen: false,
  },
  mutations: {
    setSelectedOpen(state, bool) {
      state.selectedOpen = bool;
    },
    setSuccessSnackbarOpen(state, bool) {
      state.successSnackbarOpen = bool
    },
    setFailureSnackbarOpen(state, bool) {
      state.failureSnackbarOpen = bool;
    }
  },
  actions: {
    setSelectedOpen({commit}, bool) {
      commit('setSelectedOpen', bool)
    },
    setSuccessSnackbarOpen({commit}, bool) {
      commit('setSuccessSnackbarOpen', bool)
    },
    setFailureSnackbarOpen({commit}, bool) {
      commit('setFailureSnackbarOpen', bool)
    }
  },
  modules: {
  }
})
