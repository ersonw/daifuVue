import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/telebot/list',
    method: 'get',
    params: data
  })
}
export function getBank(t) {
  return request({
    url: '/telebot/getBank',
    method: 'get',
    params: { t }
  })
}
export function update(data) {
  return request({
    url: '/telebot/update',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/telebot/delete',
    method: 'post',
    data
  })
}
