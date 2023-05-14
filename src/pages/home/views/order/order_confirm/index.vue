<template>
  <div class="main-content">
    <section class="address-time-box">
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
  </div>
</template>

<script setup>
  import { ref, reactive, computed, watch } from 'vue'
  import { diffModuleJump, padZero } from '@utils'
  import { getPosCostTime } from '@/api/home'
  import { ADDRESSCHOSEPOS } from '@utils/sessionStorage_keys'
  import AddressMesBlock from '@common/components/Address_Mes_Block/index.vue'

  const choseAddress = reactive({})
  // [note] 跳转选择地址
  const jumpChoseAddress = () => {
    diffModuleJump('/ucenter/address_list', '', 'ucenter')
  }
  // 获取sessionStorage里用户选择的地址
  const setChoseAddress = () => {
    const storageData = JSON.parse(sessionStorage.getItem(ADDRESSCHOSEPOS)) || null
    if (storageData) {
      Object.assign(choseAddress, storageData)
      // [note] 只用来传递跨页数据，接到后删除不做后续功能支持
      sessionStorage.removeItem(ADDRESSCHOSEPOS)
    }
  }

  const sendTime = ref('')
  const showSendTimeText = computed(() => {
    return sendTime.value
      ? `预计${sendTime.value}送达`
      : '计算中...'
  })
  // 计算送达时间
  const getSendTime = async (nowPos) => {
    const { data: timeRes } = await getPosCostTime({
      startPos: nowPos,
      endPosArr: [{ lat: 39.908789, lng: 116.495676 }]
    })
    const targetTime = new Date(Date.now() + timeRes[0] * 60 * 1000)
    return `${padZero(targetTime.getHours())}:${padZero(targetTime.getMinutes())}`
  }
  watch(
    () => choseAddress.pos,
    async (now) => {
      // [note] 选择地址更改之后重新计算送达时
      sendTime.value = await getSendTime(now)
    }
  )

  const init = () => {
    setChoseAddress()
  }
  init()
</script>

<style lang="less" scoped>
  .main-content {
    min-height: 100vh;
    padding: 15px;
    background-color: rgb(245, 245, 246);
    .address-time-box {
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
  }
</style>
