<template>
  <div class="main-content">
    <AddressMesBlock :address="choseAddress" @addressClick="jumpChoseAddress">
      <template #iconBtn>
        <van-icon name="arrow" />
      </template>
    </AddressMesBlock>
  </div>
</template>

<script setup>
  import { reactive } from 'vue'
  import { diffModuleJump } from '@utils'
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
  }
</style>
