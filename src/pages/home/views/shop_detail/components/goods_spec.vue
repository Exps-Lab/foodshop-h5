<!-- 商品分类选择弹窗 -->

<template>
  <van-popup
    round
    closeable
    class="info-modal"
    v-model:show="show"
    :style="{ minHeight: '50%', width: '85%' }">
    <!--  modal内容  -->
    <section class="modal-main">
      <p class="modal-title font-bold-weight">{{props.activeGoods.name}}</p>
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
        <p class="spec-price"></p>
        <button>加入购物车</button>
      </div>
    </section>
  </van-popup>
</template>

<script setup>
  import { ref, computed } from 'vue'

  const show = ref(false)
  const props = defineProps({
    activeGoods: {
      type: Object,
      default: () => {}
    }
  })
  const allSpec = computed(() => {
    return props.activeGoods.specfoods
  })

  // 选中的规格
  let choseSpecIndex = ref(0)
  const changeSpec = (index) => {
    choseSpecIndex.value = index
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
  .modal-main {
    padding: 20px 40px 20px 20px;
    .modal-title {
      font-size: 18px;
      line-height: 1.2;
      text-overflow: ellipsis;
      display: -webkit-box;
      word-break: break-all;
      -webkit-line-clamp: 2;
      overflow: hidden;
      -webkit-box-orient: vertical;
    }
    .modal-content {
      margin-top: 30px;
      .spec-info {
        padding-left: 0;
      }
      .spec-box {
        display: flex;
        align-items: center;
        padding-top: 20px;
        .spec-list {
          padding: 10px 24px;
          color: @text-5;
          border: 1px solid @line-3;
          border-radius: 6px;
          margin-right: 10px;
          &.active {
            color: @brand1-6;
            border: 1px solid @brand1-6;
          }
        }
      }
    }
  }
</style>
