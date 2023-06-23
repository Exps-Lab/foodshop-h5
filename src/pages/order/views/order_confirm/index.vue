<!-- 确认订单页 -->

<template>
  <div class="main-content">
    <ChoseAddress ref="addressRef" :shopPos="shopData.pos" :shoppingBagId="shoppingBagId" />
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
  <PayOrderModal ref="PayOrderModalRef" :orderInfo="orderInfo" />
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { getConfirmDetail, createOrder } from '@/api/order'
  import { useOrderInfo } from '@pages/order/hooks/orderInfo'
  import { orderTotalNeedPay, getDiscountInfo } from '@utils/calcGoodsPrice'
  import { ORDERCONFIRMTEMPDATA } from '@utils/sessionStorage_keys'
  import PayOrderModal from '@components/Pay_Order_Modal/index.vue'
  import ChosePayChannel from '@components/Chose_Pay_Channel/index.vue'
  import ChoseAddress from './components/Chose_Address.vue'
  import GoodsCard from './components/Goods_Card.vue'
  import OrderExtra from './components/Order_Extra.vue'

  const route = useRoute()
  const { handleErr } = useOrderInfo()

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
  const orderInfo = ref({})
  const PayOrderModalRef = ref(null)
  const submitOrder = async () => {
    const { choseAddress: { id: addressId }, sendCostTime } = addressRef.value
    const form = {
      addressId,
      sendCostTime,
      ...submitForm,
      shoppingBagId: shoppingBagId.value
    }
    try {
      const { data } = await createOrder(form)
      orderInfo.value = data
      // [note] 创建订单成功拉起支付弹窗
      PayOrderModalRef.value.showModal()
    } catch (err) {
      handleErr(err)
    }
  }

  // 初始化数据
  const shoppingBagId = ref('')
  // 统一获取缓存数据
  const orderConfirmStorageData = () => {
    const tempData = sessionStorage.getItem(ORDERCONFIRMTEMPDATA)
    return tempData !== null ? JSON.parse(tempData) : null
  }
  // [note] 是否使用缓存数据
  const isUseStorageData = computed(() => {
    const orderConfTemp = orderConfirmStorageData()
    if (orderConfTemp === null) {
      return false
    }
    const { tempShoppingBagId } = orderConfTemp
    const queryBagId = route.query.shoppingBagId
    return (queryBagId === undefined || queryBagId === tempShoppingBagId)
  })
  const getStorageData = () => {
    const queryBagId = route.query.shoppingBagId
    const orderConfTemp = orderConfirmStorageData()
    if (orderConfTemp !== null) {
      const { tempShoppingBagId, orderWare, orderRemarks } = orderConfTemp
      shoppingBagId.value = queryBagId || tempShoppingBagId

      // [note] 确认是否使用缓存数据
      if (isUseStorageData.value) {
        submitForm.orderWare = orderWare
        submitForm.orderRemarks = orderRemarks
      }
    } else {
      shoppingBagId.value = queryBagId
    }
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
  const init = () => {
    getStorageData()
    preGetConfirmDetail()
  }
  init()

  // 离开页面记录表单
  window.onbeforeunload = () => {
    const orderConfTemp = orderConfirmStorageData()
    // [note] 添加缓存数据：购物袋id，订单备注，订单是否需要餐具
    const saveDataMap = {
      ...submitForm,
      tempShoppingBagId: shoppingBagId.value
    }
    if (orderConfTemp !== null) {
      Object.keys(saveDataMap).forEach(key => {
        orderConfTemp[key] = saveDataMap[key]
      })
      sessionStorage.setItem(ORDERCONFIRMTEMPDATA, JSON.stringify(orderConfTemp))
    } else {
      sessionStorage.setItem(ORDERCONFIRMTEMPDATA, JSON.stringify(saveDataMap))
    }
  }
</script>

<style lang="less" scoped>
  .main-content {
    min-height: 100vh;
    padding: 15px 15px 60px;
    background-color: rgb(245, 245, 246);
    :deep(.submit-btn) {
      max-width: 750px;
      left: 50%;
      transform: translateX(-50%);
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
