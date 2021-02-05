var app = getApp()
var util = require('../../utils/util.js')
Page( {  
  data: {
    windowHeight: 0,
    windowWidth: 0,
    pageNum: 1,
    pageSize: 10,
    firstLoadDataNum: 0,
    bottomLoadMsg: "点我加载",
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
  },
  bottomLoad: function () {
    getDynamic(this, false)
  }
})

function getDynamic(that, first){
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/dynamic/myself?curKey=' + app.globalData.openid + '&pageNum=' + that.data.pageNum + "&pageSize=" + that.data.pageSize,
    method: 'GET',
    success: function (res) {
      var oldData = that.data.dynamic
      var dyns = res.data
      var pageNum = that.data.pageNum
      if(dyns != null && dyns.length > 0){
        pageNum ++
        for(var i=0; i<dyns.length; i++){
          var dyn = dyns[i]
          dyn.createTime = util.formatTime(new Date(dyn.createTime))
          oldData.push(dyn)
        }
      } else {
        that.setData({
          bottomLoadMsg: "我可是有底线的"
        })
      }
      that.setData({
        pageNum: pageNum,
        dynamic: oldData
      })
      if (first) {
        var firstLoadDataNum = 0
        if (dyns != null && dyns.length > 0) {
          firstLoadDataNum = dyns.length
        }
        that.setData({
          firstLoadDataNum: firstLoadDataNum
        })
      }
    }
  })
}