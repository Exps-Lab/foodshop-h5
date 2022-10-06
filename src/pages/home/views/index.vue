<template>
  <img alt="Vue logo" src="@/assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />

  <van-button type="primary">主要按钮</van-button>
</template>

<script setup>
import HelloWorld from '@common/components/HelloWorld/index.vue'
  console.log(import.meta.env)
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img {
  width: 80px;
}
.test {
  display: flex;
  justify-content: center;
  align-content: center;
  font-size: 36px;
}
</style>
