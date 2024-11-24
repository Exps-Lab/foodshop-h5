<template>
  <van-notice-bar
    speed="60"
    left-icon="volume-o"
    text="管理后台地址：http://foodshops.fun/admin-user 可以在后台创建自己的店铺和商品体验流程呀!"
  />

  <section class="admin-entry-box" @click="goToAdmin">
    <span class="entry-text">管理后台入口</span>
  </section>

</template>

<script setup>
const goToAdmin = () => {
  window.open('http://foodshops.fun/admin-user')
}
</script>

<style lang="less" scoped>
.admin-entry-box {
  position: fixed;
  right: 0;
  top: 40%;
  z-index: 10;
  width: 65px;
  padding: 4px 10px ;
  border-radius: 10px 0 0 10px;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: rgba(18, 18, 18, 0.25) 0 2px 6px;
  .entry-text {
    color: @brand1-6;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.3;
  }
}
</style>
