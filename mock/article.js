const Mock = require('mockjs')

const List = []
const count = 100

// for (let i = 0; i < count; i++) {
List.push(Mock.mock({
  UserID: '123456',
  GameID: '12456',
  SpreaderID: '258741',
  Accounts: '13800138000',
  NickName: 'mock data',
  RegAccounts: '',
  UnderWrite: '@float(0, 100, 2, 2)',
  PassPortID: '@integer(1, 3)',
  InsurePass: '@datetime',
  DynamicPass: '',
  DynamicPassTime: '@integer(300, 5000)',
  FaceID: '',
  CustomID: '',
  UserRight: '',
  MasterRight: '',
  ServiceRight: '',
  MasterOrder: '',
  MemberOrder: '',
  MemberOverDate: '',
  MemberSwitchDate: '',
  CustomFaceVer: '',
  Gender: '',
  Nullity: '',
  NullityOverDate: '',
  StunDown: 0,
  MoorMachine: '',
  IsAndroid: '',
  WebLogonTimes: '',
  GameLogonTimes: '',
  PlayTimeCount: '',
  OnLineTimeCount: '',
  LastLogonIP: '',
  LastLogonDate: '',
  LastLogonMobile: '',
  LastLogonMachine: '',
  RegisterIP: '',
  RegisterDate: '',
  RegisterMobile: '13800138000',
  RegisterMachine: '',
  RegisterOrigin: '',
  PlatformID: '',
  UserUin: '',
  RankID: '',
  AgentID: '',
  PlaceName: '',
  checkCode: '',
  Source: '',
  LoginSource: '',
  NullityReasonID: '',
  NullityRemark: '',
  Remark: ''
}))
// }

module.exports = [
  {
    url: '/article/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      const mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

