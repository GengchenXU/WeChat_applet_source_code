
const config = require('../config.js');
const Promise = require('../utils/es6-promise').Promise;
const wxRequest = (params, url) => {
  const data = params.data || {};
  return new Promise((resolve, reject) => {
      wx.request({
        url,
        method: params.method || 'GET',
        data: Object.assign({}, data, { aid: config.aid }),
        header: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token': wx.getStorageSync('token') || {}
        },
        success(res) {
          if (res.data.status==401){
              wx.removeStorageSync('token');
              wx.removeStorageSync('shelves_id');
              wx.navigateTo({
                url: '/pages/index/index',
              })
          }else{
            resolve(res.data);
          }
        },
        fail(res) {
          reject(res)
        },
        complete(res) {
          resolve(res)
        }
      });
  })
};

const search = (params) => {
  return new Promise((resolve, reject) => {
    resolve(wxRequest(params, `${config.apiUrl}/search`));
  })
  
};

const getUserInfoById = (params) => {
 
  return new Promise((resolve, reject) => {
    resolve(wxRequest({ success: params.success }, `${config.apiUrl}/user/${params.data.userId}`));
  })
};

/**
 *  获取货架列表
 *  带上 where 条件克查询
 */
const shelves=(params)=>{
  return new Promise((resolve, reject) => {
    resolve(wxRequest(params, `${config.apiUrl}/shelves`));
  })
 
}

/**
 *  获取商品列表
 *  带上 where 条件克查询
 */

const product = (params) => {
  return new Promise((resolve, reject) => {
    resolve(wxRequest(params, `${config.apiUrl}/product`));
  })
}


/**
 *  获取货架商品列表
 *  
 */

const shelves_product = (params) => {
  return new Promise((resolve, reject) => {
    resolve(wxRequest(params, `${config.apiUrl}/shelves_product`));
  })
}

/**
 * 获得货架商品详情
 */
const shelves_product_detail = (params,id) => {
  return new Promise((resolve, reject) => {
    resolve(wxRequest(params, `${config.apiUrl}/shelves_product/${id}`));
  })
}


/**
 * 添加订单
 * post
 */

const add_order = (params)=>{
  params.method= params.method || 'post';
  return new Promise((resolve, reject) => {
    resolve(wxRequest(params, `${config.apiUrl}/order`));
  })
}

/**
 * 获得订单详情
 */
const order_detail = (params, id) => {
  return new Promise((resolve, reject) => {
    resolve(wxRequest(params, `${config.apiUrl}/order/${id}`));
  })
}

/**
 * 获得订单列表
 */

const order =(params)=>{
  return new Promise((resolve, reject) => {
    resolve(wxRequest(params, `${config.apiUrl}/order`));
  })
}

/**
 * 微信支付
 */
const payorder =(params)=>{
  return new Promise((resolve, reject) => {
    resolve(wxRequest(params, `${config.apiUrl}/wx_pay`));
  })
}
module.exports = {
  search,
  getUserInfoById,
  product,
  shelves,
  shelves_product,
  shelves_product_detail,
  add_order,
  order_detail,
  order,
  payorder

};
