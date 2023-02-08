<template>
  <div class="main">
    <section class="form-box">
      <section class="from-item">
        <span class="item-label avatar">头像</span>
        <div class="item-right">
          <ImageUpload :fileData="fileData" @imgUploadFinish="imgUploadFinish" />
          <van-icon class="icon" name="arrow" />
        </div>
      </section>
      <section class="from-item">
        <span class="item-label username">用户名</span>
        <div class="item-right">
          <p class="username">{{userInfo.username}}</p>
          <van-icon class="icon" name="arrow" />
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import ImageUpload from '@components/ImgUpload/index.vue'
  import { useUserInfo } from '@pages/user/composables/userInfo'

  const { userData } = useUserInfo()
  const userInfo = reactive(userData)

  const fileData = ref([{
    url: userInfo.avatar
  }])
  const imgUploadFinish = (url) => {
    userData.avatar = url
  }
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    padding: 15px;
    .form-box {
      background-color: #fff;
      border-radius: 10px;
      margin-bottom: 15px;
      padding: 10px 15px;
      .from-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 50px;
        padding-bottom: 10px;
        border-bottom: 1px solid @line-1;
        &:last-child {
          padding-bottom: 0;
          border-bottom: 0;
        }
        .item-label {
          font-size: 14px;
        }
        .item-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .icon {
            margin-left: 6px;
            font-size: 14px;
            color: @fill-5;
          }
          .username {
            font-size: 15px;
            margin-right: 4px;
          }
        }
      }
    }
  }
</style>
