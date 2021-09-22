import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(t) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { t }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}
