<!-- 评论卡片 -->

<template>
  <section class="comment-box">
    <section class="comment-list" v-for="(comment, index) in cardData" :key="index">
      <section class="header">
        <img class="user-avatar" :src="comment.user_avatar || userInfo.avatar" alt="userAvatar" />
        <section class="comment-mes">
          <p class="user-name font-bold-weight">{{comment.user_name}}</p>
          <p class="comment-time">{{comment.comment_time}}</p>
        </section>
      </section>
      <section class="ranks-box">
        <p class="ranks-item" v-for="(rank, index) in comment.ranks" :key="index">
          <span class="rank-text">{{rank.name}}</span>
          <van-rate class="rank-com" v-if="index === 0" v-model="rank.ranks" readonly void-icon="star" />
          <span class="rank-text" v-else>{{rank.ranks}}星</span>
        </p>
      </section>
      <p class="comment-msg">{{comment.comment_msg}}</p>
      <section class="comment-img">
        <section class="comment-img-item" v-for="(imgUrl, index) in comment.comment_img" :key="index">
          <ImgPreview :imgUrl="imgUrl" />
        </section>
      </section>
      <section class="comment-skus">
        <section class="com-container" v-if="getCommentSku(comment).good.length">
          <p class="title font-bold-weight">TA的点赞:</p>
          <section class="sku-box">
            <p
              class="sku-item"
              v-for="(name, index) in getCommentSku(comment).good"
              :key="index">
              {{name}}
            </p>
          </section>
        </section>
        <section class="com-container" v-if="getCommentSku(comment).bad.length">
          <p class="title font-bold-weight">TA踩的坑:</p>
          <section class="sku-box">
            <p
              class="sku-item bad"
              v-for="(name, index) in getCommentSku(comment).bad"
              :key="index">
              {{name}}
            </p>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>

<script setup>
  import { useUserInfo } from '@common/hooks/userInfo'
  import ImgPreview from '@/common/components/Img_Preview/index.vue'
  import { reactive } from 'vue'

  defineProps({
    cardData: {
      type: Object,
      default: () => {}
    }
  })

  const { userData } = useUserInfo()
  const userInfo = reactive(userData)

  const getCommentSku = (comment) => {
    const resObj = {
      good: [],
      bad: []
    }
    if (comment.comment_id !== null) {
      const { comment_skus, goods_list } = comment
      goods_list.forEach(goods => {
        const { id, name, specfoods, choseSpecIndex } = goods
        const key = `${id}-${choseSpecIndex}`
        Object.keys(comment_skus[0]).forEach(obj => {
          if (obj === key) {
            const showName = `${name}-${specfoods[choseSpecIndex].name}`
            comment_skus[0][key] === 1
              ? resObj.good.push(showName)
              : resObj.bad.push(showName)
          }
        })
      })
    }
    return resObj
  }

</script>

<style lang="less" scoped>
  .comment-box {
    .comment-list {
      background-color: #fff;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 10px;
      .header {
        display: flex;
        align-items: center;
        .user-avatar {
          height: 40px;
          width: 40px;
          border-radius: 50%;
        }
        .comment-mes {
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          .user-name {
            font-size: 14px;
          }
          .comment-time {
            color: @text-3;
            font-size: 12px;
            margin-top: 4px;
          }
        }
      }
      .ranks-box {
        display: flex;
        align-items: center;
        margin-top: 14px;
        .ranks-item {
          margin-right: 10px;
          .rank-com {
            :deep(.van-rate__icon) {
              font-size: 12px;
            }
          }
          .rank-text {
            color: @text-3;
            font-size: 12px;
          }
        }
      }
      .comment-msg {
        margin-top: 10px;
        font-size: 14px;
        line-height: 1.3;
      }
      .comment-img {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 10px;
        .comment-img-item {
          width: 140px;
          height: 140px;
          border-radius: 8px;
          margin: 0 10px 10px 0;
        }
      }
      .comment-skus {
        .com-container {
          margin-top: 10px;
          .sku-box {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .sku-item {
              padding: 6px 8px;
              border-radius: 4px;
              background-color: @brand1-1;
              color: @brand1-6;
              margin: 6px 6px 0 0;
              line-height: 1.3;
              &.bad {
                background-color: @fill-3;
                color: @text-3;
              }
            }
          }
        }
      }
    }
  }
</style>
