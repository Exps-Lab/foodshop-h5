<template>
  <h1>{{ msg }}</h1>
  <button type="button" class="common-btn normal" @click="btnClick">count is: {{ count }}</button>
  <p>Name: {{ $store.state.name }}</p>
  <p>VoteNum: {{ reqData.voteNum }}</p>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useStore } from "vuex"
import { test } from '@api/test'

defineProps({
  msg: String
})

const count = ref(0)
let reqData = reactive({
  voteNum: 0
})
const store = useStore()

const btnClick = () => {
  count.value++
  store.dispatch('setName', 'newName' + count.value)
  reqApi()
}
const reqApi = () => {
  test({ name: 'test' })
    .then(res => {
      console.log('req success')
      reqData.voteNum += res.data?.voteNum
    })
    .catch(err => {
      console.log('req failed')
    })
}
</script>

<style lang="less" scoped>
p {
  a {
    color: #42b983;
  }
}
</style>
