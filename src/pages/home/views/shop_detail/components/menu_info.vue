<!-- 处理店铺菜单展示 -->

<template>
  <div class="menu-container">
    <van-sidebar class="sidebar-box" v-model="activeIndex" @change="onChange">
      <section class="menu-list" v-for="(menu, index) in menuData" :key="index">
        <van-sidebar-item :title="menu.description" />
      </section>
    </van-sidebar>
    <div class="food-box">
      <p v-for="food in menuData[activeIndex]?.foods" :key="food.id">{{food.name}}</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { getShopGoods } from '@api/shop'

  const props = defineProps({
    shopId: {
      type: String,
      default: ''
    }
  })

  // 选中菜单
  const activeIndex = ref(0)

  // 菜单数据
  const menuData = reactive([])
  const getMenuData = async () => {
    const { data } = await getShopGoods({ shop_id: props.shopId })
    Object.assign(menuData, data)
  }
  getMenuData()
</script>
 
<style lang="less" scoped>
  .menu-container {
    display: flex;
    min-height: 430px;
    .sidebar-box {
      background: var(--van-sidebar-background-color);
      .menu-list {
        :deep(.van-sidebar-item--select) {
          &::before {
            background-color: @brand1-6;
          }
        }
      }
    }
    .food-box {
      flex-grow: 1;
    }
  }
</style>
