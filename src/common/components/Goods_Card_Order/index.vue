<!-- 订单卡片 -->
<template>
  <div class="order-card" @click="toOrderDetail">
    <section class="card-header">
      <section class="header-left">
        <img class="shop-avatar" src="http://static.foodshop.fun/GyBChipG87P8eA4.png" alt="shopAvatar">
        <p class="shop-title font-bold-weight text-ellipsis">测试title测试title</p>
        <i class="arrow">›</i>
      </section>
      <p class="order-status-text font-bold-weight gray">未支付</p>
    </section>
    <section class="shop-discount-box">
      <van-tag class="tag-list" plain type="danger">标签1</van-tag>
      <van-tag class="tag-list" plain type="danger">标签2</van-tag>
      <van-tag class="tag-list" plain type="danger">标签3</van-tag>
    </section>
    <section class="card-sku-container">
      <section class="sku-left">
        <div class="sku-avatar-box">
          <img class="sku-avatar-list" src="http://static.foodshop.fun/GyBChipG87P8eA4.png" alt="skuAvatar">
        </div>
        <!-- [note] 只有一件商品时展示 -->
        <p class="sku-name">测试sku名称</p>
      </section>
      <div class="order-price-box">
        <p class="order-price">
          <i class="money-symbol">￥</i>20.2
        </p>
        <p class="order-sku-count">共2件</p>
      </div>
    </section>
    <section class="order-button-group">
      <button class="common-btn order-btn blue">再来一单</button>
      <button class="common-btn order-btn green">去评价</button>
      <button class="common-btn order-btn normal">联系商家</button>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
// const props = defineProps({
//   goodsData: {
//     type: Object,
//     default: () => {}
//   }
// })

const toOrderDetail = (data) => {
  const { id: shop_id, pos } = data
  router.push({
    path: '/shopDetail',
    query: {
      shop_id,
      current_pos: `${pos.lat},${pos.lng}`
    }
  })
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
        width: 75px;
        height: 25px;
        background-color: #fff;
        margin-right: 10px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: bold;
        &:last-child {
          margin-right: 0;
        }
        &.normal {
          color: @text-5;
          border: 1px solid @text-2;
        }
        &.blue {
          color: @brand1-6;
          border: 1px solid @brand1-6;
        }
        &.green {
          color: #fff;
          background-color: @success-5;
          border: 1px solid @success-5;
        }
      }
    }
  }
</style>
