<!-- 选择支付方式组件 -->

<template>
  <section class="address-com-box">
    <section class="com-left font-bold-weight">
      <span class="font-bold-weight pay-box">
        <van-icon name="ecard-pay" class="blue-text pay" />
        餐币支付
      </span>
      <van-radio-group v-model="checkedVal">
        <van-radio name="1" />
      </van-radio-group>

    </section>
  </section>
</template>

<script setup>
  import { ref } from 'vue'
  const checkedVal = ref('1')
</script>

<style lang="less" scoped>
  .address-com-box {
    margin-top: 10px;
    overflow: hidden;
    border-radius: 6px;
    background-color: #fff;
    .com-left {
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .pay-box {
        display: flex;
        align-items: center;
      }
      .blue-text {
        color: @brand1-6;
        font-size: 18px;
        &.pay {
          font-size: 20px;
          margin-right: 2px;
        }
      }
    }
  }
</style>
