import request from '../utils/request'

export function getGoodsList(data) {
  return request({
    url: '/Analysis/GetPageList',
    method: 'post',
    data
  })
}