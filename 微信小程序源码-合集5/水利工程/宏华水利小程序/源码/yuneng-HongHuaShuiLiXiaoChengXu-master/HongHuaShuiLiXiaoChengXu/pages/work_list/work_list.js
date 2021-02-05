// pages/work_list/work_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabindex:1,
    contentActive:1,
    boxdata1: [
      { date: '2016-02-15', addr: '高新区福年广场T5', product: '鱼鹰4号金色版', user: '王先生', order: 'FDD25454545',remark: '这是客户备注'},
      { date: '2016-02-15', addr: '高新区福年广场T5', product: '鱼鹰4号金色版', user: '王先生', order: 'FDD25454545', remark: '这是客户备注'},
      { date: '2016-02-15', addr: '高新区福年广场T5', product: '鱼鹰4号金色版', user: '王先生', order: 'FDD25454545', remark: '这是客户备注'},
      { date: '2016-02-15', addr: '高新区福年广场T5', product: '鱼鹰4号金色版', user: '王先生', order: 'FDD25454545', remark: '这是客户备注'}
    ],
    boxdata2: [
      { date: '2016-02-15', addr: '高新区福年广场T5', parts: '滤芯部件',remark:'这是问题描述显示', user: '王先生', order: 'FDD25454545' },
      { date: '2016-02-15', addr: '高新区福年广场T5', parts: '滤芯部件', remark: '这是问题描述显示', user: '王先生', order: 'FDD25454545' },
      { date: '2016-02-15', addr: '高新区福年广场T5', parts: '滤芯部件', remark: '这是问题描述显示', user: '王先生', order: 'FDD25454545' }
    ],
    boxdata3: [
      { type: '1', date: '2016-02-15', addr: '高新区福年广场T5', parts: '滤芯部件', remark: '这是问题描述显示', user: '王先生', order: 'FDD25454545' },        { type: '2', date: '2016-02-15', addr: '高新区福年广场T5', parts: '滤芯部件', remark: '这是问题描述显示', user: '王先生', order: 'FDD25454545' }
    ]
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
  tapchange:function(event){
    var index = event.currentTarget.dataset.index;
    this.setData({
      tabindex: index,
      contentActive:index
    })
  },
  calltel:function(event){
    var tel = event.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  go_oveWork:function(){
    wx.navigateTo({
      url: '../over_work/over_work',
    })
  }
})