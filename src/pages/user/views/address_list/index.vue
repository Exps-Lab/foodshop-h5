<template>
  <section class="main address-box">
    <section class="address-list">
      <van-icon class="edit-icon" name="edit" @click="toAddressDetail" />
      <p class="msg-box">
        <span class="tag">公司</span>
        <span class="title font-bold-weight text-ellipsis">北京市朝阳区北京市123123123123朝阳区北京市朝阳区北京市朝阳区</span>
      </p>
      <p class="msg-box">
        <span class="name sub-text">测试</span>
        <span class="tel sub-text">1123123123</span>
      </p>
    </section>
  </section>

  <!--  添加地址  -->
  <van-icon class="add-address" name="add" @click="toAddressDetail" />
</template>

<script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()

  // 跳转地址详情页
  const toAddressDetail = () => {
    // todo 传参地址id待定
    // 区分新增还是更新(是否传id)
    router.push({
      path: '/ucenter/address_detail',
      query: {}
    })
  }
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
  }
  .address-box {
    .address-list {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 12px 40px 12px 20px;
      background-color: @fill-1;
      border-bottom: 1px solid @line-1;
      &:last-child {
        border-bottom: 0;
      }
      .edit-icon {
        position: absolute;
        font-size: 18px;
        right: 20px;
        top: 50%;
        color: @fill-7;
        transform: translateY(-50%);
      }
      .msg-box {
        display: flex;
        align-items: center;
        line-height: 1.7;
        .tag {
          flex-shrink: 0;
          border-radius: 4px;
          padding: 3px 6px;
          color: @brand1-6;
          line-height: 1;
          background-color: @brand1-1;
          transform: scale(0.8) translateX(-4px);
        }
        .title {
          font-size: 15px;
        }
        .sub-text {
          color: @text-3;
          font-size: 13px;
        }
        .name {
          margin-right: 10px;
        }
      }
    }
  }
  .add-address {
    position: fixed;
    right: 6px;
    bottom: 25%;
    color: @brand1-6;
    font-size: 54px;
  }
</style>
