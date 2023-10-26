<!-- 商铺基本信息弹窗 -->

<template>
  <van-popup
    round
    closeable
    position="bottom"
    class="info-modal"
    v-model:show="show"
    :style="{ minHeight: '30%' }">
    <!--  modal内容  -->
    <section class="modal-title font-bold-weight">
      <span class="align-left">{{props.shopInfo.name}}</span>
    </section>
    <div class="modal-mes-box">
      <template v-for="(item, index) in modalContentMap" :key="index">
        <section class="modal-list" v-if="item.isShow">
          <p class="mes-title font-bold-weight">{{item.title}}</p>
          <section class="mes-content">
            <p class="content-list" v-for="(content, contentIndex) in item.content" :key="contentIndex">
              <van-icon class="mes-icon" :name="content.icon" v-if="content.icon" />
              <span class="mes-text">{{content.text}}</span>
            </p>
          </section>
        </section>
      </template>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const show = ref(false)
const props = defineProps({
  shopInfo: {
    type: Object,
    default: () => {}
  }
})

// 是否展示食品安全
const showFoodSafe = computed(() => {
  const { business_licence = '', food_licence = '' } = props.showInfo?.shop_image || {}
  return business_licence && food_licence
})
// 公告内容
const noteText = computed(() => {
  return props.shopInfo.intro_text
})
// 配置modal展示内容
const modalContentMap = reactive([{
  title: '食品安全',
  content: [{
    icon: 'user-o',
    text: '亮证经营'
  }, {
    icon: 'shield-o',
    text: '食无忧保障'
  }],
  isShow: showFoodSafe
}, {
  title: '公告',
  content: [{
    text: noteText
  }],
  isShow: true
}])

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
      text-align: center;
      font-size: 20px;
      line-height: 1.2;
      padding: 20px 40px 20px 20px;
      .align-left {
        display: inline-block;
        text-align: left;
      }
    }
    .modal-mes-box {
      padding: 10px 20px 70px;
      .modal-list {
        margin-bottom: 20px;
        .mes-title {
          font-size: 14px;
          margin-bottom: 6px;
        }
        .mes-content {
          display: flex;
          align-items: center;
          .content-list {
            margin-right: 10px;
            .mes-icon {
              font-size: 12px;
              max-width: 100%;
              margin-right: 4px;
            }
            .mes-text {
              font-size: 12px;
              color: @text-3;
              line-height: 1.2;
            }
          }
        }
      }
    }
  }
</style>
