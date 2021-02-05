// pages/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:0,//默认选中第一个
    numArray:[10, 20, 30, 40, 50, 60, 70, 80, 90]
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
  activethis:function(event){//点击选中事件
      var thisindex = event.currentTarget.dataset.thisindex;//当前index
      this.setData({
        activeIndex:thisindex
      })
  }

})