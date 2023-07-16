<!-- 购物车列表详情弹窗 -->

<template>
  <van-popup
    round
    position="bottom"
    class="info-modal"
    v-model:show="show"
    :style="{ minHeight: '30%' }">
    <!--  modal内容  -->

    <!-- 满减tooltips -->
    <DiscountToolTip :choseGoods="choseGoods" :shopBaseInfo="shopBaseInfo" />
    <section class="modal-title">
      <p class="align-left font-bold-weight">
        已选商品
        <span class="bag-fee" v-if="totalBagFee">包装费<i class="red">{{totalBagFee}}元</i></span>
      </p>
      <span class="clear-box" @click="clearChoseGoods">
        <van-icon class="clear-icon" name="delete-o" />清空
      </span>
    </section>
    <div class="modal-mes-box">
      <section class="goods-list" v-for="goods in choseGoodsList" :key="goods.id + goods.choseSpecIndex">
        <img class="goods-img" :src="goods.image_path" alt="goodsImg" />
        <div class="info-box">
          <p class="mes-title font-bold-weight text-ellipsis">{{goods.name}}</p>
          <p class="spec-detail text-ellipsis" v-if="goods.specfoods.length > 1">{{goods.specfoods[goods.choseSpecIndex].name}}</p>
          <div class="price-box">
            <div class="price">
              <p class="price-item red">
                <i class="symbol">¥</i>
                <span class="discount-price">{{getShowPrice('showPriceTotal', goods)}}</span>
              </p>
              <p class="price-item del gray" v-if="goods.is_discount">
                <i class="symbol">¥</i>
                <span class="discount-price">{{getShowPrice('originPrice', goods)}}</span>
              </p>
            </div>
            <div class=" count-box">
              <span class="count-item border font-bold-weight" @click="deleteGoods(goods)">-</span>
              <span class="count-num">{{goods.count}}</span>
              <p class="count-item bg font-bold-weight" @click="preAddGoods($event, goods)">+</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useShopDetail } from '../hooks/shopDetail'
import { getShowPrice } from '@utils/calcGoodsPrice'
import DiscountToolTip from '../components/discount_tooltip.vue'

const { handleBuyAnimate } = useShopDetail()
const show = ref(false)
const props = defineProps({
  shopBaseInfo: {
    type: Object,
    default: () => {}
  },
  choseGoods: {
    type: Object,
    default: () => {}
  },
  totalBagFee: {
    type: Number,
    default: 0
  }
})

// 数组化选择商品
const choseGoodsList = computed(() => {
  const resArr = []
  Object.values(props.choseGoods).forEach((category) => {
    category.forEach(goods => {
      resArr.push(goods)
    })
  })
  return resArr
})

// 删除所有选择
const emit = defineEmits(['clearShoppingCart'])
const clearChoseGoods = () => {
  emit('clearShoppingCart')
}

// 添加商品前 处理
const preAddGoods = (e, goods) => {
  handleBuyAnimate(e, () => {
    addGoods(goods)
  })
}
// 添加商品
const addGoods = (goods) => {
  goods.count++
}

// 删除商品
const deleteGoods = (goods) => {
  const { count, food_category_id: c_id, id, choseSpecIndex } = goods
  if (count > 1) {
    goods.count--
  } else {
    for (let i = 0; i < props.choseGoods[c_id].length; i++) {
      const goods = props.choseGoods[c_id][i]
      if (goods.id === id && goods.choseSpecIndex === choseSpecIndex) {
        props.choseGoods[c_id].splice(i, 1)
        // [note] 删除完当前分类的最后一个时，也要删除当前分类
        if (!props.choseGoods[c_id].length) {
          delete props.choseGoods[c_id]
        }
        // 删除完modal最后一个隐藏modal
        if (!choseGoodsList.value.length) {
          hideModal()
        }
        break
      }
    }
  }
}

// 控制modal显隐
const showModal = () => {
  show.value = true
}
// 控制modal显隐
const hideModal = () => {
  show.value = false
}
defineExpose({
  show,
  showModal,
  hideModal
})
</script>

<style lang="less" scoped>
  .red {
    color: @error-6;
  }
  .info-modal {
    .modal-title {
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .align-left {
        font-size: 14px;
        .bag-fee {
          margin-left: 4px;
          font-size: 12px;
          color: @text-3;
        }
      }
      .clear-box {
        font-size: 12px;
        color: @text-3;
        .clear-icon {
          margin-right: 4px;
        }
      }
    }
    .modal-mes-box {
      padding: 10px 20px 70px;
      .goods-list {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .goods-img {
          display: block;
          height: 60px;
          width: 60px;
          margin-right: 10px;
          object-fit: cover;
          border-radius: 6px;
          background-color: @fill-3;
        }
        .info-box {
          min-height: 60px;
          font-size: 13px;
          width: calc(100% - 110px);
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .spec-detail {
            font-size: 12px;
            color: @text-3;
          }
          .price-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .gray {
              color: @text-3;
            }
            .price {
              .price-item {
                display: inline-block;
                vertical-align: baseline;
                .symbol {
                  font-size: 13px;
                }
                .discount-price {
                  font-size: 16px;
                }
                &.del {
                  margin-left: 4px;
                  text-decoration: line-through;
                  .symbol {
                    font-size: 12px;
                  }
                  .discount-price {
                    font-size: 12px;
                  }
                }
              }
            }
            .count-box {
              display: flex;
              align-items: center;
              .count-item {
                color: @text-1;
                font-size: 12px;
                border-radius: 4px;
                &.bg {
                  padding: 3px 5px;
                  background-color: @brand1-6;
                }
                &.border {
                  display: inline-block;
                  padding: 2px 5px;
                  color: @brand1-6;
                  border: 1px solid @brand1-6;
                }
              }
              .count-num {
                display: inline-block;
                min-width: 23px;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
</style>
