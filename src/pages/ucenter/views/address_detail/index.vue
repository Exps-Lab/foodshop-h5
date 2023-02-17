<template>
  <section class="main">
    <section class="map-box">
      <ShowPosInMap :posStr="form.pos" :mapSetting="mapSetting" :markerSetting="markerSetting" />
    </section>
    <section class="form-box">
      <van-form @submit="onSubmit" label-width="45">
        <van-cell-group inset>
          <van-field
            label="地址"
            readonly
            @click="choseAddress"
            right-icon="arrow"
            model-value="请选择收货地址" />
          <van-field
            v-model="form.room"
            label="门牌号"
            clearable
            placeholder="请填写详细地址，具体到门牌号" />
          <van-field v-model="form.receive" label="收货人" placeholder="请填写收货人" clearable>
            <template #button>
              <van-radio-group v-model="form.gender" direction="horizontal">
                <van-radio name="0">先生</van-radio>
                <van-radio name="1">女士</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            v-model="form.phone"
            label="手机号"
            maxlength="11"
            type="tel"
            clearable
            placeholder="请填写收货人手机号"/>
          <van-field v-model="form.tag" label="标签">
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
        <div style="margin: 30px;">
          <van-button round block type="primary" native-type="submit">保存</van-button>
        </div>
      </van-form>
    </section>
  </section>
</template>

<script setup>
  import { reactive } from 'vue'
  import { diffModuleJump } from '@utils'
  import ShowPosInMap from '@components/Show_Pos_in_Map/index.vue'

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

  // 点击跳转选择地址页面
  const choseAddress = () => {
    diffModuleJump('/roiPicker', 'from=address', 'home')
  }

  // 选择tag
  // [note] 逻辑: 可以取消的CheckBox
  const chooseTag = tag => {
    const { text } = tag
    addressTagMap.forEach((tagItem) => {
      if (tagItem.text !== text) {
        tagItem.isChose = false
      } else {
        tagItem.isChose = !tagItem.isChose
      }
    })
  }

  // 地址保存
  const onSubmit = e => {
    console.log(e)
  }
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
      &:deep(#van-field-1-input) {
        color: @brand1-6;
        font-weight: bold;
      }
      &:deep(.van-radio__icon) {
        height: auto;
        .van-badge__wrapper {
          width: 16px;
          height: 16px;
          line-height: 1;
        }
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
    }
  }
</style>
