<template>
  <section class="beian-box">
    <p class="list">
      <span class="name">FoodShop.Fun </span>
      <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2023000026号-1</a>
    </p>
    <!--  公安备案 -->
    <p class="list">
      <img class="police-badge" src="../imgs/police_badge.png">
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=" target="_blank">京公网安备11010502051596号</a>
    </p>
  </section>
</template>

<script setup>
</script>

<style lang="less" scoped>
  .beian-box {
    background-color: #f5f5f6;
    padding: 0 30px 20px;
    .list {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 24px;
      .name {
        font-size: 16px;
        font-weight: bold;
        margin-right: 10px;
        color: #bbb;
        text-shadow: 1px 1px #ddd;
      }
      .police-badge {
        width: 20px;
        height: 20px;
        margin-right: 6px;
      }
    }
  }
</style>
