<!-- 商品分类选择弹窗 -->

<template>
  <van-popup
    round
    closeable
    class="info-modal"
    v-model:show="show"
    :style="{ minHeight: '50%', width: '85%' }">
    <!--  modal内容  -->
    <p class="modal-title font-bold-weight">{{props.activeGoods.name}}</p>
    <div class="spec-container">
      <p class="chose-spec-name font-bold-weight">已选：{{choseSpecAttr.name}}</p>
      <span class="discount-price red" v-if="props.activeGoods.is_discount">{{props.activeGoods.discount_val}} 折</span>
      <section class="price-area">
        <p class="pay-price">
          <i class="symbol red font-bold-weight">¥</i>
          <span class="price red font-bold-weight">{{props.activeGoods.is_discount ? choseSpecAttr.payPrice : choseSpecAttr.price}}</span>
        </p>
        <p class="spec-price" v-if="props.activeGoods.is_discount">{{choseSpecAttr.price}}</p>
      </section>
    </div>

    <div class="modal-content">
      <p class="list-box__header spec-info">规格</p>
      <!-- 规格列表 -->
      <div class="spec-box">
        <p
          :class="['spec-list', choseSpecIndex === index && 'active']"
          v-for="(spec, index) in allSpec" :key="spec._id"
          @click="changeSpec(index)">
          {{spec.name}}
        </p>
      </div>
    </div>
    <div class="modal-footer">
      <button class="add-btn font-bold-weight" @click="addShoppingCart($event)">加入购物车</button>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, computed } from 'vue'
import { priceHandle } from '@utils'

const show = ref(false)
const props = defineProps({
  activeGoods: {
    type: Object,
    default: () => {}
  }
})

// 选中的规格
const choseSpecIndex = ref(0)
const changeSpec = (index) => {
  choseSpecIndex.value = index
}
// 所有的规格列表
const allSpec = computed(() => {
  return props.activeGoods.specfoods
})
// 选中的规格属性
const choseSpecAttr = computed(() => {
  const { name, price } = allSpec.value[choseSpecIndex.value]
  const { discount_val, is_discount } = props.activeGoods
  const payPrice = is_discount
    ? discount_val > 0 ? priceHandle(price * (discount_val / 10)) : '0'
    : priceHandle(price)
  return {
    name,
    payPrice,
    price
  }
})

// 触发父组件添加事件
const emit = defineEmits(['preAddGoods'])
const addShoppingCart = (e) => {
  emit('preAddGoods', e, {
    ...props.activeGoods,
    choseSpecIndex: choseSpecIndex.value
  })
  show.value = false
}

// 控制modal显隐
const showModal = () => {
  show.value = true
}
defineExpose({
  showModal
})
</script>

<style lang="less" scoped>
  .info-modal {
    .modal-title {
      padding: 20px 40px 0 20px;
      font-size: 17px;
      line-height: 1.2;
      text-overflow: ellipsis;
      display: -webkit-box;
      word-break: break-all;
      -webkit-line-clamp: 2;
      overflow: hidden;
      -webkit-box-orient: vertical;
    }
    .spec-container {
      padding: 20px 20px 0;
      .red {
        color: @error-6;
      }
      .chose-spec-name {
        color: @text-4;
        font-size: 13px;
      }
      .discount-price {
        display: inline-block;
        margin-top: 10px;
        border: 1px solid @error-6;
        border-radius: 4px;
        padding: 2px 8px;
        transform: scale(0.9) translateX(-3px);
      }
      .price-area {
        display: flex;
        align-items: baseline;
        margin-top: 6px;
        .pay-price {
          display: flex;
          align-items: baseline;
          .symbol {
            font-size: 16px;
          }
          .price {
            font-size: 22px;
          }
        }
        .spec-price {
          margin-left: 6px;
          color: @text-3;
          text-decoration: line-through;
        }
      }
    }
    .modal-content {
      padding: 20px;
      .spec-info {
        padding-left: 0;
        margin-top: 0;
      }
      .spec-box {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        padding-top: 20px;
        max-height: 150px;
        overflow-y: scroll;
        .spec-list {
          padding: 10px 24px;
          color: @text-5;
          border: 1px solid @line-3;
          border-radius: 6px;
          margin: 0 10px 10px 0;
          &.active {
            color: @brand1-6;
            border: 1px solid @brand1-6;
          }
        }
      }
    }
    .modal-footer {
      height: 50px;
      padding: 0 20px;
      box-sizing: border-box;
      background-color: @fill-3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .add-btn {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 14px;
        color: @fill-1;
        font-size: 13px;
        background-color: @brand1-6;
      }
    }
  }
</style>
