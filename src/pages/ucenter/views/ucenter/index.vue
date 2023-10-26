<template>
  <div class="main">
    <section class="info-box" v-loading="loading" @click="infoBoxClick">
      <img class="avatar" :src="userInfo.avatar" alt="avatar">
      <p v-if="isLogin" class="username text-ellipsis font-bold-weight-4">{{userInfo.username}}</p>
      <p v-else class="username font-bold-weight">点击登录/注册</p>
    </section>

    <section class="menu-container">
      <section
        v-for="(menuBox, index) in menuMap"
        :key="index"
        :class="['menu-box', menuBox.isHot && 'hot']">
        <p
          class="menu-item"
          v-for="menuItem in menuBox.data"
          :key="menuItem.name"
          @click="preAuthJump(menuItem.clickEvent, menuItem.needLogin)">
          <van-icon class="icon" :name="menuItem.icon" />
          <span class="text">{{menuItem.name}}</span>
        </p>
      </section>
    </section>
  </div>

  <Tabbar :active="2" />
</template>

<script setup>
  import User from '@utils/User'
  import { Dialog } from 'vant'
  import { useRouter } from 'vue-router'
  import { computed, ref, reactive } from 'vue'
  import Tabbar from '@common/components/Tab_Bar/index.vue'
  import { useUserInfo } from '@common/hooks/userInfo'

  const router = useRouter()
  const { userInfoLoading, userData } = useUserInfo()
  const loading = ref(userInfoLoading)
  const userInfo = reactive(userData)

  // 是否登录
  const isLogin = computed(() => {
    return userInfo.username
  })

  // 业务跳转前判断登录态
  const preAuthJump = (handleCb, needLogin = true) => {
    if (needLogin && !isLogin.value) {
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
      Dialog.confirm({
        title: '确认退出？'
      })
        .then(() => {
          preAuthJump(() => {
            User.logout()
          })
        })
        .catch(() => {
        })
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
  // 账户信息
  const toAccountInfo = () => {
    preAuthJump(() => {
      router.push('/ucenter/account_info')
    })
  }
  // 评价中心
  const toCommentCenter = () => {
    preAuthJump(() => {
      router.push('/ucenter/comment_center')
    })
  }
  // 我的收藏
  const toCollectList = () => {
    preAuthJump(() => {
      router.push('/ucenter/collect_list')
    })
  }

  // [note] 菜单配置数据
  const menuMap = [
    // 活动功能
    {
      type: 'activity',
      isHot: true,
      data: [{
        name: '我的红包',
        icon: 'point-gift',
        needLogin: true,
        clickEvent: () => {}
      }]
    },
    // 常规功能
    {
      type: 'common',
      isHot: false,
      data: [{
        name: '个人信息',
        icon: 'contact',
        needLogin: true,
        clickEvent: toUserInfo
      }, {
        name: '我的地址',
        icon: 'location-o',
        needLogin: true,
        clickEvent: toAddress
      }, {
        name: '我的账户',
        icon: 'contact',
        needLogin: true,
        clickEvent: toAccountInfo
      }, {
        name: '我的收藏',
        icon: 'like-o',
        needLogin: true,
        clickEvent: toCollectList
      }, {
        name: '我的评价',
        icon: 'star-o',
        needLogin: true,
        clickEvent: toCommentCenter
      }]
    },
    // 系统功能
    {
      type: 'system',
      isHot: false,
      data: [{
        name: '关于本站',
        icon: 'notes-o',
        needLogin: false,
        clickEvent: toAboutUs
      }, {
        name: '退出登录',
        icon: 'smile-o',
        needLogin: true,
        clickEvent: preLogout
      }]
    }]
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
        &.hot {
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
