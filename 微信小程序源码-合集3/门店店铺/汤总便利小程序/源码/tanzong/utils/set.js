/**
 * 所有用到的缓存字段  方便同一删除
 * */


/**
 * 缓存货架信息
 */
export function set_shelves_info(value){
  wx.setStorageSync('shelves_info', value)
}

/**
 * 缓存购物车信息
 */

export function set_shopCart(value) {
  wx.setStorageSync('shopCart', value)
}


/**
 * 缓存已提交的订单  即未确认的订单
 */

export function set_unconfirmed(value){
  wx.setStorageSync('unconfirmed', value)
}