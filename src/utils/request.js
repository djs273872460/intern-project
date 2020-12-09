import axios from 'axios'

const service = axios.create({
  baseURL:'/api',
  // 禁止使用缓存
  headers:{'Cache-Control':'no-cache'},
  timeout: 5000
})

// service.interceptors.request.use(
//   config => {
//     return config;
//   },
//   error => {
//     // do something with request error
//     console.log(error); // for debug
//     return Promise.reject(error);
//   }
// );

export default service