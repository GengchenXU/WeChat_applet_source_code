var app = getApp()  
Page( {  
  data: {  
    avatarUrl: "",
    nickName: "",
    winWidth: ""
  },  
  onShow: function() {  
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth
        });
      }
    }); 
    that.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName
    })
  },
  sysConf: function(){
    wx.navigateTo({
      url: '../sys/sys'
    })
  },
  feedback: function(){
    wx.navigateTo({
      url: '../feedback/feedback'
    })
  }
}) 