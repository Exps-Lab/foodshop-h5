<template>
  <div class="detail-content">
    <div class="avatar-bg" :style="{ background: shopBgUrl }"></div>
    <section class="shop-operator-box">
      <p class="op-right phone" @click="phoneShop">
        <van-icon class="icon-item" name="phone" />
      </p>
      <p class="op-right collect" @click="collectShop">
        <van-icon :class="['icon-item', isCollectShop && 'red']" :name="isCollectShop ? 'like' : 'like-o'" />
      </p>
    </section>
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
          <van-tab :title="commentTitle" name="comment">
            <CommentInfo :shopId="shop_id" />
          </van-tab>
          <van-tab title="商家" name="store">
            <StoreInfo :shopInfo="shopBaseInfo" />
          </van-tab>
        </van-tabs>
      </section>
    </div>

    <!-- 购物车 -->
    <section class="shopping-bag-area fix-elm-center">
      <!-- 满减tooltips -->
      <DiscountToolTip v-show="!shoppingListModal?.show" :choseGoods="choseGoods" :shopBaseInfo="shopBaseInfo" />
      <div class="shopping-bag">
        <section class="bag-left" @click="showShoppingCartModal">
          <van-badge :content="totalChoseCount">
            <p class="icon-box">
              <van-icon :class="['icon', totalNeedPay.goodsPrice > 0 && 'active']" :name="totalNeedPay.goodsPrice > 0 ? 'cart' : 'cart-o'" />
            </p>
          </van-badge>
          <section class="price-info">
            <p class="pay-price">
              <i class="symbol font-bold-weight">¥</i>
              <span class="discount-price font-bold-weight">{{totalNeedPay.detailPrice}}</span>
            </p>
            <p class="delivery-fee">{{deliveryFeeShow}}</p>
          </section>
        </section>
        <!--  提交结算按钮  -->
        <button :class="['bag-right', 'pay-btn', 'font-bold-weight', canDeliver && 'active']" @click="submitChose">{{deliverText}}</button>
      </div>
    </section>

    <!-- 购物车列表详情 -->
    <ShoppingCartModal
      ref="shoppingListModal"
      :choseGoods="choseGoods"
      :totalBagFee="totalBagFee"
      :shopBaseInfo="shopBaseInfo"
      @clearShoppingCart="clearShoppingCart" />

    <!--  商铺基本信息弹窗  -->
    <InfoDetailModal ref="infoModal" :shopInfo="shopBaseInfo" />
  </div>
</template>

<script setup>
import { Toast } from 'vant'
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import InfoDetailModal from './components/info_detail_modal.vue'
import ShoppingCartModal from './components/shopping_bag_modal.vue'
import DiscountToolTip from './components/discount_tooltip.vue'
import StoreInfo from './components/tab_store_info.vue'
import ShopMenu from './components/tab_menu_info.vue'
import CommentInfo from './components/tab_comment_info.vue'

// searchShopGoods 搜索具体商品接口
import { getShopDetail, addShoppingBag } from '@api/shop'
import { addCollect, removeCollect } from '@api/collect'
import { getOrderDetail } from '@/api/order'
import { priceHandle, diffModuleJump, clearObj } from '@utils'
import { calcTotalBagFee, orderTotalNeedPay } from '@utils/calcGoodsPrice'

const route = useRoute()
const { shop_id } = route.query

// 评论动态标题
const commentTitle = computed(() => {
  return shopBaseInfo.comment_count
    ? `评论(${shopBaseInfo.comment_count})`
    : '评论'
})

/* 商铺详情部分 */
const { lat, lng } = JSON.parse(localStorage.getItem('appPos') || '{}')
const shopBaseInfo = reactive({})
const getShopInfo = async () => {
  const { data } = await getShopDetail({ shop_id, current_pos: `${lat},${lng}` })
  Object.assign(shopBaseInfo, data)
  isCollectShop.value = shopBaseInfo.shopCollected
}
// 商铺顶部背景
const shopBgUrl = computed(() => {
  const avatar = shopBaseInfo.shop_image?.avatar || ''
  return `linear-gradient(rgba(34, 36, 38, 0.5), rgba(34, 36, 38, 0.5)), url(${avatar}) center top / cover`
})

