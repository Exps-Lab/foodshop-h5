import axios from "axios"

let loading = false
let requestCount = 0
let redirecturi = ''
const host = window.location.origin

const showLoading = () => {
  if (requestCount === 0 && !loading) {
    // TODO: 显示loading组件
    loading = true
    console.log('Loading Start...', Date.now())
  }
  requestCount++
}

const hideLoading = () => {
  requestCount--
  if (requestCount == 0) {
    // TODO: 隐藏loading组件
    loading = false
    console.log('Loading End...', Date.now())
  }
}

const service = axios.create({
  timeout: 5000
})

// Sign in the request interceptors.
service.interceptors.request.use(
  config => {
    showLoading()
    return config
  },
  error => {
    // Do something with request error
    // for debug
    console.log(error)
    Promise.reject(error)
  }
)

// Sign in the response interceptors.
service.interceptors.response.use(
  response => {
    hideLoading()
    const res = response.data
    if (res.code !== 1) {
      // 30004    "token格式错误"
      // 30005    "token过期"
      if ([30004, 30005].includes(res.code)) {
        redirecturi = redirecturi || window.location.href
        window.location.href = host + '/login.html?redirecturi=' + encodeURIComponent(redirecturi)
      } else {
        // TODO: 组件提示用户错误信息
        return Promise.reject(response)
      }
    } else {
      return response.data
    }
  },
  error => {
    hideLoading()
    console.log("Error:" + error)
    return Promise.reject(error)
  }
);

function handle(req) {
  if (req.params && req.params.redirecturi) {
    redirecturi = req.params.redirecturi
    delete req.params.redirecturi
  } else {
    redirecturi = ''
  }
  return service(req)
}

export default handle