var app = getApp()  
Page( {  
  data: {  
    winWidth: 0,  
    winHeight: 0,  
    currentTab: 0,
    progressDatas: [],
    progressCurPage: 1,
    progressTotalPage: 1,
    progressTotalNums: 0,
    doneDatas: [],
    doneCurPage: 1,
    doneTotalPage: 1,
    doneTotalNums: 0,
    pageSize: 15
  },  
  onShow: function() {  
    var that = this;  
    wx.getSystemInfo( {  
      success: function( res ) {  
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight,
          pageSize: Math.floor((res.windowHeight - 80) / 40)
        });  
      }  
    }); 
    wx.request({
      url: app.globalData.urlHeader + '/api/v1/hook/count/relme?userKey=' + app.globalData.openid,
      success: function (res) {
        that.setData({
          progressTotalNums: res.data.progressTotalNums,
          doneTotalNums: res.data.doneTotalNums
        })
      }
    })
    doDoing(that)
  }, 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    freshData(e.detail.current, that)
  },
  swichNav: function (e) {
    var that = this;
    var currentTab = e.target.dataset.current
    if (this.data.currentTab === currentTab) {
      return false;
    } else {
      that.setData({
        currentTab: currentTab
      })
    }
    freshData(currentTab, that)
  },
  downPage: function () {
    var currentTab = this.data.currentTab
    if (currentTab == 0) {
      var progressCurPage = this.data.progressCurPage
      if (progressCurPage >= this.data.progressTotalPage) {
        return
      }
      this.setData({
        progressCurPage: ++progressCurPage
      })
      doDoing(this)
    } else {
      var doneCurPage = this.data.doneCurPage
      if (doneCurPage >= this.data.doneTotalPage) {
        return
      }
      this.setData({
        doneCurPage: ++doneCurPage
      })
      doComplete(this)
    }
  },
  upPage: function () {
    var currentTab = this.data.currentTab
    if (currentTab == 0) {
      var progressCurPage = this.data.progressCurPage
      if (progressCurPage <= 1) {
        return
      }
      this.setData({
        progressCurPage: --progressCurPage
      })
      doDoing(this)
    } else {
      var doneCurPage = this.data.doneCurPage
      if (doneCurPage <= 1) {
        return
      }
      this.setData({
        doneCurPage: --doneCurPage
      })
      doComplete(this)
    }
  },
  toTaskDetail: function(e){
    var id = e.target.dataset.taskid 
    wx.navigateTo({
      url: '../task/task?canOper=true&canApv=true&id=' + id
    })
  }
})  
function freshData(currentTab, that){
  if (currentTab == 0) {
    doDoing(that)
  } else {
    doComplete(that)
  }
}
function doComplete(that) {
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/hook/query/relme?status=2&userKey=' + app.globalData.openid + '&pageSize=' + that.data.pageSize + '&pageNum=' + that.data.doneCurPage,
    success: function (res) {
      that.setData({
        doneDatas: res.data.data,
        doneTotalNums: res.data.total,
        doneTotalPage: Math.ceil(res.data.total / that.data.pageSize) == 0 ? 1 : Math.ceil(res.data.total / that.data.pageSize)
      })
    }
  })
}
function doDoing(that) {
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/hook/query/relme?status=1&userKey=' + app.globalData.openid + '&pageSize=' + that.data.pageSize + '&pageNum=' + that.data.progressCurPage,
    success: function (res) {
      var progressDatas = res.data.data
      for (var i = 0; i < progressDatas.length; i++) {
        var progressData = progressDatas[i]
        var progress = progressData.progress
        if (progress <= 25) {
          progressData.activeColor = "red"
        } else if (progress <= 50) {
          progressData.activeColor = "purple"
        } else if (progress <= 75) {
          progressData.activeColor = "blue"
        } else {
          progressData.activeColor = "green"
        }
      }
      that.setData({
        progressDatas: progressDatas,
        progressTotalNums: res.data.total,
        progressTotalPage: Math.ceil(res.data.total / that.data.pageSize) == 0 ? 1 : Math.ceil(res.data.total / that.data.pageSize)
      })
    }
  })
}