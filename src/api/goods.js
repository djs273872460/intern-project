import request from '../utils/request'

export function getGoodsList(params) {
  return request({
    url: '/Analysis/GetPageList',
    method: 'get',
    params
  })
}