const isCollectShop = ref(false)
// 拨打商家电话
const phoneShop = () => {
  window.location.href = `tel:${shopBaseInfo.phone}`
}
// 处理收藏
const collectShop = async () => {
  try {
    const API = isCollectShop.value ? removeCollect : addCollect
    await API({ shop_id })
    await Toast(`${isCollectShop.value ? '取消收藏' : '收藏'}成功`)
    isCollectShop.value = !isCollectShop.value
  } catch (err) {
    console.log(err)
    // Toast.fail(err.data.msg)
  }
}

/* 控制店铺详情modal */
const infoModal = ref()
const showDetailInfo = () => {
  infoModal.value.showModal()
}
// 展示购物车列表
const shoppingListModal = ref()
const showShoppingCartModal = () => {
  if (hasMoreThanOneGoods.value) {
    shoppingListModal.value.show
      ? shoppingListModal.value.hideModal()
      : shoppingListModal.value.showModal()
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
  activeMenuName.value = name
}

/* 用户选择商品和计算金额部分 */
let choseGoods = reactive({})
// 选择的商品总数
const totalChoseCount = computed(() => {
  const count = Object.values(choseGoods).reduce((totalCount, category) => {
    totalCount += category.reduce((categoryCount, goods) => {
      categoryCount += goods.count
      return categoryCount
    }, 0)
    return totalCount
  }, 0)
  return count > 0 ? count : undefined
})
// 配送费
const deliveryFeeShow = computed(() => {
  const delivery = shopBaseInfo.delivery_fee || 0
  return delivery > 0 ? `另需配送费约¥${delivery}` : '免配送费'
})
// 所有选择商品包装费用
const totalBagFee = computed(() => {
  return calcTotalBagFee(Object.values(choseGoods).flat(2) || [])
})
// 本次共选择需要支付金额
const totalNeedPay = computed(() => {
  const choseGoodsArr = Object.values(choseGoods).flat(2) || []
  return orderTotalNeedPay(choseGoodsArr, shopBaseInfo)
})
// 是否达到最低配送价格
const canDeliver = computed(() => {
  return totalNeedPay.value.goodsPrice >= shopBaseInfo.mini_delivery_price
})
// 是否选择了商品
const hasMoreThanOneGoods = computed(() => {
  return Boolean(Object.keys(choseGoods).length)
})
// 结算按钮文案
const deliverText = computed(() => {
  const { mini_delivery_price = 0 } = shopBaseInfo
  const nowPrice = totalNeedPay.value.goodsPrice
  if (nowPrice === 0) {
    return `¥${mini_delivery_price}起送`
  }
  return canDeliver.value
    ? '去结算'
    : `差¥${priceHandle(mini_delivery_price - nowPrice)}起送`
})

// 提交结算
const submitChose = async () => {
  if (!hasMoreThanOneGoods.value || !canDeliver.value) {
    return false
  }
  // 选择对象转为数组
  const choseDataArr = Object.values(choseGoods).reduce((choseArr, category) => {
    category.forEach(goods => { choseArr.push(goods) })
    return choseArr
  }, [])
  const { data } = await addShoppingBag({
    shop_id,
    chose_goods_list: choseDataArr
  })
  // [note] 创建购物袋成功清空已选sku
  clearObj(choseGoods)
  diffModuleJump('/order/orderConfirm', `shoppingBagId=${data}`, 'order')
}

// 处理再来一单，从订单获取数据
const getOneMoreData = async (orderNum) => {
  try {
    const { data: { goods_list } } = await getOrderDetail({ orderNum })
    const orderChoseData = goods_list.reduce((map, item) => {
      const { food_category_id } = item
      if (map[food_category_id] === undefined) {
        map[food_category_id] = []
      }
      map[food_category_id].push(item)
      return map
    }, {})
    choseGoods = Object.assign(choseGoods, orderChoseData)
  } catch (err) {
    Toast('获取订单详情失败，请重新选择商品')
  }
}

const init = async () => {
  const { order_num } = route.query
  await getShopInfo()
  if (order_num) {
    await getOneMoreData(order_num)
  }
}
init()
</script>

<style lang="less" scoped>
  .detail-content {
    position: relative;
    min-height: 100vh;
    .avatar-bg {
      height: 112px;
      position: relative;
    }
    .shop-operator-box {
      position: absolute;
      z-index: 999;
      top: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      .op-right {
        margin-right: 15px;
        &:last-child {
          margin-right: 0;
        }
      }
      .icon-item {
        font-size: 22px;
        font-weight: bold;
        color: #fff;
        &.red {
          color: @error-6;
        }
      }
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
