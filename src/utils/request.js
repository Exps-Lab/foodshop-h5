import axios from 'axios'
import User from '@utils/User'
// import Loading from "@common/components/Loading/index.js"

// let loading = false
// const requestCount = 0
let redirecturi = ''
// const host = window.location.origin

// const showLoading = () => {
//   if (requestCount === 0) {
//     Loading.show()
//   }
//   requestCount++
// }

// const hideLoading = () => {
//   requestCount--
//   if (requestCount === 0) {
//     Loading.hide()
//   }
// }

const service = axios.create({
  timeout: 5000
})

// Sign in the request interceptors.
service.interceptors.request.use(
  config => {
    // showLoading()
    return config
  },
  error => {
    // Do something with request error
    // for debug
    console.log(error)
    return Promise.reject(error)
  }
)

// Sign in the response interceptors.
service.interceptors.response.use(
  response => {
    // hideLoading()
    const res = response.data
    if (res.code !== 1) {
      // 10002    "没有token或token格式错误"
      if ([10002].includes(res.code)) {
        redirecturi = redirecturi || window.location.href
        // window.location.href = host + '/hi-user/' + '/src/pages/login/index.html?redirecturi=' + encodeURIComponent(redirecturi)
        // window.location.href = host + '/login?redirecturi=' + encodeURIComponent(redirecturi)
        User.login(redirecturi)
      } else {
        return Promise.reject(response)
      }
    } else {
      return res
    }
  },
  error => {
    // hideLoading()
    console.log('Error:' + error)
    return Promise.reject(error)
  }
)

function serviceInstance (req) {
  if (req.params && req.params.redirecturi) {
    redirecturi = req.params.redirecturi
    delete req.params.redirecturi
  } else {
    redirecturi = ''
  }
  return service(req)
}

export default serviceInstance
