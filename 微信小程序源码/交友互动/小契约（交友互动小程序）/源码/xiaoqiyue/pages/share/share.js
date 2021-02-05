var app = getApp()  
Page({  
  data: {
    id:""
  },  
  onLoad: function(option) {  
    this.setData({
      id: option.id
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '小契约-拉钩邀请',
      path: '/pages/home/home?id=' + this.data.id + '&inviteUser=' + app.globalData.userInfo.nickName + '&toPage=agree',
      imageUrl: '../../images/product.png',
      success: function (res) {
        // 转发成功
        wx.switchTab({
          url: '../msg/msg'
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})  
