<!-- 确认订单页 -->

<template>
  <div class="main-content">
    <ChoseAddress :shopPos="shopData.pos" :shoppingBagId="shoppingBagId"/>
    <GoodsCard :shopData="shopData" :choseGoodsData="choseGoodsData" :payPrice="getPayPrice"/>
    <ChosePayChannel />

    <van-submit-bar
      class="submit-btn"
      :price="getPayPrice * 100"
      button-text="提交订单"
      button-color="#02B6FD"
      @submit="submitOrder">
      <span>已优惠￥10</span>
    </van-submit-bar>
  </div>
</template>

<script setup>
  import { Dialog } from 'vant'
  import { ref, reactive, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { diffModuleJump, orderTotalNeedPay } from '@utils'
  import { getConfirmDetail } from '@/api/order'
  import { ORDERCONFIRMTEMPDATA } from '@utils/sessionStorage_keys'
  import ChoseAddress from './components/Chose_Address.vue'
  import ChosePayChannel from './components/Chose_Pay_Channel.vue'
  import GoodsCard from './components/Goods_Card.vue'

  const route = useRoute()
  const shoppingBagId = ref('')
  const getShoppingBagId = () => {
    const { tempShoppingBagId } = JSON.parse(sessionStorage.getItem(ORDERCONFIRMTEMPDATA) || '{}')
    shoppingBagId.value = route.query.shoppingBagId || tempShoppingBagId
  }

  // 获取确认订单页详情
  const shopData = reactive({})
  const choseGoodsData = reactive([])
  // 获取当前商品总价
  const getPayPrice = computed(() => {
    return orderTotalNeedPay(choseGoodsData, shopData)
  })

  // 获取详情
  const preGetConfirmDetail = async () => {
    try {
      const { data: { shopInfo, choseGoods } } = await getConfirmDetail({
        shoppingBagId: shoppingBagId.value
      })

      shopInfo.pos = `${shopInfo.pos.lat}, ${shopInfo.pos.lng}`
      Object.assign(shopData, shopInfo)
      Object.assign(choseGoodsData, choseGoods)
    } catch (err) {
      const { code, msg } = err.data
      // 购物袋15分钟redis缓存已失效，跳转首页
      if (code === 20003) {
        Dialog.alert({
          message: msg
        }).then(() => {
          diffModuleJump('/home', '', 'home')
        })
      }
    }
  }

  const submitOrder = () => {
    console.log('订单总价' + getPayPrice.value)
  }

  const init = () => {
    getShoppingBagId()
    preGetConfirmDetail()
  }
  init()
</script>

<style lang="less" scoped>
  .main-content {
    min-height: 100vh;
    padding: 15px 15px 60px;
    background-color: rgb(245, 245, 246);
    :deep(.submit-btn) {
      .van-submit-bar__bar {
        border-top: 1px solid @line-1;
      }
      .van-submit-bar__button {
        height: 35px;
        .van-button__text {
          font-weight: bold;
        }
      }
    }
  }
</style>
