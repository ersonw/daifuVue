import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/telebot/card/list',
    method: 'get',
    params: data
  })
}
export function getSid(t) {
  return request({
    url: '/telebot/card/getsid',
    method: 'get',
    params: { t }
  })
}
export function update(data) {
  return request({
    url: '/telebot/card/update',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/telebot/card/delete',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: '/telebot/card/add',
    method: 'post',
    data
  })
}
