<!-- 订单详情 商品卡片组件 -->

<template>
  <section class="address-com-box">
    <!-- 商铺信息 -->
    <section class="shop-box">
      <img class="shop-avatar" :src="shopData.shop_image?.avatar" alt="shopImg">
      <span class="shop-title van-ellipsis">{{shopData.name}}</span>
    </section>
    <!-- 已选商品信息 -->
    <section class="goods-box">
      <section
        class="goods-list"
        v-for="(goods, index) in choseGoodsData"
        :key="index">
        <img class="goods-avatar" :src="goods.image_path" alt="goodsAvatar">
        <section class="goods-info">
          <p class="info-com goods-name font-bold-weight-4 van-multi-ellipsis--l2">{{goods.name}}</p>
          <p class="info-com goods-spec van-multi-ellipsis--l2">{{goods.specfoods[goods.choseSpecIndex].name}}</p>
          <p class="info-com goods-count">x{{goods.count}}</p>
        </section>
        <section class="com-price goods-price">
          <span class="com-symbol">￥</span>
          <span class="price">{{getShowPrice('showPriceTotal', goods)}}</span>
        </section>
      </section>
    </section>
    <van-divider dashed :hairline="false"></van-divider>
    <!-- 其他信息 -->
    <section class="ext-mes-box">
      <section class="com-mes">
        <span class="mes-intro">包装费</span>
        <p class="com-price">
          <span class="com-symbol">￥</span>
          <span class="price">{{orderInfo.package_fee}}</span>
        </p>
      </section>
      <section class="com-mes">
        <span class="mes-intro">配送费</span>
        <p class="com-price">
          <span class="com-symbol">￥</span>
          <span class="price">{{shopData.delivery_fee}}</span>
        </p>
      </section>
      <section class="com-mes">
        <span class="mes-intro">
          <span class="minus font-bold-weight">减</span>
          店铺满减
        </span>
        <p class="com-price red">
          <span>‐</span>
          <span class="com-symbol">￥</span>
          <span class="price">{{orderInfo.shop_discount_price}}</span>
        </p>
      </section>
    </section>
    <van-divider dashed :hairline="false"></van-divider>
    <!-- 合计统计信息 -->
    <section class="total-box">
      <section class="discount-price-box">
        总优惠
        <p class="com-price red">
          <span class="com-symbol">￥</span>
          <span class="price">{{orderInfo.discount_total_price}}</span>
        </p>
      </section>
      <section class="pay-price-box">
        实付款
        <p class="com-price">
          <span class="com-symbol">￥</span>
          <span class="price big-size font-bold-weight">{{orderInfo.pay_price}}</span>
        </p>
      </section>
    </section>
    <van-divider dashed :hairline="false"></van-divider>
    <!-- 订单详情信息 -->
    <section class="ext-mes-box">
      <section class="com-mes order-mes" v-for="(item, index) in orderShowInfo" :key="index">
        <span class="mes-intro font-bold-weight">{{item.title}}</span>
        <p class="com-price">{{item.value}}</p>
      </section>
    </section>
  </section>
</template>

<script setup>
  import { computed } from 'vue'
  import { formatTime } from '@utils'
  import { getShowPrice } from '@utils/calcGoodsPrice'
  import { useOrderInfo } from '@pages/order/hooks/orderInfo'

  const { calcSendTime } = useOrderInfo()
  const props = defineProps({
    orderInfo: {
      type: Object,
      default: () => {}
    }
  })

  const choseGoodsData = computed(() => props.orderInfo.goods_list || [])
  const shopData = computed(() => props.orderInfo.shopDetail || {})
  const addressDetail = computed(() => props.orderInfo.addressDetail || {})
  // 展示送达时间
  const showSendTimeText = computed(() => {
    const nowTime = formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss')
    let { pay_time, send_cost_time, order_status } = props.orderInfo
    // [note] 未支付订单没有支付时间，用当前时间代替
    if (order_status === 0) {
      pay_time = nowTime
    }
    return calcSendTime(send_cost_time, pay_time, true)
  })
  const orderShowInfo = computed(() => {
    return [{
      title: '收获地址',
      value: `${addressDetail.value.address}${addressDetail.value.title}`
    }, {
      title: '订单备注',
      value: props.orderInfo.order_remarks || '无备注'
    }, {
      title: '订单号码',
      value: props.orderInfo.order_num
    }, {
      title: '送达时间',
      value: showSendTimeText.value
    }, {
      title: '配送方式',
      value: '线下配送'
    }, {
      title: '支付方式',
      value: props.orderInfo.pay_origin
    }, {
      title: '支付时间',
      value: props.orderInfo.pay_time || '支付后显示'
    }]
  })
</script>

<style lang="less" scoped>
  .address-com-box {
    margin-top: 10px;
    overflow: hidden;
    border-radius: 6px;
    background-color: #fff;
    padding: 12px 20px;
    img {
      object-fit: cover;
      max-width: 100%;
      display: block;
    }
    .com-price {
      display: flex;
      align-items: baseline;
      &.red {
        color: @error-6;
      }
      .com-symbol {
        font-size: 12px;
        transform: scale(0.9);
        line-height: 1;
      }
      .price {
        font-size: 14px;
        &.big-size {
          font-size: 20px;
          line-height: 0.9;
        }
      }
    }
    .shop-box {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .shop-avatar {
        font-size: 14px;
        width: 25px;
        height: 25px;
        border-radius: 4px;
      }
      .shop-title {
        margin-left: 6px;
      }
    }
    .goods-box {
      .goods-list {
        margin-bottom: 10px;
        display: flex;
        align-items: flex-start;
        &:last-child {
          margin-bottom: 0;
        }
        .goods-avatar {
          width: 50px;
          height: 50px;
          border-radius: 6px;
        }
        .goods-info {
          flex: 1;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          .info-com {
            margin-bottom: 4px;
            line-height: 1.2;
          }
          .goods-name {
            font-size: 13px;
          }
          .goods-spec {
            color: @text-3;
            font-size: 12px;
          }
          .goods-count {
            color: @text-3;
            font-size: 12px;
          }
        }
        .goods-price {
          margin-left: 10px;
        }
      }
    }
    .ext-mes-box {
      .com-mes {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 22px;
        .mes-intro {
          font-size: 12px;
          color: @text-4;
          .minus {
            display: inline-block;
            padding: 0 3px;
            line-height: 16px;
            background-color: @error-6;
            color: #fff;
            transform: scale(0.8);
            border-radius: 3px;
          }
        }
        &.order-mes {
          line-height: 15px;
          padding: 8px 0;
          .com-price {
            max-width: 60%;
          }
        }
      }
    }
    .total-box {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      .discount-price-box,
      .pay-price-box {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-left: 15px;
      }
    }
  }
</style>
