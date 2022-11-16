<!-- 处理店铺菜单展示 -->

<template>
  <div class="menu-container" v-if="menuData.length">
    <!--  菜单分类列表  -->
    <van-sidebar class="sidebar-box" v-model="activeIndex" @change="activeChange">
      <section class="menu-list" v-for="(menu, index) in menuData" :key="index">
        <van-sidebar-item :title="menu.name" />
      </section>
    </van-sidebar>

    <!--  对应当前选中分类里的商品列表  -->
    <div class="food-container">
      <section class="category-info">
        <p class="category font-bold-weight">{{activeCategoryData.name}}</p>
        <p class="category-desc">{{activeCategoryData.description}}</p>
      </section>
      <section class="food-box">
        <div class="food-list" v-for="food in activeCategoryData.foods" :key="food.id">
          <div class="icon-box">
            <img class="food-img" :src="food.image_path" alt="imgUrl" />
            <i class="icon hot font-bold-weight" v-if="food.attrs.includes('is_hot')">招牌</i>
            <i class="icon new font-bold-weight" v-if="food.attrs.includes('is_new')">新品</i>
          </div>
          <div class="food-detail-info">
            <div class="main-info">
              <p class="food-title font-bold-weight">{{food.name}}</p>
              <div class="food-desc">
                <p class="measure" v-if="food.measure">{{food.measure}}</p>
                <p class="desc text-ellipsis">{{food.description}}</p>
              </div>
            </div>
            <section class="price-buy">
              <div class="price-box" v-if="getShowPrice('showPrice', food) !== '0'">
                <!--  当前商品选中之后才显示  -->
                <div class="price">
                  <p class="price-item red">
                    <i class="symbol">￥</i>
                    <span class="discount-price">{{getShowPrice('showPrice', food)}}</span>
                  </p>
                  <p class="price-item del gray" v-if="food.is_discount">
                    <i class="symbol">￥</i>
                    <span class="discount-price">{{getShowPrice('originPrice', food)}}</span>
                  </p>
                </div>
                <p class="discount-val red" v-if="food.is_discount">
                  <van-icon class="icon" name="discount" />
                  {{food.discount_val}}折
                </p>
              </div>
              <p class="price-free red" v-else>免费</p>
              <div class="count-box">
                <!-- 选择反馈 -->
                <div>
                  <span class="count-item border">-</span>
                  <span class="count-num">11</span>
                </div>
                <p class="count-item bg">{{food.specfoods.length === 1 ? '+' : '选规格'}}</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  </div>
  <van-empty description="暂无菜单" v-else />
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { getShopGoods } from '@api/shop'
  import { roundNum } from '@utils'

  const props = defineProps({
    shopId: {
      type: String,
      default: ''
    }
  })

  // 菜单数据
  const menuData = reactive([])
  const getMenuData = async () => {
    const { data } = await getShopGoods({ shop_id: props.shopId })
    Object.assign(menuData, data)
  }
  getMenuData()

  // 选中菜单
  const activeIndex = ref(0)
  const activeCategoryData = computed(() => {
    return menuData[activeIndex.value] || {}
  })
  // 左侧菜单change
  const activeChange = () => {
  }
  // 处理商品卡片的价格展示
  const getShowPrice = (type, food) => {
    const { discount_val, is_discount, specfoods: [ defaultSpec ] } = food
    const { packing_fee = 0, price } = defaultSpec
    // [todo] 待确认是否需要包装费
    const defaultSpecPrice = price + packing_fee
    // const defaultSpecPrice = price
    let resPrice = 0
    if (type === 'showPrice') {
      resPrice = is_discount
        ? discount_val > 0 ? roundNum(defaultSpecPrice * (discount_val/10), 1) : '0'
        : roundNum(defaultSpecPrice)
    } else if (type === 'originPrice') {
      resPrice = roundNum(defaultSpecPrice)
    }
    return resPrice
  }
</script>
 
<style lang="less" scoped>
  .menu-container {
    display: flex;
    height: 430px;
    .sidebar-box {
      background: @fill-3;
      flex-shrink: 0;
      .menu-list {
        :deep(.van-sidebar-item) {
          color: @text-4;
          font-size: 13px;
          background-color: @fill-3;
          &.van-sidebar-item--select {
            background-color: @fill-1;
            &::before {
              background-color: @brand1-6;
            }
          }
        }
      }
    }
    .food-container {
      padding: 10px;
      overflow-y: scroll;
      flex-grow: 1;
      box-sizing: border-box;
      max-width: calc(100% - 0.8rem);
      .category-info {
        height: 30px;
        line-height: 30px;
        display: flex;
        align-items: flex-end;
        margin-bottom: 10px;
        .category {
          font-size: 14px;
          margin-right: 5px;
        }
        .category-desc {
          font-size: 12px;
          color: @text-3;
          transform: scale(0.9);
        }
      }
      .food-box {
        .food-list {
          margin-bottom: 30px;
          display: flex;
          align-items: flex-start;
          .icon-box {
            position: relative;
            margin-right: 10px;
            .food-img {
              display: block;
              width: 95px;
              height: 95px;
              border-radius: 6px;
              object-fit: cover;
              background-color: @fill-3;
            }
            .icon {
              position: absolute;
              top: -6px;
              padding: 5px 9px;
              background-color: @brand1-6;
              color: @text-4;
              border-radius: 3px;
              font-size: 12px;
              transform: scale(0.65);
              letter-spacing: 1px;
              &.hot {
                right: -10px;
              }
              &.new {
                left: -10px;
              }
            }
          }
          .food-detail-info {
            flex-grow: 1;
            padding-right: 10px;
            .main-info {
              min-height: 70px;
              margin-bottom: 8px;
              .food-title {
                text-overflow: ellipsis;
                display: -webkit-box;
                word-break: break-all;
                -webkit-line-clamp: 2;
                overflow: hidden;
                -webkit-box-orient: vertical;
                font-size: 16px;
                margin-bottom: 8px;
              }
              .food-desc {
                display: flex;
                align-items: center;
                .measure {
                  flex: 0 0 auto;
                  padding: 1px 4px;
                  background: @fill-3;
                  border-radius: 2px;
                  margin-right: 4px;
                }
                .desc {
                  flex: auto;
                  max-width: 140px;
                  display: inline-block;
                }
              }
            }
            .price-buy {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              .red {
                color: @error-6;
              }
              .price-free {
                font-size: 14px;
                line-height: 1.3;
              }
              .price-box {
                display: flex;
                flex-direction: column;
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
                      font-size: 17px;
                    }
                    &.del {
                      margin-left: 4px;
                      text-decoration: line-through;
                      .symbol {
                        font-size: 12px;
                      }
                      .discount-price {
                        font-size: 13px;
                      }
                    }
                  }
                }
                .discount-val {
                  margin-top: 8px;
                  font-size: 12px;
                  .icon {
                    transform: translateX(2px) scale(0.8);
                  }
                }
              }
              .count-box {
                display: flex;
                align-items: center;
                .count-item {
                  color: @text-5;
                  font-size: 12px;
                  border-radius: 4px;
                  &.bg {
                    padding: 3px 5px;
                    background-color: @brand1-6;
                  }
                  &.border {
                    display: inline-block;
                    padding: 2px 5px;
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
  }
</style>
