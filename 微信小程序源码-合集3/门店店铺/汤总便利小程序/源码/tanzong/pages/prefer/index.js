// pages/prefer/index.js
import { shelves_product}  from  '../../api/index';
import { showToast } from  '../../utils/util.js' 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shelves_id: '',     //货架信息
    query:{
      shelves_id:'',
      is_recommend:1,
      offset:0,
      limit:5
    },
    count:0,
    productList:[],
    height: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
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
    this.setData({
      shelves_id: wx.getStorageSync('shelves_info').id || '',
      height: wx.getSystemInfoSync().windowHeight
    })
    this.getData();
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
  console.log(4111)
    this.setData({
      query:{
        shelves_id: wx.getStorageSync('shelves_info').id || '',
        is_recommend: 1,
        offset: 0,
        limit: 10
      }
      
    })
    //console.log(wx.getStorageSync('shelves_info').id, this.data.query.shelves_id)
    if (!this.data.query.shelves_id){
        return;
    } 
    showToast('加载中...')
    shelves_product({ data: this.data.query}).then(res=>{
      console.log(res.data.list)
         this.setData({
           productList: res.data.list,
           count: res.data.count
         })
     wx.hideLoading()
    })
  },
  upper: function () {
    wx.showNavigationBarLoading()
    this.refresh();
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  },
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
    console.log("lower")
  },
  refresh: function () {
    showToast('正在刷新')
    this.getData();
  },

  //实现继续加载效果
  nextLoad: function () {
    showToast('加载中');
    if ((this.data.count - (this.data.query.offset + this.data.query.limit) )/ this.data.query.limit <= 0) {

      showToast('没有更多了');
      return;
    }
    console.log(this.data.query.offset ,this.data.query.limit)
    this.setData({
      query:{
        //shelves_id: wx.getStorageSync('shelves_info').id || '',
        //is_recommend: 1,
        offset: this.data.query.offset + this.data.query.limit,
        limit: 10
      }
    })
    shelves_product({ data: this.data.query }).then(res => {
      this.setData({
        productList: this.data.productList.concat(res.data.list) ,
        count: res.data.count
      })
      wx.hideLoading()
    })

    
  },

})