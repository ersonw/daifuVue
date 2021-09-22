import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/telebot/config/list',
    method: 'get',
    params: data
  })
}
export function update(data) {
  return request({
    url: '/telebot/config/update',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/telebot/config/detele',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: '/telebot/config/add',
    method: 'post',
    data
  })
}
