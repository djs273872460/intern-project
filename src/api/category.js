import request from '../utils/request'

export function getCategroyList() {
  return request({
    url: '/Analysis/GetCategroyList',
    method: 'get'
  })
}