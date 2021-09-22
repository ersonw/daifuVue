import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import NodeRSA from 'node-rsa'
//
// const publicKey = `-----BEGIN RSA PUBLIC KEY-----\
// MEgCQQCAiRL0eNswPpWFZOdWX0dTIkk8f178rICgMfl2llEY1Dh0PtYMCfPe8M1W\
// S4Zqon4g6MmLXlpD2HjwZtdHyulnAgMBAAE=\
// -----END RSA PUBLIC KEY-----`
// const privateKey = `-----BEGIN RSA PRIVATE KEY-----\
// MIIBOQIBAAJBALpmJetk9yfLheWkkSKLNA0/iwjVA3Lg54/P/ceIa6vurBm+xCXi\
// /0JDg1Qj/jkOqA6pSuZCtiPZdl8OKJtnWNsCAwEAAQJASGmuiYgrzDXwyonoKDdT\
// /WGWLdQzBsoAq4nt2TpSOfRQkcrPIQC+Eugleirfa6+bDYzp2V21RxG+GzamKjin\
// oQIhAOr8MgXsaQII06jsSNSPsuYRdyBrOgEz8dHnfF8GJaVnAiEAyxGcVtInGukD\
// 0Yi2WHOssWgkIp1i5MA2vkdWkd6hNG0CIBpVCIYBaAMCWjWjxMWNFM8TRfYsDeP0\
// njSXbCh5194hAiAKt8Q7pN3hgrjr3z5YjspnlqqJlSr6DdcV1egQzOJPRQIgKZSI\
// IBi7qURUhgtu/7Hs700H+VTGXHH+0EurhS4yx2g=\
// -----END RSA PRIVATE KEY-----`

// const rsaEncrypt = function(pas) {
//   const nodeRsa = new NodeRSA(privateKey)
//   return nodeRsa.encryptPrivate(pas, 'base64', 'utf8')
// }
//
// const rsaDecrypt = function(pas) {
//   const nodeRsa = new NodeRSA(publicKey)
//   return nodeRsa.decryptPublic(pas, 'utf8')
// }
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Token'] = getToken()
    }
    // config.transformRequest = [function(data) {
    //   // 在请求之前对data传参进行格式转换
    //   console.log(data)
    //   data = JSON.stringify(data)
    //   console.log(data)
    //   data = rsaEncrypt(data)
    //   data = data ? data.replace(/\+/g, '_') : ''
    //   console.log(data)
    //   return data
    // }]
    return config
  },
  error => {
    // do something with request error
    // console.log('request.js')
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log(response.data)
    const res = (response.data)
    // console.log(res)
    // 如果自定义代码不是20000，则判断为错误。
    // console.log(res.code)
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008：非法令牌； 50012：其他客户端登录； 50014：令牌过期；
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('您已退出，您可以取消停留在此页面，或重新登录', '确认退出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
