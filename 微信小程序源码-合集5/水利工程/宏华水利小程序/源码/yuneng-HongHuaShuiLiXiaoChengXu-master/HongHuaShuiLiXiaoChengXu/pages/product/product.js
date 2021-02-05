//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  	
	},
	godetail:function(){
  	wx.navigateTo({
      url: '../product_detail/product_detail'
    })
  }
})
