// import { loginValidate } from "../api/validate"
// import { createStore } from "vuex";
// import { getToken, setToken} from "../utils/auth"

// export default createStore({
//   state: {
//     token: getToken()
//   },
//   mutations: {
//     SET_TOKEN: (state, token) => {
//       state.token = token
//     }
//   },
//   actions: {
//     login({ commit }, userInfo) {
//       const {username, password} = userInfo;
//       return new Promise((resolve,reject) => {
//         loginValidate({ username: username, password: password}).then(res => {
//           commit('SET_TOKEN', res.token)
//           setToken(res.token)
//           resolve()
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     }
//   },
//   modules: {}
// });
