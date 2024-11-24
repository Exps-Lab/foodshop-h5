<template>
  <div class="history-box">
    <nav class="title font-bold-weight">
      <span>搜索历史</span>
      <van-icon name="delete-o" v-if="shopHistory.length" @click="clearHistory" />
    </nav>
    <div class="history-list">
      <span
        class="name text-ellipsis"
        v-for="(item, index) in shopHistory"
        :key="index"
        @click="handleSearch(item)"
      >
        {{ item }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { Storage } from '@/utils/index.js'
import { ref } from 'vue'
const shopHistory = ref(Storage.get('shopHistory') || [])

const emits = defineEmits(['search'])

const clearHistory = () => {
  Storage.clear()
  shopHistory.value = []
}

const handleSearch = (val) => {
  emits('search', val)
}
</script>

<style lang="less" scoped>
.history {
  &-box {
    background: #fff;
    border-radius: 12px 12px 0 0;
    height: 100%;
    overflow: auto;
    .title {
      color: #222426;
      font-size: 14px;
      margin: 20px 12px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  &-list {
    margin: 0 8px;
    .name {
      background: #F5F5F6;
      border-radius: 14px;
      padding: 8px 10px;
      color: #5E5F60;
      margin: 2px 4px;
      font-size: 12px;
      display: inline-block;
      position: relative;
      max-width: 180px;
    }
  }
}
</style>
