<!-- 确认订单页 -->

<template>
  <div class="main-content">
    <ChoseAddress ref="addressRef" :shopPos="shopData.pos" :shoppingBagId="shoppingBagId"/>
    <GoodsCard :shopData="shopData" :choseGoodsData="choseGoodsData" :price="getPayPrice" :shopDiscount="shopDiscount"/>
    <ChosePayChannel />
    <OrderExtra :submitForm="submitForm" />
    <van-submit-bar
      class="submit-btn"
      :price="getPayPrice.payPrice * 100"
      button-text="提交订单"
      button-color="#02B6FD"
      @submit="submitOrder">
        <section class="info-text">
          已优惠<span class="red font-bold-weight">￥{{shopDiscount}}</span>
        </section>
    </van-submit-bar>
  </div>
</template>

<script setup>
  import { Toast, Dialog } from 'vant'
  import { ref, reactive, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { getConfirmDetail, createOrder } from '@/api/order'
  import { diffModuleJump } from '@utils'
  import { orderTotalNeedPay, getDiscountInfo } from '@utils/calcGoodsPrice'
  import { ORDERCONFIRMTEMPDATA } from '@utils/sessionStorage_keys'
  import ChoseAddress from './components/Chose_Address.vue'
  import ChosePayChannel from './components/Chose_Pay_Channel.vue'
  import GoodsCard from './components/Goods_Card.vue'
  import OrderExtra from './components/Order_Extra.vue'

  const route = useRoute()

  // 获取确认订单页详情
  const shopData = reactive({})
  const choseGoodsData = reactive([])
  // 获取当前商品计算价格
  const getPayPrice = computed(() => {
    return orderTotalNeedPay(choseGoodsData, shopData)
  })
  // 店铺满减费用
  const shopDiscount = computed(() => {
    return getDiscountInfo(shopData, getPayPrice.value.goodsPrice).price
  })

  // 处理表单相关
  const submitForm = reactive({
    orderRemarks: '',
    orderWare: true
  })
  const addressRef = ref(null)
  const submitOrder = async () => {
    const { id: addressId } = addressRef.value.choseAddress
    const form = {
      addressId,
      ...submitForm,
      shoppingBagId: shoppingBagId.value
    }
    try {
      const data = await createOrder(form)
      console.log(data.order_num)
      Toast.success('订单创建成功')
    } catch (err) {
      handleErr(err)
    }
  }

  // 初始化数据
  const shoppingBagId = ref('')
  const getShoppingBagId = () => {
    const { tempShoppingBagId } = JSON.parse(sessionStorage.getItem(ORDERCONFIRMTEMPDATA) || '{}')
    shoppingBagId.value = route.query.shoppingBagId || tempShoppingBagId
  }
  const preGetConfirmDetail = async () => {
    try {
      const { data: { shopInfo, choseGoods } } = await getConfirmDetail({
        shoppingBagId: shoppingBagId.value
      })

      shopInfo.pos = `${shopInfo.pos.lat}, ${shopInfo.pos.lng}`
      Object.assign(shopData, shopInfo)
      Object.assign(choseGoodsData, choseGoods)
    } catch (err) {
      handleErr(err)
    }
  }
  // 统一处理err
  const handleErr = (err) => {
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
      .info-text {
        .red {
          color: @error-6;
        }
      }
    }
  }
</style>
