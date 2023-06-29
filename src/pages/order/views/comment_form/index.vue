<!-- 订单评论表单 -->

<template>
  <div class="main">
    <van-form @submit="onFormSubmit" label-width="60px">
      <section class="address-com-box">
        <section class="shop-box">
          <img class="shop-avatar" :src="shopData.shop_image?.avatar" alt="shopImg">
          <span class="shop-title van-ellipsis">{{shopData.name}}</span>
        </section>
        <van-field
          name="rate"
          v-for="(item, index) in commentForm.ranks"
          :key="index"
          :label="item.name">
          <template #input>
            <van-rate v-model="item.value" void-icon="star" />
            <span class="rank-text font-bold-weight">{{rankTextMap[item.value]}}</span>
          </template>
        </van-field>
        <van-field
          v-model="commentForm.commentMsg"
          rows="8"
          autosize
          type="textarea"
          maxlength="150"
          placeholder="亲，可以从菜品口味、环境、服务等方面分享用餐感受哦~"
          show-word-limit
        />
      </section>
      <section class="address-com-box">
        <p class="title">图片上传:</p>
        <ImageUpload :maxCount="3" @imgUploadFinish="imgUploadFinish" v-model="commentForm.commentImg" />
      </section>
      <section class="address-com-box">
        <p class="title">商品评价:</p>
        <section class="goods-box">
          <section class="goods-item" v-for="item in choseGoodsData" :key="item.id">
            <section class="goods-info">
              <img class="goods-img" :src="item.image_path" alt="goods-img" />
              <p class="goods-name text-ellipsis">
                {{item.name}}
                <span class="spec">{{item.specfoods[item.choseSpecIndex].name}}</span>
              </p>
            </section>
            <section class="comment-box">
              <span class="comment-item" @click="toggleComment(item, 'bad')">
                <van-icon
                  class="com-icon reverse"
                  :name="commentForm.recommendGoodIds[`${item.id}-${item.choseSpecIndex}`] === 0 ? 'good-job' : 'good-job-o'" />踩
              </span>
              <span class="comment-item good" @click="toggleComment(item, 'good')">
                <van-icon
                  class="com-icon"
                  :name="commentForm.recommendGoodIds[`${item.id}-${item.choseSpecIndex}`] === 1 ? 'good-job' : 'good-job-o'" />赞
              </span>
            </section>
          </section>
        </section>
      </section>
      <van-button round block type="primary" class="submit-btn" native-type="submit">提交</van-button>
    </van-form>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { getOrderDetail } from '@/api/order'
  import { useOrderInfo } from '@pages/order/hooks/orderInfo'
  import ImageUpload from '@components/Img_Upload/index.vue'
  const route = useRoute()

  const choseGoodsData = computed(() => orderInfo.value.goods_list || [])
  const shopData = computed(() => orderInfo.value.shopDetail || {})

  const rankTextMap = ['', '非常差', '较差', '一般', '比较满意', '非常满意']
  const commentForm = reactive({
    ranks: [{
      name: '满意度',
      ranks: 0
    }, {
      name: '包装',
      ranks: 0
    }, {
      name: '质量',
      ranks: 0
    }],
    commentMsg: '',
    commentImg: [],
    // 点赞的商品记录 goodId和specId组合记录'1-2'
    recommendGoodIds: {}
  })
  const imgUploadFinish = (url) => {
    commentForm.commentImg.push(url)
  }
  // 处理商品点赞
  const toggleComment = (goods, type) => {
    const { id, choseSpecIndex } = goods
    const padId = `${id}-${choseSpecIndex}`
    const value = (type === 'good' ? 1 : 0)
    const tempId = commentForm.recommendGoodIds[padId]
    if ((tempId === 1 && value === 1) || (tempId === 0 && value === 0)) {
      delete commentForm.recommendGoodIds[padId]
    } else {
      commentForm.recommendGoodIds[padId] = value
    }
  }

  const onFormSubmit = () => {
    console.log(commentForm)
  }

  const orderInfo = ref({})
  const { handleErr } = useOrderInfo()
  // 获取订单详情
  const preGetOrderDetail = async () => {
    const orderNum = route.query.orderNum
    try {
      const { data } = await getOrderDetail({ orderNum })
      orderInfo.value = data
    } catch (err) {
      handleErr(err)
    }
  }

  const init = async () => {
    await preGetOrderDetail()
  }
  init()
</script>

<style lang="less" scoped>
  .main {
    min-height: 100vh;
    background: var(--van-gray-1);
    padding: 20px;
    box-sizing: border-box;
    .address-com-box {
      margin-bottom: 10px;
      overflow: hidden;
      border-radius: 6px;
      background-color: #fff;
      padding: 15px 10px;
      img {
        object-fit: cover;
        max-width: 100%;
        display: block;
      }
      .title {
        font-size: 14px;
        padding-bottom: 10px;
      }
      .shop-box {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .shop-avatar {
          font-size: 14px;
          width: 35px;
          height: 35px;
          border-radius: 4px;
          border: 1px solid #eee;
        }
        .shop-title {
          margin-left: 6px;
        }
      }
      :deep(.van-rate) {
        .van-rate__item {
          padding-right: 10px;
        }
      }
      .rank-text {
        margin-left: 10px;
        font-size: 12px;
        color: @text-3;
      }
      .goods-box {
        margin-top: 10px;
        .goods-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .goods-info {
            display: flex;
            align-items: center;
            border-radius: 6px;
            padding: 2px 4px;
            background-color: @fill-2;
            .goods-img {
              height: 30px;
              width: 30px;
            }
            .goods-name {
              margin-left: 10px;
              width: 180px;
              max-width: 180px;
              .spec {
                margin-left: 6px;
              }
            }
          }
          .comment-box {
            display: flex;
            align-items: center;
            .comment-item {
              margin-left: 8px;
              font-size: 13px;
              &.good {
                color: @error-7;
              }
              .com-icon {
                margin-right: 4px;
                font-size: 16px;
                &.reverse {
                  transform: rotate(180deg) translateY(-1px);
                  transform-origin: center;
                }
              }
            }
          }
        }
      }
    }
    .submit-btn {
      margin-top: 30px;
    }
  }
</style>
