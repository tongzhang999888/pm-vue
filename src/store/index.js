import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      user: localStorage.getItem('user') ? localStorage.getItem('user') : null,
        //若localSorage存在token，将值赋给Vuex.state.token
      token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
      permission: localStorage.getItem('permission') ? localStorage.getItem('permission') : null,
      operations: localStorage.getItem('operations') ? localStorage.getItem('operations') : null,
  },
  getters: {
  },
  mutations: {
    /**
     * 将用户信息存在localStorage中
     */
    setUser(state, user) {
        state.user = user
        localStorage.setItem('user', JSON.stringify(user))
    },
    /**
     * 将token存在localStorage中
     */
    setToken(state, token) {
        localStorage.setItem('token', token)
        state.token = token
    },
    /**
     * 将用户权限存在localStorage中
     */
    setPermission(state, permission) {
        localStorage.setItem('permission', JSON.stringify(permission))
        state.permission = permission
    },
    /**
     * 将用户可以请求的url存在localStorage中
     */
    setOperations(state, operations) {
        localStorage.setItem('operations', JSON.stringify(operations))
        state.operations = operations
    },
    /**
     * 登出，清除localStorage中存储的数据
     */
    logout(state) {
        localStorage.removeItem('token')
        state.token = null
        localStorage.removeItem('user')
        state.user = null
        localStorage.removeItem('permission')
        state.permission = null
        localStorage.removeItem('operations')
        state.operations = null
    }
  },
  actions: {
  },
  modules: {
  }
})
