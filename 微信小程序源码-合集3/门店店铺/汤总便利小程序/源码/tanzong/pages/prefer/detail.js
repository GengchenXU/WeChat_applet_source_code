// pages/prefer/detail.js
import { shelves_product_detail, shelves_product,add_order} from '../../api/index.js';
import { set_shopCart, set_unconfirmed} from '../../utils/set.js'



Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: ['https://pic1.zhimg.com/v2-984e5b824cfddb1de17edadb342b38dc.jpg', 'http://pic.58pic.com/58pic/14/27/45/71r58PICmDM_1024.jpg', 'http://img1.imgtn.bdimg.com/it/u=66250564,3253305393&fm=21&gp=0.jpg'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 3000,
    duration: 1200,
    goods:{},
    goodslist:[],
    shopNum:0,
    id:"",
    buyNumber:1,
    buyNumMax:30,   //手动设置哥最大购买 10
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getData();
    this.getshopNum();
  },
  //计算购物车商品件数
  getshopNum(){
    const shopCart = wx.getStorageSync('shopCart') || [];
    let shopNum=0;
    if (shopCart.length<=0)return;
    shopCart.forEach((value,index,arr)=>{
      this.setData({
        shopNum: shopNum + value.num
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getData(){
    shelves_product_detail({data:{}},this.data.id).then(res=>{
      this.setData(
        {
          goods: res.data
        }
      )
    }).then(shelves_product({ data: { shelves_id: wx.getStorageSync('shelves_info').id || '',limit:100}}).then(res1=>{
      this.setData(
        {
          goodslist: res1.data.list
        }
      )
    }))
   
  },
  addCart() {
    //获取购物车内的商品
    const shopCart=wx.getStorageSync('shopCart') || [];
    let i = shopCart.findIndex((value,index,arry)=>{
      return value.id == this.data.id
    })
    if (i>=0){
      shopCart[i].num += this.data.buyNumber

    }else{
      shopCart.push(Object.assign({}, this.data.goods, { num: this.data.buyNumber}));
    }
    set_shopCart(shopCart);
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000,
    })
    this.getshopNum();
    
  },
  goShopCart() {
 
    wx.switchTab({
      url: '/pages/shoppingCart/index'
    })
  },
  playOrder(){
    let order_list = [Object.assign({}, this.data.goods, { num: this.data.buyNumber })];
    set_unconfirmed(order_list)
    wx.navigateTo({
      url: '/pages/shoppingCart/submitOrder',
    })
  
  },
  numJianTap: function () {
    if (this.data.buyNumber > 1) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap: function () {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  goOtherGoods(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/prefer/detail?id=${e.currentTarget.dataset.id}`
    })

  }
})