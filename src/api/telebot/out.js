import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/telebot/out/list',
    method: 'get',
    params: data
  })
}
export function getUser(t) {
  return request({
    url: '/telebot/out/getUser',
    method: 'get',
    params: { t }
  })
}
export function update(data) {
  return request({
    url: '/telebot/out/update',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/telebot/out/delete',
    method: 'post',
    data
  })
}
