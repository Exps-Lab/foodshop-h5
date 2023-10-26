<template>
  <div class="main">
    <section class="com-box">
      <img class="user-avatar" :src="userInfo.avatar" alt="shopImg" />
      <section class="user-detail-box">
        <p class="user-name">{{userInfo.username}}</p>
        <p class="comment-tips">查看您所有的订单评价</p>
      </section>
    </section>

    <van-tabs v-model:active="tabActive" @click-tab="tabChange">
      <van-tab title="待评价" :name="0"></van-tab>
      <van-tab title="已评价" :name="1"></van-tab>
      <ComListPagination :filter="filter" :reqApiFun="reqFun">
        <template v-slot="slotProps">
          <CommentOrderCard v-if="tabActive === 0" :cardData="slotProps.listData" />
          <CommentCard v-if="tabActive === 1" :cardData="slotProps.listData" />
        </template>
      </ComListPagination>
    </van-tabs>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import ComListPagination from '@common/components/Com_List_Pagination/index.vue'
  import CommentCard from '@common/components/Comment_Card/index.vue'
  import CommentOrderCard from './components/Comment_Order_Card.vue'
  import { useUserInfo } from '@common/hooks/userInfo'
  import { getCommentCenterList } from '@api/user/commentCenter'

  const { userData } = useUserInfo()
  const userInfo = reactive(userData)

  const reqFun = computed(() => {
    return getCommentCenterList
  })

  const tabActive = ref(0)
  const tabChange = ({ name }) => {
    if (name !== filter.type) {
      tabActive.value = name
      filter.type = name
    }
  }

  const filter = reactive({
    type: tabActive.value
  })
</script>

<style lang="less" scoped>
  img {
    object-fit: cover;
    max-width: 100%;
    display: block;
  }
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    padding: 15px;
    .com-box {
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 8px;
      padding: 15px;
      .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .user-detail-box {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .user-name {
          font-size: 16px;
        }
        .comment-tips {
          margin-top: 6px;
          color: @text-3;
        }
      }
    }
    :deep(.van-tabs__wrap) {
      height: 55px;
      .van-tabs__nav {
        background-color: transparent;
      }
    }
  }
</style>
