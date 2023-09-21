<!-- 订单卡片 -->
<template>
  <div
    class="order-card"
    @click="toOrderDetail(orderItem)"
    v-for="orderItem in cardData"
    :key="orderItem.order_num">
    <section class="card-header">
      <section class="header-left" @click.stop="toShopDetail(orderItem)">
        <img class="shop-avatar" :src="orderItem.shop.shop_image.avatar" alt="shopAvatar">
        <p class="shop-title font-bold-weight text-ellipsis">{{ orderItem.shop.name }}</p>
        <i class="arrow">›</i>
      </section>
      <p class="order-status-text font-bold-weight gray">{{ orderStatusText(orderItem.order_status) }}</p>
    </section>
    <section class="shop-discount-box">
      <van-tag
        plain
        type="danger"
        class="tag-list"
        v-for="(tag, index) in shopDiscountTagArr(orderItem.shop)"
        :key="index">{{ tag }}
      </van-tag>
    </section>
    <section class="card-sku-container">
      <section class="sku-left">
        <div class="sku-avatar-box" v-for="(goods, index) in orderItem.goods_list" :key="index">
          <img class="sku-avatar-list" :src="goods.image_path" alt="skuAvatar" />
        </div>
        <!-- [note] 只有一件商品时展示 -->
        <p class="sku-name" v-if="orderItem.goods_list.length === 1">测试sku名称</p>
      </section>
      <div class="order-price-box">
        <p class="order-price">
          <i class="money-symbol">￥</i>{{ orderItem.pay_price }}
        </p>
        <p class="order-sku-count">共{{orderItem.goods_list.length}}件</p>
      </div>
    </section>
    <section class="order-button-group">
      <van-button
        class="order-btn"
        v-for="(btn, index) in showButton(orderItem)"
        :key="index"
        :type="btn.type"
        @click.stop="btn.handler(orderItem)">
        {{ btn.text }}
      </van-button>
    </section>
  </div>
</template>

<script setup>
import { useOrderInfo } from '@pages/order/hooks/orderInfo'
import { useOrderBtns } from '@pages/order/hooks/orderBtns'
import { diffModuleJump } from '@utils'

defineProps({
  cardData: {
    type: Object,
    default: () => {}
  }
})

const { jumpOrderDetail, orderStatusTextMap } = useOrderInfo()
// 订单状态
const orderStatusText = (status) => {
  return orderStatusTextMap[status]
}
// 满减数组
const shopDiscountTagArr = ({ discount_Arr = [] }) => {
  return discount_Arr.reduce((res, now) => {
    const { discount_val, total_val } = now
    res.push(`${total_val}减${discount_val}`)
    return res
  }, [])
}

const { getStatusBtns } = useOrderBtns()
const showButton = (orderInfo) => {
  return getStatusBtns(orderInfo)
}

const toOrderDetail = (data) => {
  const { order_num } = data
  jumpOrderDetail(order_num, 'push')
}
const toShopDetail = (data) => {
  const { shop: { id } } = data
  diffModuleJump('/shopDetail', `shop_id=${id}`, 'home')
}
</script>

<style lang="less" scoped>
  .order-card {
    border-radius: 10px;
    background-color: #fff;
    padding: 10px;
    &:not(:first-child) {
      margin-top: var(--van-padding-xs);
    }
    img {
      display: block;
      max-width: 100%;
      object-fit: cover;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-left {
        display: flex;
        align-items: center;
        .shop-avatar {
          width: 26px;
          height: 26px;
          flex: 0 0 26px;
          border-radius: 6px;
          margin-right: 6px;
        }
        .shop-title {
          max-width: 245px;
          position: relative;
          font-size: 15px;
        }
        .arrow {
          display: inline-block;
          transform: translateY(-1px);
          font-size: 20px;
          color: @text-2;
          margin-left: 8px;
        }
      }
      .order-status-text {
        font-size: 13px;
        margin-left: 10px;
        flex: 0 0 50px;
        text-align: right;
        &.black {
          color: @text-5;
        }
        &.gray {
          color: @text-3;
        }
        &.green {
          color: @success-3;
        }
        &.red {
          color: @error-6;
        }
      }
    }
    .shop-discount-box {
      display: flex;
      align-items: center;
      margin: 6px 0 0 -1px;
      .tag-list {
        border-color: @error-3;
        border-radius: 4px;
        padding: 1px 4px;
        transform: scale(0.9);
      }
    }
    .card-sku-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 15px;
      .sku-left {
        flex: 1;
        display: flex;
        align-items: center;
        .sku-avatar-box {
          white-space: nowrap;
          max-width: 240px;
          overflow-x: scroll;
          font-size: 0;
          &::-webkit-scrollbar {
            display: none;
          }
          .sku-avatar-list {
            display: inline-block;
            width: 60px;
            height: 60px;
            border-radius: 6px;
            margin-right: 6px;
          }
        }
        .sku-name {
          flex: 1;
          font-size: 14px;
          color: @text-5;
          line-height: 1.2;
        }
      }
      .order-price-box {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .order-price {
          font-size: 16px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          .money-symbol {
            font-size: 12px;
          }
        }
        .order-sku-count {
          transform: scale(0.95);
          margin-top: 6px;
          color: @text-4;
        }
      }
    }
    .order-button-group {
      display: flex;
      justify-content: flex-end;
      margin-top: 25px;
      .order-btn {
        width: 80px;
        height: 25px;
        margin-right: 10px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: bold;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
