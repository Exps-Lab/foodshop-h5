import { createFallAnimate } from '@utils'

// 按照惯例，组合式函数名以“use”开头
export function useShopDetail () {
  /**
   * 处理商品详情页购买动画
   * @param e 起始点点击事件
   * @param afterFn 动画之后逻辑
   */
  const handleBuyAnimate = (e, afterFn) => {
    const clickEle = e.target.getBoundingClientRect()
    const startPoint = {
      left: e.clientX - clickEle.width / 2 + 'px',
      top: e.clientY - clickEle.height / 2 + 'px'
    }
    const endPoint = {
      left: '',
      top: ''
    }
    const target = document.querySelector('.icon-box')
    endPoint.left = target.offsetLeft - target.getBoundingClientRect().width / 2 + 'px'
    endPoint.top = document.documentElement.clientHeight - 15 + 'px'
    createFallAnimate(startPoint, endPoint, afterFn)
  }

  return {
    handleBuyAnimate
  }
}
