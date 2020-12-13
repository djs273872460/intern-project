import axios from 'axios'

const service = axios.create({
  baseURL:'/dev-api',
  // 禁止使用缓存
  headers:{'Cache-Control':'no-cache'},
  timeout: 5000
})


export default service