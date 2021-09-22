import Layout from '@/layout'
// import componentsRouter from '@/router/modules/user'
const telebotRouter = {
  path: '/telebot',
  component: Layout,
  redirect: 'noRedirect',
  name: 'telebot',
  meta: {
    title: 'TeleBot',
    icon: 'component',
    roles: ['admin']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/telebot/list'),
      name: 'list',
      meta: { title: '入款订单', roles: ['admin'] }
    },
    {
      path: 'out',
      component: () => import('@/views/telebot/out'),
      name: 'out',
      meta: { title: '下发订单', roles: ['admin'] }
    },
    {
      path: 'card',
      component: () => import('@/views/telebot/card'),
      name: 'card',
      meta: { title: '卡号管理', roles: ['admin'] }
    },
    {
      path: 'users',
      component: () => import('@/views/telebot/users'),
      name: 'users',
      meta: { title: '用户管理', roles: ['admin'] }
    },
    {
      path: 'statistics',
      component: () => import('@/views/telebot/statistics'),
      name: 'statistics',
      meta: { title: '统计管理', roles: ['admin'] }
    },
    {
      path: 'contact',
      component: () => import('@/views/telebot/contact'),
      name: 'contact',
      meta: { title: '客服管理', roles: ['admin'] }
    },
    {
      path: 'config',
      component: () => import('@/views/telebot/config'),
      name: 'config',
      meta: { title: '配置管理', roles: ['admin'] }
    }]
}

export default telebotRouter
