import { constantRoutes, asyncRoutes } from '@/router'
// import Layout from '@/layout'
// import { getRoutes } from '@/api/role'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return false
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
// export function getAsyncRoutes(roles){
//   var res = []
//   for (const v of roles){
//     if (v.pid === 0){
//       var c = []
//       for (const vv of roles){
//         if (vv.pid === v.id){
//           c.push({
//             path: vv.name,
//             component: () => import(`@/views/${v.name}/${vv.name}`),
//             name : vv.name,
//             meta: { title: vv.title, noCache : true }
//           })
//         }
//       }
//       res.push({
//         path      : `/${v.name}`,
//         component : Layout,
//         meta : { title : v.title },
//         children : c
//       })
//     }
//   }
// }
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // getRoutes().then(response => {
      //  const { data } = response
      //   const { asyncRoutes } = data
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // console.log(roles.includes('admin'))
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
      // })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
