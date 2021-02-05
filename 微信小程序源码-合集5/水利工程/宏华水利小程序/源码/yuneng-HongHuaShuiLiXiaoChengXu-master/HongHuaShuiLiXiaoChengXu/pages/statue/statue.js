//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  	
	},
	gorepair:function(){
  	wx.navigateTo({
      url: '../repair/repair'
    })
  }
})
