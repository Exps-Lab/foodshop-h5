
/**
 * 获取url中参数
 * @param  {String} query 要获取的参数，对大小写敏感
 * @return {String}       要获取的参数对应的值，为获取则为空字符串
 */
export function getQuery (query) {
  if (!query) return ''
  const _query = window.location.search.substring(1)
  const _eachQuery = _query.split('&')
  let i = 0
  while (i < _eachQuery.length) {
    const _keyValue = _eachQuery[i].split('=')
    if (_keyValue[0] === query) {
      return _keyValue[1]
    }
    i++
  }
  return ''
}

/**
 * 判断url中是否有参数
 * @param  {[String, Null]}  [url=window.location.href] 传入url，默认为当前页面URL
 * @return {Boolean}                                    url是否有参
 */
export function hasQuery (url = window.location.href) {
  const firstQuery = url.split('?')
  if (firstQuery.length > 1) {
    return true
  } else {
    return false
  }
}

/**
 * 删除url中参数
 * @param  {String} query 要删除的query
 * @param  {String} url   要删除的url
 * @return {String}       返回删除后的url
 */
export function delQuery (query, url = window.location.href) {
  const urlArr = url.split('?')
  if (urlArr.length > 1 && urlArr[1].indexOf(query) > -1) {
    const _search = urlArr[1]
    const obj = {}
    const arr = _search.split('&')
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=')
      obj[arr[i][0]] = arr[i][1]
    }
    delete obj[query]
    const urlte = `${urlArr[0]}?${JSON.stringify(obj).replace(/["{}]/g, '').replace(/:/g, '=').replace(/,/g, '&')}`
    return urlte
  } else {
    return url || window.location.href
  }
}

/**
 * 验证用户输入的手机号或姓名是否合法
 * @param  {Object}  options
 *         {String}  type    验证类型（phone or name)
 *         {String}  content 验证内容
 * @return {Boolean}         是否合法
 */
export function verifyInput (options) {
  switch (options.type) {
    case 'phone':
      const _phoneReg = /^1((3\d)|(4[5, 7])|(5\d)|7([0, 6, 7, 8])|8(\d))\d{8}$/
      return _phoneReg.test(options.content) === true
    case 'name':
      const _nameReg = /^[\u4e00-\u9fa5]+$/
      return _nameReg.test(options.content) === true
    default:
      return false
  }
}

/**
 * 获取字符串字节长度（中文算两个字节）
 * @param  {[String, Number]} val 需要判断的字符串
 * @return {Number}     长度
 */
export function getByteLen (val) {
  if (!val && val !== 0) return 0
  let _length = 0
  const _val = val.toString()
  for (let i = 0; i < _val.length; i++) {
    const _char = _val.charCodeAt(i)
    if (_char > 127 || _char === 94) {
      _length += 2
    } else {
      _length++
    }
  }
  return _length
}

/**
 * 判断是否是函数
 * @param  {Function}  func 传入函数
 * @return {Boolean}       是否是函数
 */
export function isFunction (func) {
  return func && Object.prototype.toString.call(func) === '[object Function]'
}

/**
 * 判断是否是对象
 * @param  {Object}  obj 传入对象
 * @return {Boolean}     是否是对象
 */
