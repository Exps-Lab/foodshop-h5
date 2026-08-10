<template>
  <div class="coupon-page" v-loading="loading">
    <div class="couopn-show-box">
      <section class="banner">
        <p class="banner-title">官方补贴 好物直降</p>
      </section>

      <section class="section available-section">
        <div v-if="!validCoupon" class="empty-box">
          <van-empty description="暂无可用优惠券" />
        </div>
        <template v-else>
          <article class="coupon-card" :class="{ claimed: isClaimed }">
            <div class="left">
              <p class="price">
                <span class="symbol">¥</span>
                <span class="amount">{{ formatMoney(validCoupon.base_val) }}</span>
              </p>
            </div>
            <div class="right">
              <p class="coupon-title">{{ validCoupon.title }}</p>
              <p
                v-if="isClaimed"
                class="coupon-claimed-tag">已领取</p>
            </div>
          </article>
          <div class="btn-wrap">
            <button
              class="claim-btn"
              :class="{ breathing: !isClaimed, disabled: isClaimed }"
              :disabled="isClaimed || claiming"
              @click="handleClaim">
              {{ isClaimed ? '已领取，快去使用吧' : '立即领取' }}
            </button>
          </div>
        </template>
      </section>
    </div>

    <section class="section my-coupon-section">
      <p class="section-title">我的优惠券</p>
      <van-empty
        v-if="!myCoupons.length"
        description="暂无优惠券" />
      <template v-else>
        <article
          v-for="item in sortedMyCoupons"
          :key="item.coupon_id"
          class="my-coupon-item"
          :class="{ expired: !item.valid }">
          <div class="my-coupon-tag" v-if="!item.valid">已失效</div>
          <div class="my-coupon-tag urgent" v-else-if="isUrgent(item.valid_end)">快失效</div>
          <div class="left">
            <p class="price">
              <span class="symbol">¥</span>
              <span class="amount">{{ formatMoney(item.base_val) }}</span>
            </p>
            <p class="threshold">满{{ formatMoney(item.base_val + 0.01) }}元可用</p>
          </div>
          <div class="right">
            <p class="coupon-title">{{ item.title }}</p>
            <p class="coupon-desc">{{ formatExpire(item.valid_end) }}</p>
            <p class="coupon-meta">不仅仅限指定商家，所有品类都可用，快去试试吧！</p>
          </div>
        </article>
      </template>
    </section>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { Toast } from 'vant'
  import {
    claimCoupon,
    getUserCoupons,
    getShowValidCoupon
  } from '@api/coupon'

  // -------- State --------
  const loading = ref(true)
  const validCoupon = ref(null)
  const myCoupons = ref([])
  const claiming = ref(false)
  const claimedIds = ref(new Set())

  // 为"快失效"标签做定时刷新
  const urgentTick = ref(Date.now())
  let urgentTimer = null

  // -------- Derived --------
  const isClaimed = computed(() => {
    if (!validCoupon.value) return true
    return claimedIds.value.has(validCoupon.value.coupon_id)
  })

  const sortedMyCoupons = computed(() => {
    const validList = myCoupons.value.filter(c => c.valid)
      .sort((a, b) => a.valid_end - b.valid_end)
    const invalidList = myCoupons.value.filter(c => !c.valid)
      .sort((a, b) => b.valid_end - a.valid_end)
    return validList.concat(invalidList)
  })

  // -------- Utils --------
  const formatMoney = (val) => {
    if (val === undefined || val === null) return '0'
    const n = Number(val)
    if (Number.isNaN(n)) return '0'
    return Number.isInteger(n) ? String(n) : n.toFixed(2)
  }

  const formatExpire = (ts) => {
    if (!ts) return ''
    const endTime = new Date(ts).getTime()
    const remain = endTime - Date.now()
    if (remain <= 0) return ''
    const days = Math.floor(remain / (24 * 60 * 60 * 1000))
    if (days > 0) return `${days}天后失效，快去使用吧！`
    const hours = Math.floor(remain / (60 * 60 * 1000))
    if (hours > 0) return `有效期仅剩${hours}小时，快去使用吧！`
    const mins = Math.floor(remain / (60 * 1000))
    return `有效期仅剩${mins}分钟，快去使用吧！`
  }

  const URGENT_THRESHOLD = 2 * 24 * 60 * 60 * 1000 // 2 天内标记快失效
  const isUrgent = (ts) => {
    // 读取 tick 触发响应式依赖，避免视图不刷新
    const _tick = urgentTick.value // eslint-disable-line no-unused-vars
    const remain = Number(ts) - Date.now()
    return remain <= URGENT_THRESHOLD && remain > 0
  }

  // -------- Actions --------
  const handleClaim = async () => {
    if (!validCoupon.value || isClaimed.value || claiming.value) return
    claiming.value = true
    try {
      await claimCoupon({ coupon_id: validCoupon.value.coupon_id })
      claimedIds.value.add(validCoupon.value.coupon_id)
      myCoupons.value.unshift({
        ...validCoupon.value,
        valid: true
      })
      Toast.success('领取成功')
    } catch (err) {
      const msg = (err && err.data && err.data.msg) || '领取失败'
      Toast.fail(msg)
    } finally {
      claiming.value = false
    }
  }

  // -------- Lifecycle --------
  onMounted(async () => {
    document.title = '我的优惠券'
    urgentTimer = setInterval(() => {
      urgentTick.value = Date.now()
    }, 60 * 1000)

    try {
      const [validResult, listResult] = await Promise.allSettled([
        getShowValidCoupon(),
        getUserCoupons()
      ])

      if (validResult.status === 'fulfilled') {
        validCoupon.value = validResult.value.data || null
      } else {
        const msg = (validResult.reason?.data?.msg) || '加载可用优惠券失败'
        Toast.fail(msg)
      }

      if (listResult.status === 'fulfilled') {
        const userList = Array.isArray(listResult.value.data) ? listResult.value.data : []
        myCoupons.value = userList
        claimedIds.value = new Set(userList.map(c => c.coupon_id))
      } else {
        const msg = (listResult.reason?.data?.msg) || '加载优惠券列表失败'
        Toast.fail(msg)
      }
    } finally {
      loading.value = false
    }
  })

  onBeforeUnmount(() => {
    if (urgentTimer) {
      clearInterval(urgentTimer)
      urgentTimer = null
    }
  })
