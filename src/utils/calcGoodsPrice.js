import { priceHandle } from './index'

/**
 * 处理商品卡片的价格展示
 * 返回两种价格模式：计算优惠后(showPrice) 计算优惠总价(showPriceTotal) 和 原始价格(originPrice)
 * @param type
 * @param food
 * @returns {number|string|string}
 */
const getShowPrice = (type, food) => {
  const { discount_val, is_discount, count, choseSpecIndex = 0, specfoods } = food
  const { price } = specfoods[choseSpecIndex]

  const originPrice = priceHandle(price)
  if (type === 'originPrice') {
    return originPrice
  } else {
    const resPrice = is_discount
      ? discount_val > 0 ? priceHandle(price * (discount_val / 10)) : '0'
      : priceHandle(price)

    if (type === 'showPrice') {
      return resPrice
    } else if (type === 'showPriceTotal') {
      return priceHandle(count * Number(resPrice))
    } else {
      return '暂时不支持此参数'
    }
  }
}

/**
 * 所有选择商品包装费用
 * @param choseGoods
 * @returns {*}
 */
const calcTotalBagFee = (choseGoods = []) => {
  return choseGoods.reduce((total, goods) => {
    const { specfoods, count, choseSpecIndex } = goods
    total += (specfoods[choseSpecIndex].packing_fee * count)
    return total
  }, 0)
}

/**
 * 本次共选择需要支付金额
 * @param choseGoodsData
 * @param shopInfo
 * @returns {{payPrice: number, goodsPrice: number}}
 */
const orderTotalNeedPay = (choseGoodsData = [], shopInfo = {}) => {
  // 商品价格
  const price = choseGoodsData.reduce((categoryPrice, goods) => {
    const nowGoodsPrice = Number(getShowPrice('showPriceTotal', goods))
    categoryPrice += nowGoodsPrice
    return categoryPrice
  }, 0)
  // 商品包装费
  const bagPrice = calcTotalBagFee(choseGoodsData)
  // 纯商品相关价格结算
  const goodsPriceTotal = Number(priceHandle(price + bagPrice))

  // 处理店铺相关
  const { delivery_fee } = shopInfo
  const { price: discount_price } = getDiscountInfo(shopInfo, goodsPriceTotal)

  // 详情页显示商品和满减的总价
  const detailTotal = Number(priceHandle(goodsPriceTotal - discount_price))
  // 本次操作总价结算
  const payTotal = Number(priceHandle(goodsPriceTotal + delivery_fee - discount_price))
  return {
    goodsPrice: goodsPriceTotal,
    detailPrice: detailTotal,
    payPrice: payTotal
  }
}

/**
 * 计算满减值和对应展示文案:
 * 不够第一档：   满x减x(第一档),还差x元
 * 下一档还能减:  已享满x减x(上一档),再买x元再减x元(下一档)
 * 全部都减了：   已享商品优惠x元(最高档)
 * @param { $ObjMap } shopBaseInfo
 * @param { number} nowChosePrice
 * @returns {{price: number, tipText: string}}
 */
const getDiscountInfo = (shopBaseInfo, nowChosePrice) => {
  const { has_discount, discount_Arr } = shopBaseInfo
  const resObj = {
    price: 0,
    tipText: ''
  }
  if (!has_discount) return resObj
  for (const [index, discountConf] of discount_Arr.entries()) {
    const { total_val, discount_val } = discountConf
    if (nowChosePrice < total_val) {
      const minusPrice = priceHandle(total_val - nowChosePrice)
      if (index === 0) {
        resObj.tipText = `满${total_val}减${discount_val}，还差${minusPrice}元`
        break
      } else {
        // [note] 上一区间值
        const { total_val: pre_total_val, discount_val: pre_discount_val } = discount_Arr[index - 1]
        const discountMinus = priceHandle(discount_val - pre_discount_val)
        resObj.tipText = `已享满${pre_total_val}减${pre_discount_val}，再买${minusPrice}元再减${discountMinus}元`
        resObj.price = pre_discount_val
        break
      }
    } else {
      resObj.tipText = `已享商品优惠${discount_val}元`
      resObj.price = discount_val
    }
  }
  return resObj
}

export {
  getShowPrice,
  calcTotalBagFee,
  orderTotalNeedPay,
  getDiscountInfo
}
