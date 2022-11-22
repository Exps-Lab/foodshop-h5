<template>
  <div class="detail-content">
    <div class="avatar-bg" :style="{ background: shopBgUrl }"></div>
    <div class="shop-container">
      <section class="shop-main-info" @click="showDetailInfo">
        <p class="shop-name text-ellipsis">{{shopBaseInfo.name}}</p>
        <img class="shop-icon" :src="shopBaseInfo.shop_image?.avatar" alt="avatar">
        <p class="extra-info">
          <span class="send-time">配送约{{shopBaseInfo.send_time}}分钟</span>
        </p>
        <p class="note-box text-ellipsis">公告：{{shopBaseInfo.intro_text}}</p>
      </section>
      <section class="shop-content-nav">
        <van-tabs
          shrink sticky border
          line-width="20px" line-height="2px" @click-tab="menuTabClick" v-model:active="activeMenuName">
          <van-tab title="点餐" name="order">
            <ShopMenu :shopId="shop_id" :choseGoods="choseGoods" />
          </van-tab>
          <van-tab title="商家" name="store">
            <StoreInfo :shopInfo="shopBaseInfo" />
          </van-tab>
        </van-tabs>
      </section>
    </div>

    <!-- 购物车 -->
    <section class="shopping-bag-area">
      <p class="spec-tips" v-show="!shoppingListModal?.show"><span class="text">满30减10</span></p>
      <div class="shopping-bag">
        <section class="bag-left" @click="showShoppingCartModal">
          <van-badge :content="totalChoseCount">
            <p class="icon-box">
              <van-icon :class="['icon', totalNeedPay > 0 && 'active']" :name="totalNeedPay > 0 ? 'cart' : 'cart-o'" />
            </p>
          </van-badge>
          <section class="price-info">
            <p class="pay-price">
              <i class="symbol font-bold-weight">¥</i>
              <span class="discount-price font-bold-weight">{{totalNeedPay}}</span>
            </p>
            <p class="delivery-fee">{{deliveryFee}}</p>
          </section>
        </section>
        <button :class="['bag-right', 'pay-btn', 'font-bold-weight', canDeliver && 'active']">{{deliverText}}</button>
      </div>
    </section>

    <!-- 购物车列表详情 -->
    <ShoppingCartModal ref="shoppingListModal" :choseGoods="choseGoods" :totalBagFee="totalBagFee" @clearShoppingCart="clearShoppingCart" />

    <!--  商铺基本信息弹窗  -->
    <InfoDetailModal ref="infoModal" :shopInfo="shopBaseInfo" />
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import InfoDetailModal from './components/info_detail_modal.vue'
  import ShoppingCartModal from './components/shopping_bag_modal.vue'
  import StoreInfo from './components/store_info.vue'
  import ShopMenu from './components/menu_info.vue'
  import { getShopDetail, searchShopGoods } from '@api/shop'
  import { priceHandle } from '@utils'

  const router = useRouter()
  const route = useRoute()
  const brandMain = 'rgb(2, 182, 253)'
  const { shop_id, current_pos } = route.query

  /* 商铺详情部分 */
  const { lat, lng } = JSON.parse(localStorage.getItem('appPos') || '{}')
  const shopBaseInfo = reactive({})
  const getShopInfo = async () => {
    const { data } = await getShopDetail({ shop_id, current_pos: `${lat},${lng}` })
    Object.assign(shopBaseInfo, data)
  }
  // 商铺顶部背景
  const shopBgUrl = computed(() => {
    const avatar = shopBaseInfo.shop_image?.avatar || ''
    return `linear-gradient(rgba(34, 36, 38, 0.5), rgba(34, 36, 38, 0.5)), ${avatar} center top / cover`
  })
  getShopInfo()

  /* 控制店铺详情modal */
  const infoModal = ref()
  const showDetailInfo = () => {
    infoModal.value.showModal()
  }
  // 展示购物车列表
  const shoppingListModal = ref()
  const showShoppingCartModal = () => {
    if (Object.keys(choseGoods).length) {
      shoppingListModal.value.showModal()
    }
  }
  // 删除购物车列表
  const clearShoppingCart = () => {
    Object.keys(choseGoods).forEach(key => {
      delete choseGoods[key]
    })
    shoppingListModal.value.hideModal()
  }

  /* 控制菜单切换 */
  const activeMenuName = ref('menu')
  const menuTabClick = ({ title, name }) => {
    console.log(name)
  }

  /* 用户选择商品和计算金额部分 */
  let choseGoods = reactive({})
  // 选择的商品总数
  const totalChoseCount = computed(() => {
    let count = Object.values(choseGoods).reduce((totalCount, category) => {
      totalCount += category.reduce((categoryCount, goods) => {
        categoryCount += goods.count
        return categoryCount
      }, 0)
      return totalCount
    }, 0)
    return count > 0 ? count : undefined
  })
  // 配送费
  const deliveryFee = computed(() => {
    const delivery = shopBaseInfo.delivery_fee || 0
    return delivery > 0 ? `另需配送费约¥${delivery}` : '免配送费'
  })
  // 所有选择商品包装费用
  const totalBagFee = computed(() => {
    return Object.values(choseGoods).reduce((totalFee, category) => {
      totalFee += category.reduce((total, goods) => {
        const { specfoods, choseSpecIndex } = goods
        total += specfoods[choseSpecIndex].packing_fee
        return total
      }, 0)
      return totalFee
    }, 0)
  })
  // 本次共选择需要支付金额
  const totalNeedPay = computed(() => {
    let price = Object.values(choseGoods).reduce((totalPrice, category) => {
      totalPrice += category.reduce((categoryPrice, goods) => {
        const { specfoods, choseSpecIndex, count, is_discount, discount_val } = goods
        const { price } = specfoods[choseSpecIndex]
        categoryPrice += is_discount
          ? price * count * (discount_val / 10)
          : price * count
        return categoryPrice
      }, 0)
      return totalPrice
    }, 0)
    return priceHandle(price + totalBagFee.value)
  })
  // 是否达到最低配送价格
  const canDeliver = computed(() => {
    return totalNeedPay.value >= shopBaseInfo.mini_delivery_price
  })
  // 结算按钮文案
  const deliverText = computed(() => {
    const { mini_delivery_price = 0 } = shopBaseInfo
    const nowPrice = totalNeedPay.value
    if (nowPrice=== 0) {
      return `¥${mini_delivery_price}起送`
    }
    return canDeliver.value
      ? '去结算'
      : `差¥${priceHandle(mini_delivery_price - nowPrice)}起送`
  })
