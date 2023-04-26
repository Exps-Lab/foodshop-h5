<template>
  <div class="main">
    <section class="account-box">
      <p class="box-title">账户餐币余额(币)</p>
      <p class="money-text font-bold-weight">{{accountMoney}}</p>
    </section>
    <div class="submit-box">
      <van-button round block type="primary" recharge-btn @click="rechargeMoney">充餐币</van-button>
    </div>
  </div>

  <!-- 更改用户名dialog -->
  <van-dialog v-model:show="showMoneyDialog" title="餐币充值"
    :showConfirmButton="false" :closeOnClickOverlay="true" theme="round-button">
    <van-form @submit="onModifySubmit" class="dialog-box">
      <van-cell-group inset>
        <van-field colon center type="digit" label-width="4em" maxlength="4"
          v-model="modifyMoney" label="餐币数" placeholder="请填写要充值的餐币数"
          :rules="[{ required: true, message: '请填写要充值的餐币数' }]"/>
      </van-cell-group>
      <div class="submit-box">
        <van-button round block type="primary" native-type="submit">确 认</van-button>
      </div>
    </van-form>
  </van-dialog>
</template>

<script setup>
  import { Dialog, Toast } from 'vant'
  import { ref } from 'vue'
  import Loading from '@common/components/Loading'
  import { getAccountMoney, updateAccountMoney } from '@api/user/account'

  const VanDialog = Dialog.Component
  const accountMoney = ref('...')
  const showMoneyDialog = ref(false)
  const rechargeMoney = () => {
    showMoneyDialog.value = true
  }

  // 获取账户余额
  const preGetAccountMoney = async () => {
    const res = await getAccountMoney()
    const { money } = res.data
    accountMoney.value = money
  }

  const modifyMoney = ref('')
  // 账户餐币充值
  const onModifySubmit = () => {
    showMoneyDialog.value = false
    Loading.show()
    updateAccountMoney({
      money: Number(modifyMoney.value)
    }).then(res => {
      const { money } = res.data
      accountMoney.value = money
      modifyMoney.value = ''
      Toast.success('餐币充值成功')
    }).catch(e => {
      console.error(e)
      Toast.fail(e)
    }).finally(() => {
      Loading.hide()
    })
  }

  preGetAccountMoney()
</script>

<style lang="less" scoped>
  .dialog-box {
    padding: 30px 0 0 0;
    &:deep(.van-field) {
      background-color: rgba(238, 238, 238, 0.3);
    }
    .submit-box {
      padding: 35px 20px 0;
      background-color: #fff;
    }
  }
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    padding: 15px;
    .account-box {
      padding: 50px 0;
      background-color: @fill-6;
      border-radius: 8px;
      margin-bottom: 15px;
      color: @text-2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 5px @line-2;
      .box-title {
        font-size: 16px;
      }
      .money-text {
        margin-top: 15px;
        font-size: 36px;
      }
    }
  }
</style>
