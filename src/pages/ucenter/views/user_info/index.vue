<template>
  <div class="main">
    <section class="form-box">
      <section class="from-item">
        <span class="item-label avatar">头像</span>
        <div class="item-right">
          <ImageUpload
            uploaderMode="single"
            :maxCount="2"
            :fileData="fileData"
            @imgUploadFinish="imgUploadFinish" />
          <van-icon class="icon" name="arrow" />
        </div>
      </section>
      <section class="from-item" @click="modifyUsername">
        <span class="item-label username">用户名</span>
        <div class="item-right">
          <p class="username">{{userInfo.username}}</p>
          <van-icon class="icon" name="arrow" />
        </div>
      </section>
    </section>
  </div>

  <!-- 更改用户名dialog -->
  <van-dialog v-model:show="showModifyNameDialog" title="修改用户名"
    :showConfirmButton="false" :closeOnClickOverlay="true" theme="round-button">
    <van-form @submit="onModifyNameSubmit" class="dialog-box">
      <van-cell-group inset>
        <van-field colon center label-width="4em" maxlength="10"
          v-model="modifyName" label="用户名" placeholder="请填写用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"/>
      </van-cell-group>
      <p class="tips">最多10个字符，一个汉字为2个字符</p>
      <div class="submit-box">
        <van-button round block type="primary" native-type="submit">确 认</van-button>
      </div>
    </van-form>
  </van-dialog>
</template>

<script setup>
  import { Dialog, Toast } from 'vant'
  import { ref, reactive } from 'vue'
  import Loading from '@common/components/Loading'
  import { updateUserAvatar, updateUserName } from '@api/user'
  import ImageUpload from '@components/Img_Upload/index.vue'
  import { useUserInfo } from '@common/hooks/userInfo'

  const { userData, setUserStorage } = useUserInfo()
  const userInfo = reactive(userData)

  // ******
  // 处理头像
  // ******
  const fileData = ref([{
    url: userInfo.avatar
  }])
  const imgUploadFinish = (url) => {
    userInfo.avatar = url
    updateUserAvatar({
      avatar: url
    }).then(res => {
      setUserStorage(res.data)
      Toast.success('头像修改成功')
    }).catch(e => {
      console.error(e)
      Toast.fail(e)
    })
  }

  // ******
  // 处理用户名
  // ******
  const VanDialog = Dialog.Component
  const showModifyNameDialog = ref(false)
  const modifyName = ref(userInfo.username)
  const modifyUsername = () => {
    showModifyNameDialog.value = true
  }
  // 提交用户名更改
  const onModifyNameSubmit = () => {
    showModifyNameDialog.value = false
    Loading.show()
    if (modifyName.value === userInfo.username) {
      return false
    } else {
      userInfo.username = modifyName.value
      updateUserName({
        username: modifyName.value
      }).then(res => {
        setUserStorage(res.data)
        Toast.success('用户名修改成功')
      }).catch(e => {
        console.error(e)
        Toast.fail(e)
      }).finally(() => {
        Loading.hide()
      })
    }
  }
</script>

<style lang="less" scoped>
  .dialog-box {
    padding: 30px 0 0 0;
    &:deep(.van-field) {
      background-color: rgba(238, 238, 238, 0.3);
    }
    .submit-box {
      padding: 35px 20px 0;
    }
    .tips {
      color: @text-3;
      font-size: 12px;
      margin: 10px 0 0 20px;
    }
  }
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
