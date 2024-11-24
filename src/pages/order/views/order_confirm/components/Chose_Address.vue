<!-- 选择地址组件 -->

<template>
  <section class="address-com-box">
    <AddressMesBlock :address="choseAddress" @addressClick="jumpChoseAddress">
      <template #iconBtn>
        <van-icon name="arrow" />
      </template>
    </AddressMesBlock>
    <section class="send-time font-bold-weight">
      <span class="font-bold-weight">立即送出</span>
      <span class="time font-bold-weight">{{showSendTimeText}}</span>
    </section>
  </section>
</template>

<script setup>
  import { ref, reactive, computed, watch } from 'vue'
  import { diffModuleJump, padZero } from '@utils'
  import { getPosCostTime } from '@/api/home'
  import { getRecentAddress } from '@/api/order'
  import { ORDERCONFIRMTEMPDATA } from '@utils/sessionStorage_keys'
  import AddressMesBlock from '@common/components/Address_Mes_Block/index.vue'

  const props = defineProps({
    // 商铺定位
    shopPos: {
      type: String,
      default: ''
    },
    //  购物袋id
    shoppingBagId: {
      type: String,
      default: ''
    },
    isUseStorageData: {
      type: Boolean
    }
  })

  const tempShoppingBagId = ref('')
  // 用户计算送达时间
  const choseAddress = reactive({})
  // [note] 跳转选择地址
  const jumpChoseAddress = () => {
    const tempData = {
      changingAddress: true
    }
    sessionStorage.setItem(ORDERCONFIRMTEMPDATA, JSON.stringify(tempData))
    diffModuleJump('/ucenter/address_list', '', 'ucenter')
  }
  // 获取最近的地址经纬度
  const getRecentAddressRequest = async () => {
    const appData = JSON.parse(localStorage.getItem('appPos') || '{}')
    const userNowPos = `${appData.lat},${appData.lng}`
    const { data } = await getRecentAddress({
      userNowPos
    })
    return data === null ? appData : data
  }
  // 获取用户地址
  // [note]包括首次进入最近地址 以及 切换之后的地址展示
  const setChoseAddress = async () => {
    const tempData = JSON.parse(sessionStorage.getItem(ORDERCONFIRMTEMPDATA) || '{}')
    // [note] 缓存里取地址缓存数据。只要用户主动选了地址，之后订单默认优先展示用户选择
    if (tempData.address) {
      Object.assign(choseAddress, tempData.address)

      // [note] 只用来传递跨页数据，接到后只更改状态不删除数据防止刷新页面购物袋id丢失
      tempData.changingAddress = false
      sessionStorage.setItem(ORDERCONFIRMTEMPDATA, JSON.stringify(tempData))
    } else {
      const tempAddress = await getRecentAddressRequest()
      Object.assign(choseAddress, tempAddress)
    }
  }

  // 展示文案
  const sendTime = ref('')
  const sendCostTime = ref('')
  const showSendTimeText = computed(() => {
    return sendTime.value
      ? `预计${sendTime.value}送达`
      : '计算中...'
  })
  // 计算送达时间
  const getSendTime = async (nowPos) => {
    const [shopLat, shopLng] = props.shopPos.split(',')
    const { data: timeRes } = await getPosCostTime({
      startPos: nowPos,
      endPosArr: [{ lat: shopLat, lng: shopLng }]
    })
    sendCostTime.value = timeRes[0]
    const targetTime = new Date(Date.now() + timeRes[0] * 60 * 1000)
    return `${padZero(targetTime.getHours())}:${padZero(targetTime.getMinutes())}`
  }
  watch(
    () => choseAddress.pos,
    async (now) => {
      // [note] 选择地址更改之后重新计算送达时
      if (props.shopPos) {
        sendTime.value = await getSendTime(now)
      }
    }
  )
  watch(
    () => props.shopPos,
    async (now) => {
      // [note] 初始异步获取商铺地址计算送达时
      if (choseAddress.pos) {
        sendTime.value = await getSendTime(choseAddress.pos)
      }
    }
  )
  watch(
    () => props.shoppingBagId,
    (now) => {
      tempShoppingBagId.value = now
    }, {
      immediate: true
    }
  )

  const init = () => {
    setChoseAddress()
  }
  init()

  defineExpose({
    choseAddress,
    sendCostTime
  })
</script>

<style lang="less" scoped>
  .address-com-box {
    overflow: hidden;
    border-radius: 6px;
    background-color: #fff;
    .send-time {
      padding: 12px 25px 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .time {
        font-size: 13px;
        color: @brand1-6;
      }
    }
  }
</style>
