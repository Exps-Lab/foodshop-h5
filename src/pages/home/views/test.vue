<template>
  <p class="test" @click="showToast">test PostCSS</p>
</template>

<script setup>
  import { onMounted, getCurrentInstance } from 'vue'

  const internalInstance = getCurrentInstance()
  const globalProperties = internalInstance?.appContext.config.globalProperties
  function showToast () {
     globalProperties.$toast({
       text: 'test',
     })
  }

  onMounted (() => {
  });
</script>

<style>
.test {
  display: flex;
  justify-content: center;
  align-content: center;
  font-size: 36px;
}
</style>
