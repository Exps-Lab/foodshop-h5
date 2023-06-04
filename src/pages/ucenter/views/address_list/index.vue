<template>
  <section class="main address-box" v-if="addressList.length">
    <template v-for="address in addressList" :key="address.id">
      <AddressMesBlock :address="address" @addressClick="choseAddress">
        <template #iconBtn>
          <van-icon name="edit" @click.stop="toAddressDetail(address.id)" />
        </template>
      </AddressMesBlock>
    </template>
  </section>

  <van-empty description="暂无地址" v-else />
  <!--  添加地址  -->
  <van-icon class="add-address" name="add" @click="toAddressDetail('')" />
</template>

<script setup>
  import { Toast } from 'vant'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { diffModuleJump } from '@utils'
  import { getAddressList } from '@api/user/address'
  import Loading from '@common/components/Loading'
  import { ORDERCONFIRMTEMPDATA } from '@utils/sessionStorage_keys'
  import AddressMesBlock from '@common/components/Address_Mes_Block/index.vue'

  const router = useRouter()
  const addressList = ref([])
  // 跳转地址详情页
  const toAddressDetail = (addressId) => {
    // 区分新增还是更新(是否传id)
    const query = addressId ? { addressId } : {}
    router.push({
      path: '/ucenter/address_detail',
      query
    })
  }

  // [note] 选择当前地址，目前业务来源有"确认订单页"
  const choseAddress = (address) => {
    const tempData = JSON.parse(sessionStorage.getItem(ORDERCONFIRMTEMPDATA) || '{}')
    if (tempData.changingAddress) {
      tempData.address = address
      sessionStorage.setItem(ORDERCONFIRMTEMPDATA, JSON.stringify(tempData))
      diffModuleJump('/order/orderConfirm', '', 'order')
    }
  }

  // 获取地址列表
  const preGetAddressList = async () => {
    Loading.show()
    try {
      const { data } = await getAddressList()
      addressList.value = addressList.value.concat(data)
    } catch (err) {
      Toast.fail(err)
    } finally {
      Loading.hide()
    }
  }
  preGetAddressList()
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
  }
  .van-empty {
    height: 100vh;
  }
  .add-address {
    position: fixed;
    right: 6px;
    bottom: 25%;
    color: @brand1-6;
    font-size: 54px;
  }
</style>
