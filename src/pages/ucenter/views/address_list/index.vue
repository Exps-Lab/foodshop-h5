<template>
  <section class="main address-box" v-if="addressList.length">
    <section class="address-list" v-for="address in addressList" :key="address.id" @click="choseAddress(address)">
      <van-icon class="edit-icon" name="edit" @click="toAddressDetail(address.id)" />
      <p class="msg-box">
        <span class="tag" v-if="address.tag">{{address.tag}}</span>
        <span class="title font-bold-weight text-ellipsis">{{address.title}} {{address.room}}</span>
      </p>
      <p class="msg-box">
        <span class="name sub-text">{{address.receive}} ({{getGenderText(address.gender)}})</span>
        <span class="tel sub-text">{{address.phone}}</span>
      </p>
    </section>
  </section>

  <van-empty description="暂无地址" v-else />
  <!--  添加地址  -->
  <van-icon class="add-address" name="add" @click="toAddressDetail('')" />
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { getAddressList } from '@api/user/address'
  import Loading from '@common/components/Loading'
  import { Toast } from 'vant'

  const router = useRouter()
  const addressList = ref([])
  // 跳转地址详情页
  const toAddressDetail = (addressId) => {
    // 区分新增还是更新(是否传id)
    const query = addressId ? { addressId } : {}
    router.push({
      path: '/ucenter/address_detail',
      query
    })
  }

  // [note] 选择当前地址，目前业务来源有"确认订单页"
  const choseAddress = ({ id }) => {
    // todo 跳转确认订单
  }

  const getGenderText = (gender) => {
    const genderMap = {
      0: '先生',
      1: '女士'
    }
    return genderMap[gender]
  }

  // 获取地址列表
  const preGetAddressList = async () => {
    Loading.show()
    try {
      const { data } = await getAddressList()
      addressList.value = addressList.value.concat(data)
    } catch (err) {
      Toast.fail(err)
    } finally {
      Loading.hide()
    }
  }
  preGetAddressList()
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
  }
  .van-empty {
    height: 100vh;
  }
  .address-box {
    .address-list {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 12px 40px 12px 20px;
      background-color: @fill-1;
      border-bottom: 1px solid @line-1;
      &:last-child {
        border-bottom: 0;
      }
      .edit-icon {
        position: absolute;
        font-size: 18px;
        right: 20px;
        top: 50%;
        color: @fill-7;
        transform: translateY(-50%);
      }
      .msg-box {
        display: flex;
        align-items: center;
        line-height: 1.7;
        .tag {
          flex-shrink: 0;
          border-radius: 4px;
          padding: 3px 6px;
          color: @brand1-6;
          line-height: 1;
          background-color: @brand1-1;
          transform: scale(0.8) translateX(-4px);
        }
        .title {
          font-size: 15px;
        }
        .sub-text {
          color: @text-3;
          font-size: 13px;
        }
        .tel {
          margin-left: 10px;
        }
        .name {
          margin-right: 10px;
        }
      }
    }
  }
  .add-address {
    position: fixed;
    right: 6px;
    bottom: 25%;
    color: @brand1-6;
    font-size: 54px;
  }
</style>
