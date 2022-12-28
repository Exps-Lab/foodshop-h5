import { getPosByIp } from '@api/pos'

const TXKey = 'AWNBZ-OCV6D-CLP4I-PEOVK-42YGJ-EIBXD'
const AppName = 'hiUser'
const storageName = 'appPos'
let retryAccuratePos = false
let forceUpdatePos = false
const qq = window.qq

// 处理定位入口
const getPosByTX = async (options) => {
  forceUpdatePos = options?.forceUpdate || false

  // 从storage缓存取
  const posData = await handlePosStorage()
  if (posData !== null) {
    return Promise.resolve(posData)
  }
  // 调用三方服务
  const accuratePos = await getAccuratePos()
  return Promise.resolve(accuratePos)
}

// 获取精确定位
const getAccuratePos = () => {
  return new Promise((resolve, reject) => {
    const geolocation = new qq.maps.Geolocation(TXKey, AppName)
    geolocation.getLocation(async (position) => {
      await handlePosStorage('add', position)
      resolve(position)
    }, function () {
      console.log('尝试ip定位')
      getPosByTXIP()
        .then(async data => {
          await handlePosStorage('add', data)
          resolve(data)
        })
        .catch(errData => {
          reject(errData)
        })
    }, {
      // 精确定位接口超时时间
      timeout: 3 * 1000
    })
  })
}

// 获取ip模糊定位(降级方案)
const getPosByTXIP = () => {
  return new Promise((resolve, reject) => {
    getPosByIp()
      .then(res => {
        const { ad_info, location: { lat, lng } } = res.data.result
        resolve({
          ...ad_info,
          lat,
          lng,
          addr: '' // 跟精确定位的关键字段保持一致
        })
      })
      .catch(err => {
        console.log(err)
        return null
      })
  })
}

// 处理storage存储
const handlePosStorage = (type = 'check', data) => {
  return Promise.resolve().then(async () => {
    switch (type) {
      case 'add': {
        localStorage.setItem(storageName, JSON.stringify(data))
        break
      }
      case 'check': {
        const historyPos = localStorage.getItem('appPos')
        if (historyPos) {
          const objectPos = JSON.parse(historyPos)
          const { addr = '' } = objectPos
          if (!forceUpdatePos && (addr || retryAccuratePos)) {
            return objectPos
          } else {
            // 没有具体街道信息，重试一次
            retryAccuratePos = true
            let tempPos = {}
            await getAccuratePos().then(data => {
              tempPos = data
            })
            return tempPos.addr ? tempPos : objectPos
          }
        } else {
          return null
        }
      }
      default: {
        return null
      }
    }
  })
}

export {
  getPosByTX,
  getPosByTXIP
}
