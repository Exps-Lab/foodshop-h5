<!-- 购物车列表详情弹窗 -->

<template>
  <section class="spec-tips" v-if="shopBaseInfo.has_discount">
    <section class="empty-show" v-show="!hasChoseGoods">
      <span
        class="text"
        v-for="(discount, index) in shopBaseInfo.discount_Arr"
        :key="index">
        满{{discount.total_val}}减{{discount.discount_val}}
      </span>
    </section>
    <section class="chose-goods" v-show="hasChoseGoods">
      {{getDiscountInfo(shopBaseInfo, choseGoodsOriginPrice).tipText}}
    </section>
  </section>
</template>

<script setup>
  import { computed } from 'vue'
  import { getDiscountInfo, orderTotalNeedPay } from '@utils/calcGoodsPrice'

  const props = defineProps({
    shopBaseInfo: {
      type: Object,
      default: () => {}
    },
    choseGoods: {
      type: Object,
      default: () => {}
    }
  })

  // 是否选择了商品
  const hasChoseGoods = computed(() => {
    return Boolean(Object.values(props.choseGoods).length)
  })
  // 选择商品价格总和(计算了折扣)
  const choseGoodsOriginPrice = computed(() => {
    const tempArr = Object.values(props.choseGoods).flat(2)
    return tempArr.length
      ? orderTotalNeedPay(tempArr, props.shopBaseInfo).goodsPrice
      : 0
  })
</script>

<style lang="less" scoped>
  .spec-tips {
    padding: 5px 0;
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
</style>
