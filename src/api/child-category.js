import request from '../utils/request'

export function getChildCategoryList(params) {
  return request({
    url: '/Analysis/GetAllCategory',
    method: 'get',
    params
  })
}