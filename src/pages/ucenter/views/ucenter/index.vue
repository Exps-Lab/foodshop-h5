<template>
  <div class="main">
    <section class="info-box">
      <p>
        <img v-if="userInfo.avatar" class="avatar" :src="userInfo.avatar" alt="avatar">
        <van-icon v-else class="icon-avatar" name="user-circle-o" />
      </p>
      <p class="username">用户名</p>
    </section>
    <section class="menu-container">
      <!--   活动功能   -->
      <section class="menu-box activity">
        <p class="menu-item">
          <van-icon class="icon" name="point-gift" />
          <span class="text">我的红包</span>
        </p>
      </section>

      <!--   常规功能   -->
      <section class="menu-box">
        <p class="menu-item">
          <van-icon class="icon" name="sign" />
          <span class="text">我的订单</span>
        </p>
        <p class="menu-item">
          <van-icon class="icon" name="location-o" />
          <span class="text">我的地址</span>
        </p>
        <p class="menu-item">
          <van-icon class="icon" name="like-o" />
          <span class="text">我的收藏</span>
        </p>
        <p class="menu-item">
          <van-icon class="icon" name="star-o" />
          <span class="text">我的评价</span>
        </p>
        <p class="menu-item">
          <van-icon class="icon" name="notes-o" />
          <span class="text">关于本站</span>
        </p>
        <p class="menu-item gray">
          <van-icon class="icon" name="smile-o" />
          <span class="text">退出登录</span>
        </p>
      </section>

      <!--    系统功能   -->
      <!--    <section class="menu-box"></section>-->
    </section>
  </div>

  <Tabbar :active="2" />
</template>

<script setup>
// import { getCapture, loginSubmit } from '@api/login'
import Tabbar from '@common/components/Tab_Bar/index.vue'
import { reactive } from 'vue'

const userInfo = reactive({
  avatar: '',
  name: ''
})

const reqUcenterData = () => {
  // getUcenterData().then(res => {
  //   const { data } = res
  //   Svg.value = data
  // })
}

const init = () => {
  reqUcenterData()
}
init()
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    .info-box {
      background-image: linear-gradient(rgba(2,182,253,.9), var(--van-gray-1));
      padding: 40px 0 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .avatar {
        height: 80px;
        width: 80px;
        object-fit: cover;
        border-radius: 50%;
      }
      .icon-avatar {
        font-size: 56px;
        background: @line-2;
        color: rgba(0,0,0,.4);
        border: 1px solid @brand1-6;
        border-radius: 50%;
        box-shadow: 0 0 10px @line-1;
      }
      .username {
        .text-ellipsis;
        max-width: 50%;
        font-size: 16px;
        margin-top: 8px;
      }
    }
    .menu-container {
      margin: 20px;
      .menu-box {
        display: flex;
        align-items: center;
        align-content: space-between;
        flex-wrap: wrap;
        border-radius: 10px;
        padding: 10px 14px;
        background-color: #fff;
        margin-bottom: 10px;
        box-shadow: 0 0 5px @line-2;
        &.activity {
          .menu-item {
            .icon {
              .font-bold-weight;
              color: @error-6;
            }
          }
        }
        .menu-item {
          flex-basis: 25%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 10px 0;
          &.gray {
            .icon,
            .text {
              color: @text-3;
            }
          }
          .icon {
            font-size: 20px;
            margin-bottom: 6px;
          }
          .text {
            font-size: 12px;
            color: @text-5;
            text-align: center;
            line-height: 1.2;
          }
        }
      }
    }
  }
</style>