</script>
 
<style lang="less" scoped>
  .detail-content {
    min-height: 100vh;
    .avatar-bg {
      height: 112px;
      position: relative;
    }
    .shop-container {
      position: relative;
      background-color: #fff;
      margin-top: -30px;
      border-radius: 12px 12px 0 0;
      padding-bottom: 70px;
      .shop-main-info {
        padding: 14px 16px;
        position: relative;
        .shop-name {
          font-size: 21px;
          font-weight: bold;
          max-width: 250px;
        }
        .shop-icon {
          position: absolute;
          top: -10px;
          right: 20px;
          width: 65px;
          height: 65px;
          object-fit: cover;
          border-radius: 10px;
          background-color: @fill-4;
        }
        .extra-info {
          margin-top: 8px;
          .send-time {
            color: @text-3;
          }
        }
        .note-box {
          margin-top: 20px;
          color: @text-4;
          font-weight: 500;
        }
      }
      .shop-content-nav {
        margin-top: 10px;
        :deep(.van-tabs) {
          .van-tab--shrink {
            margin-right: 25px;
            .van-tab__text {
              font-size: 16px;
            }
          }
          .van-tab--active {
            .van-tab__text {
              font-weight: bold;
            }
          }
          .van-tabs__line {
            background-color: @brand1-6;
          }
        }
      }
    }
    .shopping-bag-area {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 2010;
      width: 100%;
      background-color: @fill-1;
      .spec-tips {
        padding: 3px 0;
        text-align: center;
        background-color: @yellow-1;
        color: @error-6;
        border-bottom: 1px solid @line-0;
        .text {
          display: inline-block;
          font-size: 12px;
          transform: scale(0.9);
        }
      }
      .shopping-bag {
        min-height: 40px;
        padding: 5px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .bag-left {
          display: flex;
          align-items: center;
          .icon-box {
            .icon {
              font-size: 30px;
              padding: 6px;
              border-radius: 10px;
              background-color: @fill-4;
              transition: all 0.1s linear;
              &.active {
                background-color: rgba(2, 182, 253, 0.4);
              }
            }
          }
          .price-info {
            margin-left: 10px;
            .pay-price {
              display: flex;
              align-items: flex-end;
              .symbol {
                font-size: 12px;
              }
              .discount-price {
                font-size: 16px;
              }
            }
            .delivery-fee {
              margin-top: 5px;
              color: @text-3;
              font-size: 12px;
              transform: scale(0.9) translateX(-2px);
            }
          }
        }
        .pay-btn {
          min-width: 100px;
          height: 35px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
          color: @fill-1;
          font-size: 14px;
          background-color: @fill-9;
          transition: all 0.1s linear;
          &.active {
            background-color: @brand1-6;
          }
        }
      }
    }
  }
</style>
