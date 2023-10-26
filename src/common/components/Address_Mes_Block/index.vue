<template>
  <section class="address-mes-block" @click="handelAddressClick">
    <section class="edit-icon">
      <slot name="iconBtn"></slot>
    </section>
    <section v-if="hasAddress">
      <p class="msg-box">
        <span class="tag" v-if="address.tag">{{address.tag}}</span>
        <span class="title font-bold-weight text-ellipsis">{{address.title}} {{address.room}}</span>
      </p>
      <p class="msg-box">
        <span class="name sub-text">{{receivePadStr}}</span>
        <span class="tel sub-text">{{address.phone}}</span>
      </p>
    </section>
    <p v-else class="default-text">请选择收货地址</p>
  </section>
</template>

<script setup>
  import { computed } from 'vue'
  const emit = defineEmits(['addressClick'])

  const props = defineProps({
    address: {
      type: Object,
      default: () => {}
    }
  })

  const receivePadStr = computed(() => {
    const { receive, gender } = props.address
    return `${receive} (${getGenderText(gender)})`
  })

  // 是否已有地址
  const hasAddress = computed(() => {
    return Boolean(props.address.id)
  })
  const getGenderText = (gender) => {
    const genderMap = {
      0: '先生',
      1: '女士'
    }
    return genderMap[gender]
  }

  const handelAddressClick = () => {
    emit('addressClick', props.address)
  }

</script>

<style lang="less" scoped>
  .address-mes-block {
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
    .default-text {
      font-size: 14px;
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
</style>
