<template>
  <div class="main">
    <van-nav-bar
      title="登 录"
      left-text="返回"
      left-arrow
      @click-left="headerBackClick"
    />
    <van-form class="form-box" @submit="formSubmit" label-width="3.4em" validate-trigger="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="账号"
          placeholder="请填写用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请填写密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="code"
          name="code"
          label="验证码"
          :maxlength="4"
          center
          placeholder="请填写验证码"
          :rules="[{ required: true, message: '请填写验证码' }]">
          <template #button>
            <section class="capture-box">
              <p class="capture" v-html="captureSvg"></p>
              <van-icon name="replay" @click="capture" />
            </section>
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 20px;">
        <van-button round block type="primary" native-type="submit">提交</van-button>
      </div>
    </van-form>
    <p class="tips">新用户首次登录会自动完成注册</p>
  </div>
</template>

<script setup>
import { Toast } from 'vant'
import { getQuery } from '@utils'
import { getCapture, loginSubmit } from '@api/login'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const code = ref('')
const captureSvg = ref('<svg></svg>')

const headerBackClick = () => {
  window.history.back()
}
const formSubmit = (values) => {
  values.password = window.btoa(values.password)
  loginSubmit(values).then(res => {
    Toast.success('登录/注册成功')
    backPrev()
  }).catch(err => {
    Toast.fail(err.data.msg)
    capture()
  })
}
const backPrev = () => {
  const redirecturi = getQuery('redirecturi')
  if (redirecturi) {
    window.location.href = decodeURIComponent(redirecturi)
  } else {
    headerBackClick()
  }
}
const capture = () => {
  getCapture().then(res => {
    const { data } = res
    captureSvg.value = data
  })
}

const init = () => {
  capture()
}
init()
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    .form-box {
      margin-top: 30px;
      .capture-box {
        display: flex;
        align-items: center;
        justify-content: center;
        .capture {
          height: 35px;
          margin-right: 5px;
          border-radius: 0.04rem;
          overflow: hidden;
          :deep(svg) {
            width: 85px;
            height: 35px;
            background-color: #efefef;
          }
        }
      }
    }
    .tips {
      text-align: center;
      color: rgba(255, 0, 0, 0.8);
    }
  }
</style>
