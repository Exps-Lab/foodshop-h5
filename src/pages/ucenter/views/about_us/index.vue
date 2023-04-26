<template>
  <div class="main">
    <img class="logo" src="./imgs/logoko.png" alt="logo">
    <p class="info font-bold-weight">吃的开心~</p>
    <p class="info gray">2022 ~ 2023</p>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0;
    .logo {
      display: block;
      width: 200px;
      object-fit: cover;
    }
    .info {
      font-size: 14px;
      margin-top: 10px;
      &.gray {
        color: @text-3;
      }
    }
  }
</style>
