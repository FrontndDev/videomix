
export default {
  namespaced: true,
  state: {
    error: null
  },
  actions: {

  },
  mutations: {
    ERROR_CHANGE(state: any, error: string) {
      state.error = error
    },
    CLEAR_ERROR(state: any) {
      state.error = null
    }
  }
}