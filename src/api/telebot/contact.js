import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/telebot/contact/list',
    method: 'get',
    params: data
  })
}
export function update(data) {
  return request({
    url: '/telebot/contact/update',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/telebot/contact/delete',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: '/telebot/contact/add',
    method: 'post',
    data
  })
}

