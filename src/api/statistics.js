import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: data
  })
}
export function getStatic(t) {
  return request({
    url: '/transaction/static',
    method: 'get',
    params: { t }
  })
}
