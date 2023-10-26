<!-- 处理店铺菜单展示 -->

<template>
  <div class="menu-container" v-if="menuData.length">
    <!--  菜单分类列表  -->
    <van-sticky :offset-top="44">
      <van-sidebar class="sidebar-box" v-model="activeIndex" @change="activeChange">
        <section class="menu-list" v-for="(menu, index) in menuData" :key="index">
          <van-badge :content="getMenuCount(menu.id)">
            <van-sidebar-item :title="menu.name" />
          </van-badge>
        </section>
      </van-sidebar>
    </van-sticky>

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
                <div class="price">
                  <p class="price-item red">
                    <i class="symbol">¥</i>
                    <span class="discount-price">{{getShowPrice('showPrice', food)}}</span>
                  </p>
                  <p class="price-item del gray" v-if="food.is_discount">
                    <i class="symbol">¥</i>
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
                <!--  当前商品选中之后才显示  -->
                <div v-if="props.choseGoods[food.food_category_id]?.find(item => item.id === food.id)">
                  <span class="count-item border font-bold-weight" @click="preDeleteGoods(food)">-</span>
                  <span class="count-num">{{getGoodsCount(food)}}</span>
                </div>
                <p class="count-item bg font-bold-weight" @click="handleDiffTypeGoods($event, food)">
                  {{food.specfoods.length === 1 ? '+' : '选规格'}}
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>

    <GoodsSpec ref="goodsSpecModal" :activeGoods="activeGoods" @preAddGoods="preAddGoods"/>
  </div>
  <van-empty description="暂无菜单" v-else />
</template>

<script setup>
  import { Toast } from 'vant'
  import { ref, reactive, computed } from 'vue'
  import { getShopGoods } from '@api/shop'
  import { getShowPrice } from '@utils/calcGoodsPrice'
  import GoodsSpec from './goods_spec.vue'
  import { useShopDetail } from '../hooks/shopDetail'

  const { handleBuyAnimate } = useShopDetail()
  const props = defineProps({
    // 当前商铺id
    shopId: {
      type: String,
      default: ''
    },
    // 当前购物袋选择商品
    choseGoods: {
      type: Object,
      default: () => {}
    }
  })

  // 菜单数据
  const menuData = reactive([])
  const getMenuData = async () => {
    const { data } = await getShopGoods({ shop_id: props.shopId })
    Object.assign(menuData, data)
  }
  getMenuData()
  // 选中菜单种类
  const activeIndex = ref(0)
  const activeCategoryData = computed(() => {
    return menuData[activeIndex.value] || {}
  })
  // 左侧菜单change
  const activeChange = () => {
    window.scrollTo(0, 0)
  }
  // 获取当前 菜单分类 的点餐count
  const getMenuCount = (id) => {
    const count = props.choseGoods[id]?.reduce((count, goods) => {
      count += goods.count
      return count
    }, 0)
    return count > 0 ? count : undefined
  }

  // 获取当前 商品 的点餐count
  const getGoodsCount = (goods) => {
    const { food_category_id: c_id, id } = goods
    return props.choseGoods[c_id].reduce((count, goodsItem) => {
      // [note] 计算当前商品的 选择数
      if (goodsItem.id === id) {
        count += goodsItem.count
      }
      return count
    }, 0)
  }

  // 当前选中商品
  const activeGoods = ref({})
  const goodsSpecModal = ref()
  // 展示选择规格弹窗
  const showGoodsModal = (nowGoods) => {
    activeGoods.value = nowGoods
    goodsSpecModal.value.showModal()
  }

  // 处理不同类型添加
  const handleDiffTypeGoods = (e, food) => {
    const { specfoods } = food
    const wrapFood = createGoodsData(food)
    if (specfoods.length > 1) {
      showGoodsModal(wrapFood)
    } else {
      preAddGoods(e, wrapFood)
    }
  }
  // 删除商品前 处理
  const preDeleteGoods = (food) => {
    const { specfoods } = food
    if (specfoods.length > 1) {
      Toast('多规格商品只能去购物车删除哦')
    } else {
      deleteGoods(food)
    }
  }
  // 初始化新增商品数据
  const createGoodsData = (food) => {
    return {
      ...food,
      count: 1,
      // 选择的商品规格，默认的是 “默认规格”
      choseSpecIndex: food.choseSpecIndex || 0
    }
  }
  // 添加商品前 处理
  const preAddGoods = (e, food) => {
    handleBuyAnimate(e, () => {
      addGoods(food)
    })
  }
  // 处理商品新增
  const addGoods = (food) => {
    const { food_category_id: c_id, id, choseSpecIndex } = food
    // 初始化
    if (props.choseGoods[c_id] === undefined) {
      props.choseGoods[c_id] = []
    }
    // 更新数量
    const hasNowCategoryGoods = props.choseGoods[c_id].filter(item => item.id === id)
    if (hasNowCategoryGoods.length) {
      // 是否有相同的规格 spec
      const sameSpec = hasNowCategoryGoods.find(item => {
        return item.id === id && item.choseSpecIndex === choseSpecIndex
      })
      sameSpec !== undefined
        ? sameSpec.count++
        : props.choseGoods[c_id].push(food)
    } else {
      props.choseGoods[c_id].push(food)
    }
  }
  // 处理商品删除
  const deleteGoods = (food) => {
    const { food_category_id: c_id, id } = food
    // 更新数量
    for (let choseIndex = 0; choseIndex < props.choseGoods[c_id].length; choseIndex++) {
      const choseItem = props.choseGoods[c_id][choseIndex]
      if (choseItem.id === id) {
        if (choseItem.count > 1) {
          choseItem.count--
        } else {
          props.choseGoods[c_id].splice(choseIndex, 1)
          // [note] 删除完当前分类的最后一个时，也要删除当前分类
          if (!props.choseGoods[c_id].length) {
            delete props.choseGoods[c_id]
          }
        }
        break
      }
    }
  }
</script>

<style lang="less" scoped>
  .menu-container {
    display: flex;
    justify-content: flex-end;
    .sidebar-box {
      background: @fill-3;
      flex-shrink: 0;
      .menu-list {
        border-bottom: 1px solid #eee;
        :deep(.van-badge__wrapper) {
          width: 100%;
          .van-badge {
            transform: none;
          }
        }
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
              color: @text-1;
              border-radius: 3px;
              font-size: 12px;
              transform: scale(0.7);
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
  }
</style>
