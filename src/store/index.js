import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        selectedOpen: false,
        successSnackbarOpen: false,
        failureSnackbarOpen: false,
        failureMessage: '',
        successMessage: '',
    }, mutations: {
        setSelectedOpen(state, bool) {
            state.selectedOpen = bool;
        }, setSuccessSnackbarOpen(state, bool) {
            state.successSnackbarOpen = bool
        }, setFailureSnackbarOpen(state, bool) {
            state.failureSnackbarOpen = bool;
        }, setFailureMessage(state, msg) {
            state.failureMessage = msg;
        }, setSuccessMessage(state, msg) {
            state.successMessage = msg;
        }
    }, actions: {
        setSelectedOpen({commit}, bool) {
            commit('setSelectedOpen', bool)
        }, setSuccessSnackbarOpen({commit}, bool) {
            commit('setSuccessSnackbarOpen', bool)
        }, setFailureSnackbarOpen({commit}, bool) {
            commit('setFailureSnackbarOpen', bool)
        }, setFailureMessage({commit}, msg) {
            commit('setFailureMessage', msg);
        }, setSuccessMessage({commit}, msg) {
            commit('setSuccessMessage', msg);
        }
    }, modules: {}
})
