import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/telebot/users/list',
    method: 'get',
    params: data
  })
}
export function update(data) {
  return request({
    url: '/telebot/users/update',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/telebot/users/delete',
    method: 'post',
    data
  })
}

