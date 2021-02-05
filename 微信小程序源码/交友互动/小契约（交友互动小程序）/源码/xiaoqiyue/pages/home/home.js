//获取应用实例
var app = getApp()
Page({
  onLoad: function (option) {
      app.getUserInfo()
      var toPage = option.toPage
      if (toPage != null) {
        if (toPage == 'agree'){
          wx.redirectTo({
            url: '../agree/agree?&id=' + option.id + '&inviteUser=' + option.inviteUser
          })
        } else if (toPage == 'apv'){
          wx.redirectTo({
            url: '../apv/apv?taskId=' + option.taskId
          })
        } else if(toPage == 'task'){
          wx.redirectTo({
            url: '../task/task?canOper=' + option.canOper + '&canApv=' + option.canApv + '&id=' + option.id
          })
        } else if (toPage == 'dynamic'){
          wx.switchTab({
            url: '../dynamic/dynamic'
          })
        }
      } else {
        wx.switchTab({
          url: '../todo/todo'
        })
      }
    }
})