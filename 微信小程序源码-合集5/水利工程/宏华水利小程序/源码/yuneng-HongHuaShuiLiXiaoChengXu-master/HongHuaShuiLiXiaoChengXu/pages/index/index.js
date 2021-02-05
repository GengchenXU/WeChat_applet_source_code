//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  gostatue: function() {
    wx.navigateTo({
      url: '../statue/statue'
    })
  },
  gorepair:function(){
  	wx.navigateTo({
      url: '../repair/repair'
    })
  },
  gologin:function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  onLoad: function () {
  	
  	wx.getUserInfo({
  		withCredentials:true,
		  success: function(res) {
		    var userInfo = res.userInfo
		    var nickName = userInfo.nickName
		    var avatarUrl = userInfo.avatarUrl
		    var gender = userInfo.gender //性别 0：未知、1：男、2：女
		    var province = userInfo.province
		    var city = userInfo.city
		    var country = userInfo.country
		    console.log(res)
		  }
		})
  },
  showModal:function(event){
  	console.log(event)
  	wx.showModal({
		  title: '操作提醒',
		  content: event.currentTarget.dataset.title,
		  success: function(res) {
		    if (res.confirm) {
		      console.log('用户点击确定')
		    } else if (res.cancel) {
		      console.log('用户点击取消')
		    }
		  }
		})
  }//showModal
})
