<template>
  <section class="main">
    <section class="map-box">
      <ShowPosInMap :posStr="form.pos" :mapSetting="mapSetting" :markerSetting="markerSetting" />
    </section>
    <section class="form-box">
      <van-form @submit="onSubmit" label-width="45">
        <van-cell-group inset>
          <van-field
            v-model="form.pos"
            label="地址"
            readonly
            name="pos"
            @click="choseAddress"
            right-icon="arrow"
            :rules="[{ required: true, message: '请选择收货地址' }]">
            <template #input>
              <section class="input-box" v-if="hasChoseAddress">
                <p class="title font-bold-weight text-ellipsis">{{form.title}}</p>
                <p class="address text-ellipsis">{{form.address}}</p>
              </section>
              <p v-else class="default-text font-bold-weight">请选择收货地址</p>
            </template>
          </van-field>

          <van-field
            v-model="form.room"
            name="room"
            label="门牌号"
            clearable
            placeholder="请填写详细地址，具体到门牌号"
            :rules="[{ required: true, message: '请填写详细地址' }]" />

          <van-field
            v-model="form.receive"
            name="receive"
            label="收货人"
            placeholder="请填写收货人"
            clearable
            :rules="[{ required: true, message: '请填写收货人' }]">
            <template #button>
              <van-radio-group v-model="form.gender" direction="horizontal">
                <van-radio :name="0">先生</van-radio>
                <van-radio :name="1">女士</van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field
            v-model="form.phone"
            label="手机号"
            name="phone"
            maxlength="11"
            type="digit"
            clearable
            placeholder="请填写收货人11位手机号"
            :rules="[{ validator: validatorPhone, message: '请填写收货人11位手机号' }]" />

          <van-field
            v-model="form.tag"
            label="标签"
            name="tag">
            <template #input>
              <van-tag
                round
                v-for="(tag, index) in addressTagMap"
                :key="index"
                type="primary"
                @click="chooseTag(tag)"
                :class="['tag-list', tag.isChose ? 'chose' : 'default']">
                {{tag.text}}
              </van-tag>
            </template>
          </van-field>
        </van-cell-group>
        <div class="btn-box">
          <van-button round block plain type="primary" @click="preDeleteAddress" v-if="formMode === 'update'">删除</van-button>
          <van-button round block type="primary" native-type="submit">保存</van-button>
        </div>
      </van-form>
    </section>
  </section>
</template>

