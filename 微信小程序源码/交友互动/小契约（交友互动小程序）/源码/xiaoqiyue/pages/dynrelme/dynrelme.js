var app = getApp()
var util = require('../../utils/util.js')
Page( {  
  data: {
    windowHeight: 0,
    windowWidth: 0,
    dynamic: []
  },
  onLoad: function() {
    var that = this
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      windowHeight: sysInfo.windowHeight,
      windowWidth: sysInfo.windowWidth
    })
    getDynamic(that, true)
  },
  showAllComments: function(e){
    wx.navigateTo({
      url: '../comment/comment?id=' + e.target.dataset.id
    })
  },
  showAllGood: function(e){
    wx.navigateTo({
      url: '../good/good?id=' + e.target.dataset.id
    })
  },
  detail: function(e){
    wx.navigateTo({
      url: '../task/task?canOper=false&canApv=false&id=' + e.target.dataset.id
    })
  }
})
function getDynamic(that){
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/dynamic/relme?curKey=' + app.globalData.openid,
    method: 'GET',
    success: function (res) {
      var newData = []
      var dyns = res.data
      if(dyns != null && dyns.length > 0){
        for(var i=0; i<dyns.length; i++){
          var dyn = dyns[i]
          dyn.createTime = util.formatTime(new Date(dyn.createTime))
          newData.push(dyn)
        }
      }
      that.setData({
        dynamic: newData
      })
      
      // 删除relme记录
      wx.request({
        url: app.globalData.urlHeader + '/api/v1/dynamic/relme/remove?curKey=' + app.globalData.openid,
        method: 'GET',
        success: function(){
          
        }
      })
    }
  })
}