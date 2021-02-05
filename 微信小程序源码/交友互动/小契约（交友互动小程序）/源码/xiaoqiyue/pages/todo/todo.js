var app = getApp()
Page( {  
  data: {
    myTaskNum: 0,
    relMeNum: 0,
    animation4Reward: {},
    animation4Pull: {},
    rewardHidden: true,
  },  
  onLoad: function() {
    var that = this
    setInterval(function () {
      getMyTaskNum(that)
      getRelMeNum(that)
    }, 30000)
  },
  onReady: function(){
    var that = this
    getMyTaskNum(that)
    getRelMeNum(that)
  },
  myTask: function (e) {
    app.collectFormId(e.detail.formId)
    wx.navigateTo({
      url: '../mine/mine'
    })
  },
  relMe: function (e) {
    app.collectFormId(e.detail.formId)
    wx.navigateTo({
      url: '../relme/relme'
    })
  },
  reward: function () {
    // 出现打赏界面
    this.setData({
      rewardHidden: false
    })

    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    animation.translateY(-40).step()
    var animation4Pull = wx.createAnimation({
      duration: 500,
      delay: 500,
      timingFunction: 'linear',
    })
    animation4Pull.translateY(0).step()
    this.setData({
      animation4Reward: animation.export(),
      animation4Pull: animation4Pull
    })
  },
  pull: function () {
    var animation = wx.createAnimation({
      duration: 500,
      delay: 1000,
      timingFunction: 'linear',
    })
    animation.translateY(40).step()
    var animation4Pull = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    animation4Pull.translateY(15).step()
    animation4Pull.translateY(-30).step()
    this.setData({
      animation4Pull: animation4Pull.export(),
      animation4Reward: animation.export()
    })
  },
  hiddenPayCode: function () {
    this.setData({
      rewardHidden: true
    })
  },
  savePayCode: function () {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum()
              savePayCodePng()
            }
          })
        } else {
          savePayCodePng()
        }
      }
    })
  }
})
function getMyTaskNum(that){
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/hook/count?userKey=' + app.globalData.openid,
    success: function (res) {
      that.setData({
        myTaskNum: res.data.notStartTotalNums + res.data.progressTotalNums
      })
    }
  })
}
function getRelMeNum(that){
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/hook/count/relme?userKey=' + app.globalData.openid,
    success: function (res) {
      that.setData({
        relMeNum: res.data.progressTotalNums
      })
    }
  })
}
function savePayCodePng() {
  wx.downloadFile({
    url: app.globalData.urlHeader + "/static/images/payCode.png",
    success: function (res) {
      var filePath = res.tempFilePath
      wx.saveImageToPhotosAlbum({
        filePath: filePath,
        success(res) {
          console.info("保存图片成功")
        },
        fail: function (res) {
          console.info(res.errMsg)
        }
      })
    }
  })
}