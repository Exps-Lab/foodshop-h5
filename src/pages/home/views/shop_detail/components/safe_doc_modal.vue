<!-- 商铺食品安全信息弹窗 -->

<template>
  <van-popup
    round
    closeable
    position="bottom"
    class="info-modal"
    v-model:show="show"
    :style="{ minHeight: '60%' }">
    <!--  modal内容  -->
    <section class="modal-title font-bold-weight">
      <span class="align-left">商家从业资质</span>
    </section>
    <div class="modal-content" v-if="hasSafeDoc">
      <img class="shop-image" :src="props.shopImage.business_licence" alt="businessLicence" />
      <img class="shop-image" :src="props.shopImage.food_licence" alt="foodLicence" />
    </div>
    <van-empty v-else description="商家暂时还没上传证照" />
  </van-popup>
</template>

<script setup>
import { ref, computed } from 'vue'

const show = ref(false)
const props = defineProps({
  shopImage: {
    type: Object,
    default: () => {}
  }
})

const hasSafeDoc = computed(() => {
  const { business_licence = '', food_licence = '' } = props.shopImage
  return Boolean(business_licence || food_licence)
})

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
      font-size: 20px;
      line-height: 1.2;
      padding: 20px 40px 20px 20px;
    }
    .modal-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-bottom: 70px;
      .shop-image {
        width: 80%;
        min-height: 100px;
        border-radius: 6px;
        object-fit: cover;
        background-color: @fill-3;
        margin-bottom: 20px;
        border: 1px solid #ccc;
      }
    }
  }
</style>
