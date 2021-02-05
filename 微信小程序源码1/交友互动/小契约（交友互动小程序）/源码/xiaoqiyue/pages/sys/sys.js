var app = getApp()  
Page( {  
  data: {
    cacheClearHidden: true
  },  
  onShow: function() {  
  },
  clearCache: function () {
    this.setData({
      cacheClearHidden: false
    })
  },
  cancel: function(){
    this.setData({
      cacheClearHidden: true
    })
  },
  beginClear: function(){
    this.setData({
      cacheClearHidden: true
    })
    wx.showLoading({
      title: '清理中',
      mask: true
    })

    var cacheHubNum = -1
    var cacheHubIndex = -1
    var cacheHubNumObj = wx.getStorageSync("cacheHubNum")
    if (typeof (cacheHubNumObj) == 'number') {
      cacheHubNum = cacheHubNumObj
    }
    var cacheHubIndexObj = wx.getStorageSync("cacheHubIndex")
    if (typeof (cacheHubIndexObj) == 'number') {
      cacheHubIndex = cacheHubIndexObj
    }
    if(cacheHubNum > -1){
      for(var i=0; i<=cacheHubNum; i++){
        wx.removeStorageSync('oldMsgs_' + i)
      }
    }
    wx.setStorageSync('cacheHubNum', -1)
    wx.setStorageSync('cacheHubIndex', -1)

    // 设置全局清理标识
    app.globalData.isCleaned = true

    wx.hideLoading()
    wx.showToast({
      title: '清理完成',
      icon: 'success',
      duration: 1000
    })
  }
})