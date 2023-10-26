<!--
  订单其他信息组件
  <OrderExtra :submitForm="submitForm" />
-->

<template>
  <section class="address-com-box">
    <section class="com-inner-box font-bold-weight">
      <span class="font-bold-weight">备注</span>
      <span class="tips-text van-multi-ellipsis--l2" @click="showRemarkPopup">{{showMarksText}}</span>
    </section>
    <section class="com-inner-box font-bold-weight">
      <span class="font-bold-weight">是否需要餐具</span>
      <van-checkbox v-model="props.submitForm.orderWare" />
    </section>
  </section>

  <SlidePopup
    ref="remarkPopupRef" title="订单备注"
    @cancelClick="clickRemarkCancel" @confirmClick="clickRemarkConfirm">
    <van-field
      class="input-field" v-model="showOrderRemarks" rows="3" show-word-limit
      type="textarea" maxlength="50" placeholder="在此写出您对本次订货单的备注要求"
    />
  </SlidePopup>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import SlidePopup from '@common/components/Slide_Popup/index.vue'

  const props = defineProps({
    submitForm: {
      type: Object,
      default: () => {}
    }
  })
  const showMarksText = computed(() => {
    return props.submitForm.orderRemarks || '点击输入备注信息﹥'
  })

  // 处理备注相关数据
  const remarkPopupRef = ref(null)
  const showOrderRemarks = ref('')
  // const resetShowRemark = () => { showOrderRemarks.value = '' }
  const clickRemarkCancel = () => {}
  const clickRemarkConfirm = () => {
    props.submitForm.orderRemarks = showOrderRemarks.value
  }
  const showRemarkPopup = () => {
    remarkPopupRef.value.showPopup()
  }
</script>

<style lang="less" scoped>
  .address-com-box {
    margin-top: 10px;
    overflow: hidden;
    border-radius: 6px;
    background-color: #fff;
    padding: 0 20px;
    .com-inner-box {
      padding: 15px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid @line-1;
      &:last-child {
        border-bottom: 0;
      }
      .tips-text {
        color: @text-3;
        line-height: 1.3;
        max-width: 170px;
        word-wrap: break-word;
      }
    }
  }
  .input-field {
    padding: 5px;
    border-radius: 4px;
    border: 1px solid @line-3;
  }
</style>