</script>

<style lang="less" scoped>
  @coupon-red: var(--van-red);
  @coupon-red-dark: var(--van-red-dark);
  @border-color: #EAEAEA;

  .coupon-page {
    min-height: 100vh;
    background: var(--van-gray-1);
  }

  .couopn-show-box {
    padding: 0 15px 30px;
    background: linear-gradient(180deg, @coupon-red 0%, @coupon-red 35%, transparent 100%);
  }

  .banner {
    padding: 40px 20px 30px;
    position: relative;

    .banner-title {
      text-align: center;
      color: #fff;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 2px;
      margin: 0;
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
  }

  .section {
    margin: 0 auto;

    .section-title {
      margin: 0 0 12px 4px;
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }
  }

  .empty-box {
    background: #fff;
    border-radius: 10px;
    padding: 20px 0;
  }

  /* ---------- Coupon Card (top) ---------- */
  .coupon-card {
    display: flex;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    margin: 0 25px;

    &.claimed {
      opacity: 0.75;
    }

    .left {
      width: 90px;
      flex-shrink: 0;
      background: linear-gradient(180deg, @coupon-red 0%, @coupon-red-dark 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        right: -6px;
        bottom: 0;
        transform: translateY(50%);
        width: 12px;
        height: 12px;
        background: @coupon-red;
        border-radius: 50%;
      }
      &::after {
        content: '';
        position: absolute;
        right: -6px;
        top: 0;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        background: @coupon-red;
        border-radius: 50%;
      }

      .price {
        margin: 0;
        line-height: 1;
        color: @coupon-red;
        display: flex;
        align-items: baseline;

        .symbol {
          font-size: 16px;
          vertical-align: top;
          margin-right: 2px;
          font-weight: bold;
        }
        .amount {
          font-size: 38px;
          font-weight: 700;
        }
      }
    }

    .right {
      flex: 1;
      padding: 14px 28px 14px 18px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      line-height: 1.2;

      .coupon-title {
        margin: 0 0 6px;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
      .coupon-desc {
        margin: 0;
        font-size: 12px;
        color: #999;
        color: @coupon-red;
        font-weight: 600;
      }
      .coupon-claimed-tag {
        position: absolute;
        top: 4px;
        right: 4px;
        font-size: 12px;
        color: @coupon-red;
        border: 1px solid @coupon-red;
        padding: 2px 8px;
        border-radius: 17px;
        font-weight: bold;
        margin: 0;
        transform: translate(30%, 0) rotate(45deg);
        transform-origin: center;
      }
    }
  }

  .btn-wrap {
    display: flex;
    justify-content: center;
    margin-top: 28px;
  }

  .claim-btn {
    appearance: none;
    border: none;
    outline: none;
    width: 90%;
    height: 50px;
    border-radius: 22px;
    background: linear-gradient(90deg, #f00 0%, @coupon-red 100%);
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
    box-shadow: 0 6px 16px rgba(255, 59, 48, 0.3);
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s, box-shadow 0.2s;

    &.breathing {
      animation: breathe 1s ease-in-out infinite;
    }

    &.disabled,
    &[disabled] {
      box-shadow: none;
      cursor: not-allowed;
      animation: none;
      opacity: 0.5;
    }

    &:active:not([disabled]):not(.disabled) {
      transform: translateY(1px);
    }
  }

  @keyframes breathe {
    0%, 100% {
      box-shadow: 0 6px 16px rgba(255, 59, 48, 0.25);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 10px 26px rgba(255, 59, 48, 0.5);
      transform: scale(1.03);
    }
  }

  /* ---------- My Coupon List (bottom) ---------- */
  .my-coupon-section {
    padding: 20px 20px 40px;
  }

  .my-coupon-item {
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    &::before {
      content: '';
      position: absolute;
      left: 100px;
      bottom: 0;
      transform: translateY(50%);
      width: 12px;
      height: 12px;
      background: var(--van-gray-1);
      border-radius: 50%;
    }
    &::after {
      content: '';
      position: absolute;
      left: 100px;
      top: 0;
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      background: var(--van-gray-1);
      border-radius: 50%;
    }

    &.expired {
      filter: grayscale(1);
      opacity: 0.6;
    }

    .my-coupon-tag {
      position: absolute;
      top: 6px;
      right: -22px;
      transform: rotate(45deg);
      background: @coupon-red;
      color: #fff;
      font-size: 10px;
      width: 80px;
      text-align: center;
      padding: 4px 0;
      z-index: 2;

      &.urgent {
        background: #FF8F1F;
      }
    }

    .left {
      width: 110px;
      flex-shrink: 0;
      background: linear-gradient(180deg, @coupon-red 0%, @coupon-red-dark 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 14px 0;

      .price {
        margin: 0;
        line-height: 1;
        text-align: center;
        color: @coupon-red;
        display: flex;
        align-items: baseline;

        .symbol {
          font-size: 24px;
          vertical-align: top;
          margin-right: 2px;
          font-weight: bold;
        }
        .amount {
          font-size: 40px;
          font-weight: 700;
        }
      }
      .threshold {
        margin: 8px 0 0;
        font-size: 11px;
        opacity: 0.9;
      }
    }

    .right {
      flex: 1;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      gap: 8px;

      .coupon-title {
        font-size: 15px;
        font-weight: 600;
        color: #333;
      }
      .coupon-desc {
        font-size: 12px;
        color: #999;
        color: @coupon-red;
        font-weight: 600;
      }
      .coupon-meta {
        margin: 0;
        font-size: 11px;
        color: #BBB;
        line-height: 1.2;
      }
    }
  }
</style>
