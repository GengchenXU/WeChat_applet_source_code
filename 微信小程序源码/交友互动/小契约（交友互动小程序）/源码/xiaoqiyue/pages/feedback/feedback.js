var app = getApp()  
Page( {  
  data: {
    formMsgHidden: true,
    disableBtn: false
  },  
  onShow: function() {  
  },
  formSubmit: function (event) {
    app.collectFormId(event.detail.formId)
    var that = this
    var data = event.detail.value;
    if (data.content.trim().length == 0){
      that.setData({
        formMsgHidden: false,
      })
    } else {
      that.setData({
        disableBtn: true
      })
      wx.request({
        url: app.globalData.urlHeader + '/api/v1/feedback/create',
        data: {
          "userKey": app.globalData.openid,
          "userName": app.globalData.userInfo.nickName,
          "userIcon": app.globalData.userInfo.avatarUrl,
          "content": data.content
        },
        method: 'POST',
        success: function (res) {
          if (res.statusCode == 200) {
            wx.showToast({
              title: '谢谢您的反馈',
              icon: 'success',
              mask: true,
              duration: 1500
            })
            back()
          }
        },
        complete: function(){
          that.setData({
            disableBtn: false
          })
        }
      })
    }
    
  },
  hiddenFromMsg: function () {
    this.setData({
      formMsgHidden: true
    })
  }
})
function back(){
  setTimeout(function(){
    wx.switchTab({
      url: '../me/me',
    })
  }, 1500)
}