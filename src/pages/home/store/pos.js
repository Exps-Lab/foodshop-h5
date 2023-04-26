// 获取定位中经纬度信息

import { defineStore } from 'pinia'
import { getPosByTX } from '@utils/getAccuratePos'

export const posStore = defineStore('posStore', {
  state: () => {
    return {
      posData: {},
      positioning: false
    }
  },
  getters: {
    firstPosStr (state) {
      const { lat, lng } = state.posData
      return `${lat},${lng}`
    }
  },
  actions: {
    async getPosByTXReq (option = {}) {
      this.positioning = true
      try {
        this.posData = await getPosByTX(option)
        return this.posData
      } catch {
        return {}
      } finally {
        this.positioning = false
      }
    }
  }
})
