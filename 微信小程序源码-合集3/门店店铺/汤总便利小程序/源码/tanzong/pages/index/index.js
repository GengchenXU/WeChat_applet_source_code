//index.js
//获取应用实例
const app = getApp()
import news from '../../api/new';
import { shelves, shelves_product} from  '../../api/index';
import { set_shelves_info, set_shopCart } from '../../utils/set';
import {
  showToast,isJSON
} from '../../utils/util'
Page({
  data: {
    shelves_info:{name:''},     //货架信息
    newsList: news || []   //新闻列表
  },
  //事件处理函数
  bindViewTap: function() {
    
  },
  onLoad: function () {
    console.log(app.globalData.userInfo)
    this.onShow();
  },
  onShow(){
  this.setData({
    shelves_info: wx.getStorageSync('shelves_info') || { name: '' }
  })
  },
  // 控件处理程序
  controltap() {
    // 二维码控件处理
      wx.scanCode({
        success: (res) => {
          //返回是否是既定格式
          if (!res.result || !isJSON(res.result) ){
            showToast('无效的二维码')     
            return;
          }
          //获得二维码上面的信息
          const info = JSON.parse(res.result)
          if (info.type=="shelves"){
             //扫描的是货架信息
            let shelves_no = info.data; 
            console.log(shelves_no)
            this.getShelcesInfo(shelves_no);
            
          } else if (info.type == "product"){
            //扫描的是商品
            let product_no = info.data; 
            this.get_shelves_product(product_no);
          
          }
           
        },
        fail: (res) => {           
        }
      })
  },
   /**
   * 获得货架信息
   */
  getShelcesInfo(shelves_no){
    const where={
      shelves_no
    }
    shelves({ data: { where: JSON.stringify(where)}}).then((res)=>{
      //缓存货架信息
      if (!this.is_identical_shelves(res.data.list[0].id)) {
        wx.removeStorage({
          key: 'shopCart',

        })
      }
      this.setData({
        shelves_info: res.data.list[0]
      })
      set_shelves_info(res.data.list[0])
    });
    
   
  },
  /**
   * 获得商品信息
   */
  get_shelves_product(product_no){
   
   
    shelves_product({ data: { product_no}}).then(res=>{
      console.log(22222)
      if (!this.is_identical_shelves(res.data.list[0].shelves_id)) {
        wx.removeStorage({
          key: 'shopCart',
        })
        
      }
      //获得货架信息

          const where = {
            id: res.data.list[0].shelves_id
          }
          console.log(where)
     
        shelves({ data: { where: JSON.stringify(where) } }).then((res1) => {
          this.setData({
            shelves_info: res1.data.list[0]
          })
           set_shelves_info(res1.data.list[0])
        });

        //获取购物车内的商品
        const shopCart = wx.getStorageSync('shopCart') || [];
        let i = shopCart.findIndex((value, index, arry) => {
          return value.id == res.data.list[0].id
        })
        if (i >= 0) {
          shopCart[i].num += 1

        } else {
          shopCart.push(Object.assign({}, res.data.list[0], { num: 1 }));
        }
        set_shopCart(shopCart);
        wx.showToast({
          title: '扫码成功',
          icon: 'success',
          duration: 2000,
          success: () => {
     
            wx.switchTab({
              url: '/pages/shoppingCart/index'
            })
          }
        })
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //判断扫码的得到的货架 与本地存储的货架是不是同一个货架
  is_identical_shelves(id) {
    let shelves_id = wx.getStorageSync('shelves_info').id || '';
    if (id == shelves_id) return true;
    return false;
  }
})
