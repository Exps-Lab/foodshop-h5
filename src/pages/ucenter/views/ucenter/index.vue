<template>
  <div class="main">
    <section class="info-box" @click="infoBoxClick" v-loading="loading">
      <img class="avatar" :src="userInfo.avatar" alt="avatar">
      <p v-if="isLogin" class="username text-ellipsis font-bold-weight-4">{{userInfo.username}}</p>
      <p v-else class="username font-bold-weight">点击登录/注册</p>
    </section>

    <!-- todo server配置返回auth菜单 -->
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
        <p class="menu-item" @click="toUserInfo">
          <van-icon class="icon" name="contact" />
          <span class="text">个人信息</span>
        </p>
        <p class="menu-item" @click="toAddress">
          <van-icon class="icon" name="location-o" />
          <span class="text">我的地址</span>
        </p>
        <p class="menu-item">
          <van-icon class="icon" name="sign" />
          <span class="text">我的订单</span>
        </p>
        <p class="menu-item">
          <van-icon class="icon" name="like-o" />
          <span class="text">我的收藏</span>
        </p>
        <p class="menu-item">
          <van-icon class="icon" name="star-o" />
          <span class="text">我的评价</span>
        </p>
      </section>

      <!--    系统功能   -->
      <section class="menu-box">
        <p class="menu-item" @click="toAboutUs">
          <van-icon class="icon" name="notes-o" />
          <span class="text">关于本站</span>
        </p>
        <p class="menu-item gray" @click="preLogout">
          <van-icon class="icon" name="smile-o" />
          <span class="text">退出登录</span>
        </p>
      </section>
    </section>
  </div>

  <Tabbar :active="2" />
</template>

<script setup>
  import User from '@utils/User'
  import { useRouter } from 'vue-router'
  import { computed, ref, reactive } from 'vue'
  import Tabbar from '@common/components/Tab_Bar/index.vue'
  import { useUserInfo } from '@pages/ucenter/hooks/userInfo'

  const router = useRouter()
  const { userInfoLoading, userData } = useUserInfo()
  const loading = ref(userInfoLoading)
  const userInfo = reactive(userData)

  // 是否登录
  const isLogin = computed(() => {
    return userInfo.username
  })

  // 业务跳转前判断登录态
  const preAuthJump = (handleCb) => {
    if (!isLogin.value) {
      User.login()
      return false
    }
    handleCb && handleCb.constructor === Function && handleCb()
  }

  // 用户信息点击
  const infoBoxClick = () => {
    preAuthJump()
  }

  /**
   * 菜单点击
   */
  // 退出
  const preLogout = () => {
    preAuthJump(() => {
      User.logout()
    })
  }
  // 关于我们
  const toAboutUs = () => {
    router.push('/ucenter/about_us')
  }
  // 我的信息
  const toUserInfo = () => {
    preAuthJump(() => {
      router.push('/ucenter/user_info')
    })
  }
  // 我的地址
  const toAddress = () => {
    preAuthJump(() => {
      router.push('/ucenter/address_list')
    })
  }
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
        height: 70px;
        width: 70px;
        object-fit: cover;
        border-radius: 50%;
      }
      .username {
        max-width: 50%;
        color: @text-4;
        font-size: 15px;
        margin-top: 10px;
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
              font-weight: 500;
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
