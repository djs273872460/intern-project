import request from '../utils/request'

export function loginValidate(params) {
  return request({
    url: '/Account/Login',
    method: 'post',
    params
  })
}