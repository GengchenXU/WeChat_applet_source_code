// pages/mine/order.js
const app=getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
import { order,shelves } from '../../api/index.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["待付款", "已完成"],
    activeIndex:0,
    sliderOffset: 0,
    sliderLeft: 0,
    list1:[],
    list2: [],
    limit:10,
    offset:0,
    refreshing:false,
    height: ""
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          height: res.windowHeight
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      height: wx.getSystemInfoSync().windowHeight
   
    });
   
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  /**
   * 获得所有订单
   */
  getData(){
    const where = {
      uid: app.globalData.userInfo.id

    }
   // where: JSON.stringify(where)
    order({
      data: {
        where: JSON.stringify(where), 
        limit: this.data.limit,
        offset: this.data.offset }
    }).then(res=>{
      let list = res.data.list,list1=[],list2=[];
      if (res.data.list.length==0) return;
      for(let i=0; i< list.length; i++){
        shelves({ data: { where: JSON.stringify({ id:  list[i].shelves_id})}}).then(res=>{
            list[i].shelves_name=res.data.list[0].name;
            if (list[i].status==101){
              list1.push(list[i])
            }else{
              list2.push(list[i])
            }
            if (i == list.length-1){
              this.setData({
                list1: list1,
                list2: list2
              })

            }
           
        })
      }
    })
  },

  onRefresh() {
    console.log(121212)
    if (this.data.refreshing) return;
    wx.showToast({
      title: '正在刷新...',
      icon: 'loading',
      duration: 2000
    });
    this.setData({ refreshing: true });
    this.setData({
      offset: 0,
      refreshing: false,
    })
    this.getData();

  },

  loadMore(e) {
    // if ((this.data.count - (this.data.query.offset + this.data.query.limit)) / this.data.query.limit <= 0) {
    //   return;
    // }
    // this.setData({
    //   offset: this.data.query.offset + this.data.query.limit,
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  
  }
})