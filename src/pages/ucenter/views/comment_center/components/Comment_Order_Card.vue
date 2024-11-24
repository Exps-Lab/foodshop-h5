<!-- 评论订单卡片 -->

<template>
  <div class="order-card" @click="toOrderDetail" v-for="cardItem in cardData" :key="cardItem.id">
    <section class="card-header">
      <section class="header-left" @click="toShopDetail(cardItem)">
        <img class="shop-avatar" :src="cardItem.shop.shop_image.avatar" alt="shopAvatar">
        <p class="shop-title font-bold-weight text-ellipsis">{{cardItem.shop.name}}</p>
        <i class="arrow">›</i>
      </section>
    </section>
    <section class="card-sku-container">
      <section class="sku-left">
        <p class="sku-name">
          <span
            v-for="(skuItem, index) in cardItem.goods_list"
            :key="skuItem.id">
            {{skuItem.name}}{{index < cardItem.goods_list.length-1 && '/'}}
          </span>
        </p>
      </section>
    </section>
    <section class="order-button-group">
      <button class="common-btn order-btn green" @click="toCommentForm(cardItem)">去评价</button>
    </section>
  </div>
</template>

<script setup>
  import { diffModuleJump } from '@utils'

  defineProps({
    cardData: {
      type: Object,
      default: () => {}
    }
  })

  const toShopDetail = (cardItem) => {
    const { shop_id } = cardItem
    diffModuleJump('/shopDetail', `shop_id=${shop_id}`, 'home')
  }
  const toCommentForm = (cardItem) => {
    const { order_num } = cardItem
    diffModuleJump('/order/comment', `orderNum=${order_num}`, 'order')
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