<script setup>
  import { Toast, Dialog } from 'vant'
  import Loading from '@common/components/Loading'
  import { reactive, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { diffModuleJump } from '@utils'
  import { addAddress, updateAddress, deleteAddress, getAddressDetail } from '@api/user/address'
  import { ADDRESSCHOSEPOS, TEMPCHOSEPOS } from '@utils/sessionStorage_keys'
  import ShowPosInMap from '@components/Show_Pos_in_Map/index.vue'

  const route = useRoute()
  const router = useRouter()
  const address_id = route.query.addressId
  const validatorPhone = (val) => /1\d{10}/.test(val)
  const formMode = address_id !== undefined ? 'update' : 'add'

  // 更改地图展示属性
  const mapSetting = {
    showControl: false,
    draggable: false,
    scrollable: false,
    doubleClickZoom: false
  }
  // 更改地图上marker展示属性
  const markerSetting = {
    width: 20,
    height: 30
  }

  // 地址tag配置
  const addressTagMap = reactive([{
    isChose: false,
    text: '家'
  }, {
    isChose: false,
    text: '学校'
  }, {
    isChose: false,
    text: '公司'
  }])

  // 地址表单
  const form = reactive({
    address: '',
    title: '',
    pos: '',
    room: '',
    receive: '',
    gender: '',
    phone: '',
    tag: ''
  })

  // 是否已选择地址
  const hasChoseAddress = computed(() => {
    return Boolean(form.address && form.title && form.pos)
  })

  // 点击跳转选择地址页面
  const choseAddress = () => {
    const query = 'from=address' + (formMode === 'update' ? `&addressId=${address_id}` : '')
    diffModuleJump('/roiPicker', query, 'home')
  }

  // 选择tag
  // [note] 逻辑: 可以取消的CheckBox
  const chooseTag = (tag) => {
    const { text } = tag
    addressTagMap.forEach((tagItem) => {
      if (tagItem.text !== text) {
        tagItem.isChose = false
      } else {
        tagItem.isChose = !tagItem.isChose
        form.tag = tagItem.isChose ? text : ''
      }
    })
  }

  // 回显tag
  const reviewTag = (tagText) => {
    if (form.tag) {
      const tagObj = addressTagMap.find(item => item.text === form.tag)
      chooseTag(tagObj)
    } else {
      addressTagMap.forEach(item => {
        item.isChose = false
      })
    }
  }

  // 删除地址
  const preDeleteAddress = async () => {
    Dialog.confirm({
      title: '删除地址',
      message: '确定删除该收货地址吗？'
    }).then(async () => {
      Loading.show()
      try {
        await deleteAddress({ address_id })
        Toast.success('地址删除成功')
        setTimeout(() => {
          router.push('/ucenter/address_list')
        }, 10)
      } catch (err) {
        Toast.fail(err)
      } finally {
        Loading.hide()
      }
    }).catch(() => {})
  }

  // 地址保存
  const onSubmit = async () => {
    Loading.show()
    try {
      const API = formMode === 'update' ? updateAddress : addAddress
      const actionText = formMode === 'update' ? '地址更新成功' : '地址添加成功'
      form.address_id = formMode === 'update' ? address_id : ''

      await API(form)
      Toast.success(actionText)
      setTimeout(() => {
        router.push('/ucenter/address_list')
      }, 10)
    } catch (err) {
      Toast.fail(err)
    } finally {
      Loading.hide()
    }
  }

  const preGetAddressDetail = async () => {
    if (formMode === 'update') {
      Loading.show()
      try {
        const { data } = await getAddressDetail({ address_id })
        Object.assign(form, data)
        reviewTag(form.tag)
      } catch (err) {
        Toast.fail(err)
      } finally {
        Loading.hide()
      }
    }
  }

  // 获取sessionStorage里用户选择的地址
  const setChoseAddress = async () => {
     const storageData = JSON.parse(sessionStorage.getItem(ADDRESSCHOSEPOS)) || null
     if (storageData) {
       const { title, address, lat, lng } = storageData
       form.title = title
       form.pos = `${lat},${lng}`
       form.address = address
       // [note] 只用来传递跨页数据，接到后删除不做后续功能支持
       sessionStorage.removeItem(ADDRESSCHOSEPOS)
     }
  }

  // 获取sessionStorage里缓存的form表单并回显
  const setTempForm = async () => {
    const storageData = JSON.parse(sessionStorage.getItem(TEMPCHOSEPOS)) || null
    if (storageData) {
      Object.assign(form, storageData)
      reviewTag(form.tag)
      // [note] 只用来传递跨页数据，接到后删除不做后续功能支持
      sessionStorage.removeItem(TEMPCHOSEPOS)
    }
  }

  // 离开页面记录表单
  window.onbeforeunload = () => {
    const isEmptyObj = Object.values(form).every(item => item === '')
    const { name } = route
    if (!isEmptyObj && name === 'addressDetail') {
      sessionStorage.setItem(TEMPCHOSEPOS, JSON.stringify(form))
    }
  }

  const init = async () => {
    await preGetAddressDetail()
    await setTempForm()
    await setChoseAddress()
  }
  init()
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    .map-box {
      height: 140px;
      border-radius: 10px;
      overflow: hidden;
    }
    .form-box {
      margin-top: 15px;
      &:deep(.van-radio__icon) {
        height: auto;
        .van-badge__wrapper {
          width: 16px;
          height: 16px;
          line-height: 1;
        }
      }
      .input-box {
        p {
          max-width: 220px;
        }
        .address {
          font-size: 12px;
          color: @text-3;
        }
      }
      .default-text {
        color: @brand1-6;
      }
      .tag-list {
        display: inline-block;
        min-width: 35px;
        line-height: 20px;
        text-align: center;
        margin-right: 10px;
        &.chose {
          border: 1px solid @brand1-3;
          background-color: @brand1-1;
          color: @brand1-6;
        }
        &.default {
          border: 1px solid @line-3;
          background-color: #fff;
          color: @fill-6;
        }
      }
      .btn-box {
        padding: 30px 20px;
        display: flex;
        align-items: center;
        button {
          &:first-child {
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>
