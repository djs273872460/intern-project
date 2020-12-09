import { createStore } from "vuex";
import { loginValidate } from "../api/validate.js"
import { getToken, setToken} from "../utils/auth.js"

const store = createStore({
  state: {
    token: getToken()
  },
  getters: {
    token: state => state.token,
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },
  actions: {
    login({ commit }, userInfo) {
      const {username, password} = userInfo;
      return new Promise((resolve,reject) => {
        loginValidate({ account: username, pwd: password}).then(res => {
          if(res.data.isSuccess) {
            console.log(res)
            commit('SET_TOKEN', res.data.data.token)
            setToken(res.data.data.token)
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
  },
  modules: {}
});

export default store