export function isObject (obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 判断是否是数字
 * @param  {Number}  num 传入数字
 * @return {Boolean}     是否是数字
 */
export function isNumber (num) {
  return num && Object.prototype.toString.call(num) === '[object Number]'
}

/**
 * 判断是否是真数组
 * @param  {Array}  arr  传入数组
 * @return {Boolean}     是否是真数组
 */
export function isArray (arr) {
  return arr && Object.prototype.toString.call(arr) === '[object Array]'
}

/**
 * 判断是否是伪数组
 * @param  {Object}  obj 传入对象
 * @return {Boolean}     是否是伪数组
 */
export function isLikeArray (obj) {
  if (isFunction(obj) || obj === window) return false
  if (isNumber(obj.length) && obj.length >= 0 && (obj.length - 1) in obj) return true
  return false
}

/**
 * localStorage简单封装
 *  @function get                       获取storage
 *    @params {String}                    key 要获取的key
 *  @function set                       设置storage
 *    @params {String}                    key 要设置的key
 *    @params {[String, Number, Object]}  val 要设置的val
 *  @function remove                    删除storage
 *    @params {String}                    key 要删除的key
 *  @function clear                     完全清除storage
 */
export const Storage = {
  get (key, storage = localStorage) {
    const _obj = storage.getItem(key)
    if (_obj && _obj !== 'undefined' && _obj !== 'null') {
      return JSON.parse(_obj)
    }
    return ''
  },
  set (key, val, storage = localStorage) {
    storage.setItem(key, JSON.stringify(val))
  },
  remove (key, storage = localStorage) {
    if (key) {
      storage.removeItem(key)
    } else {
      this.clear()
    }
  },
  clear (storage = localStorage) {
    storage.clear()
  }
}

/**
 * 深拷贝
 * @param  {Object} [obj={}] 深拷贝对象
 * @return {Object}          深拷贝后的结果
 */
export function cloneDeep (obj = {}) {
  if (!isObject(obj)) return obj
  const newobj = {}
  for (const attr in obj) {
    newobj[attr] = cloneDeep(obj[attr])
  }
  return newobj
}

/**
 * Cookie操作封装
 *  @function get                     获取cookie
 *    @params {String}                  key 要获取的key
 *  @function set                     设置cookie
 *    @params {String}                  key 要设置的key
 *    @params {[String, Number Object]} val 要设置的val
 *  @function remove                  删除cookie
 *    @params {String}                  key 要删除的key
 *  @function clear                   完全清除cookie
 */
export const Cookie = {
  get (key) {
    const _cookie = '' + document.cookie
    const ind = _cookie.indexOf(key)
    if (ind === -1 || key === '') return ''
    let ind1 = _cookie.indexOf('; ', ind)
    if (ind1 === -1) ind1 = _cookie.length
    // 读取Cookie值
    return unescape(_cookie.substring(ind + key.length + 1, ind1))
  },
  set (key, value) {
    const _now = new Date()
    // Cookie过期时间
    const _expire = new Date()
    // 如果未设置nDays参数或者nDays为0，取默认值1
    // if(nDays == null || nDays == 0) nDays = 1;
    // 计算Cookie过期时间【 3600000 * 24  为一天】
    _expire.setTime(_now.getTime() + 3600000 * 24 * 30) // 一个月
    document.cookie = `${key}=${escape(value)}; path=/; expires=${_expire.toGMTString()}`
  },
  remove (key) {
    // const myDate = new Date()
    // myDate.setTime(-1000) // 设置时间
    // document.cookie = `${key}=; expires=${myDate.toGMTString()}`
    this.set(key, '')
  },
  removes (keys) {
    const _cookies = isArray(keys) ? keys : [keys]
    for (let i = 0; i < _cookies.length; i++) {
      this.set(_cookies[i], '')
    }
  },
  clear () {
    const _now = new Date()
    _now.setTime(-1000) // 设置时间
    const _cookie = document.cookie
    const _cookieArray = _cookie.split('; ')
    for (let i = 0; i < _cookieArray.length; i++) {
      const _key = _cookieArray[i].split('=')
      document.cookie = `${_key[0]}=; expires=${_now.toGMTString()}`
    }
  }
}

/**
 * Url操作
 * @type {Object}
 */
export const Uri = {
  decode (url) {
    return decodeURIComponent(url)
  },
  encode (url) {
    return encodeURIComponent(url)
  }
}

/**
 * 判断是否是Dom
 * @param  {Element}  obj
 * @return {Boolean}
 */
export function isDom (obj) {
  return typeof HTMLElement === 'object'
    ? obj instanceof HTMLElement
    : obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
}

/**
 * 判断是否是NodeList
 * @param  {NodeList}  nodeList
 * @return {Boolean}
 */
export function isNodeList (nodeList) {
  return nodeList.length > 1 && Array.prototype.every.call(nodeList, node => {
    return isDom(node)
  })
}

/**
 * 两个数组取交集
 * @param  {Array} arr1 数组1
 * @param  {Array} arr2 数组2
 * @return {Array}      结果数组
 */
export function intersect (arr1, arr2) {
  const result = []
  const obj = {}
  for (let i = 0; i < arguments.length; i++) {
    for (let j = 0; j < arguments[i].length; j++) {
      const str = arguments[i][j]
      if (!obj[str]) {
        obj[str] = 1
      } else {
        obj[str]++
        if (obj[str] === arguments.length) {
          result.push(str)
        }
      }
    }
  }
  return result
}

/**
 * 多个数组取并集
 * @return {Array} 并集数组
 */
export function union () {
  const arr = []
  const obj = {}
  for (let i = 0; i < arguments.length; i++) {
    for (let j = 0; j < arguments[i].length; j++) {
      const str = arguments[i][j]
      if (!obj[str]) {
        obj[str] = 1
        arr.push(str)
      }
    }
  }
  return arr
}

// obj转url
export function objToUrl (param) {
  if (param === null) return ''
  const tempArr = []
  for (const key in param) {
    if (param[key] !== undefined &&
      param[key] !== null) {
      tempArr.push(key + '=' + param[key])
    }
  }
  if (tempArr.length) {
    return '?' + tempArr.join('&')
  }
  return ''
}

// 获取query历史值，转换对象判空并返回
export function getPreSubmitData (except) {
  const queryData = urlToObj(location.href)
  Object.keys(queryData).forEach(item => {
    if (except.indexOf(item) >= 0 || (queryData[item] !== 0 && queryData[item] === '')) {
      delete queryData[item]
    }
  })
  return queryData
}

// url中query的部分转obj
export function urlToObj (url) {
  if (url === null || url.indexOf('?') < 0) return {}
  const query = location.href.split('?')[1]
  const tempObj = {}
  query.split('&').forEach(function (item) {
    const key = item.split('=')[0]
    const value = Uri.decode(item.split('=')[1])
    if (!isNaN(Number(value))) {
      tempObj[key] = Number(value)
    } else {
      tempObj[key] = value
    }
  })
  return tempObj
}

/**
 * 替换url中query值
 * @param url
 * @param query
 * @param value
 * @returns {string}
 */
export function replaceQuery (url = window.location.href, query, value) {
  const urlArr = url.split('?')
  if (urlArr.length > 1 && urlArr[1].indexOf(query) > -1) {
    const _search = urlArr[1]
    const obj = {}
    const arr = _search.split('&')
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=')
      obj[arr[i][0]] = arr[i][1]
    }
    obj[query] = encodeURI(value)
    return `${urlArr[0]}?${JSON.stringify(obj).replace(/["{}]/g, '').replace(/:/g, '=').replace(/,/g, '&')}`
  } else {
    return url || window.location.href
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}

/**
 * 将多维数组转化为一维数组
 * @param  {Array} array 多维数组
 * @return {Array}       一维数组
 */
export function flatten (array) {
  return [].concat(...array.map(item => Array.isArray(item) ? flatten(item) : item))
}

/**
 * 保留固定位数的数字
 * @param value 数字值
 * @param len   保留位数
 * @returns {string} 返回处理数字的string
 */
export function roundNum (value, len = 0) {
  const val = Math.round(value * Math.pow(10, len)) / Math.pow(10, len)
  const [onesVal, pointsVal = ''] = String(val).split('.')
  return len ? `${onesVal}.${pointsVal.padEnd(len, '0')}` : String(onesVal)
}

// 价格处理
export function priceHandle (price) {
  if (!price) {
    return 0
  }
  const priceString = String(price.toFixed(2))
  const [pre, sub] = priceString.split('.')
  if (Number(sub) === 0) {
    return pre
  }
  if (Number(sub.substr(1, 1)) === 0) {
    return pre + '.' + sub.substr(0, 1)
  }
  return priceString
}

/**
 * h5多页面之间相互跳转
 * @param path        跳转的具体路径
 * @param query       跳转带的参数
 * @param moduleName  跳转所在多页moduleName (开发场景hash模式下可传)
 * @param jumpReplace 跳转是否replace
 */
export function diffModuleJump (path, query = '', moduleName, jumpReplace = false) {
  const host = window.location.host
  const devUrl = `//${host}/src/pages/${moduleName}/index.html#${path}`
  const prodUrl = `//${host}${path}`
  const baseUrl = import.meta.env.DEV ? devUrl : prodUrl
  const jumpUrl = baseUrl + (query ? '?' + query : '')

  if (jumpReplace) {
    location.replace(jumpUrl)
  } else {
    location.href = jumpUrl
  }
}

// 传进来10以下的字符，就返回前面带一个'0'
export function padZero (num) {
  const numTemp = Number(num)
  return numTemp < 10 ? '0' + numTemp : String(num)
}

export function clearObj (obj) {
  Object.keys(obj).forEach(key => {
    delete obj[key]
  })
}

export default {
  getQuery,
  delQuery,
  hasQuery,
  verifyInput,
  getByteLen,
  isFunction,
  isObject,
  isArray,
  isNumber,
  isLikeArray,
  Storage,
  cloneDeep,
  Cookie,
  Uri,
  isDom,
  isNodeList,
  intersect,
  union,
  replaceQuery,
  urlToObj,
  objToUrl,
  debounce,
  getPreSubmitData,
  flatten,
  roundNum,
  priceHandle,
  diffModuleJump,
  padZero,
  clearObj
}
