//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  gobalancelist:function(){
    wx.navigateTo({
      url: "../balance_list/balance_list"
    })
  },
  gorecharge:function(){
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },
  gobuyrecord:function(){
    wx.navigateTo({
      url: '../buy_record/buy_record',
    })
  }
})
