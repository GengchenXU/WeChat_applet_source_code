var app = getApp()  
Page( {  
  data: {
    approver: [],
    apvSize: 0,
    windowHeight: 0,
    windowWidth: 0
  }, 
  onLoad: function (option) {
    var that = this
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      id: option.id,
      windowHeight: sysInfo.windowHeight,
      windowWidth: sysInfo.windowWidth
    })
    wx.request({
      url: app.globalData.urlHeader + '/api/v1/hook/queryDetail/' + option.id,
      success: function (res) {
        var task = res.data
        if(task != null && task.approver != null){
          that.setData({
            approver: task.approver,
            apvSize: task.approver.length
          })
        }
      }
    })
  }
})