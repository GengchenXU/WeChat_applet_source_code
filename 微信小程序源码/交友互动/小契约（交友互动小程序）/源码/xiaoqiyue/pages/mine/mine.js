var app = getApp()
Page( {  
  data: {  
    winWidth: 0,  
    winHeight: 0,  
    currentTab: 1,
    notStartDatas: [],
    notStartCurPage: 1,
    notStartTotalPage: 1,
    notStartTotalNums: 0,
    progressDatas:[],
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
    var res = wx.getSystemInfoSync()
    that.setData( {
      winWidth: res.windowWidth,  
      winHeight: res.windowHeight,
      pageSize: Math.floor((res.windowHeight - 80) / 40)
    });
    wx.request({
      url: app.globalData.urlHeader + '/api/v1/hook/count?userKey=' + app.globalData.openid,
      success: function (res) {
        that.setData({
          notStartTotalNums: res.data.notStartTotalNums,
          progressTotalNums: res.data.progressTotalNums,
          doneTotalNums: res.data.doneTotalNums
        })
      }
    })
    doUnStart(that)
    doDoing(that)
  }, 
  downPage: function(){
    var currentTab = this.data.currentTab
    if (currentTab == 0) {
      var notStartCurPage = this.data.notStartCurPage
      if (notStartCurPage >= this.data.notStartTotalPage){
        return
      }
      this.setData({
        notStartCurPage: ++notStartCurPage
      })
      doUnStart(this)
    } else if (currentTab == 1) {
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
  upPage: function(){
    var currentTab = this.data.currentTab
    if (currentTab == 0) {
      var notStartCurPage = this.data.notStartCurPage
      if (notStartCurPage <= 1) {
        return
      }
      this.setData({
        notStartCurPage: --notStartCurPage
      })
      doUnStart(this)
    } else if (currentTab == 1) {
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
  },
  toTaskDetail: function(e){
    var id = e.target.dataset.taskid 
    wx.navigateTo({
      url: '../task/task?canOper=true&canApv=false&id=' + id
    })
  },
  del: function(e){
    app.collectFormId(e.detail.formId)
    var that = this
    var id = e.target.dataset.taskid
    wx.showModal({
      title: '提示',
      content: '确认删除拉钩？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.urlHeader + '/api/v1/hook/delete/' + id,
            success: function (res) {
              var currentTab = that.data.currentTab
              if (currentTab == 0){
                doUnStart(that)
              } else if (currentTab == 2){
                doComplete(that)
              }
            }
          })
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '小契约-拉钩邀请',
      path: '/pages/home/home?id=' + res.target.dataset.taskid + '&inviteUser=' + res.target.dataset.hookname + '&toPage=agree',
      imageUrl: '../../images/product.png',
      success: function (res) {
        // 转发成功
        wx.navigateTo({
          url: '../msg/msg',
          success: function (res) {
            // success
          },
          fail: function (res) {
            // fail
          },
          complete: function (res) {
            // complete
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})  
function freshData(currentTab, that){
  if (currentTab == 0) {
    doUnStart(that)
  } else if (currentTab == 1) {
    doDoing(that)
  } else {
    doComplete(that)
  }
}
function doUnStart(that) {
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/hook/query?status=0&userKey=' + app.globalData.openid + '&pageSize=' + that.data.pageSize + '&pageNum=' + that.data.notStartCurPage,
    success: function (res) {
      that.setData({
        notStartDatas: res.data.data,
        notStartTotalNums: res.data.total,
        notStartTotalPage: Math.ceil(res.data.total / that.data.pageSize) == 0 ? 1 : Math.ceil(res.data.total / that.data.pageSize)
      })
    }
  })
}
function doComplete(that) {
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/hook/query?status=2&userKey=' + app.globalData.openid + '&pageSize=' + that.data.pageSize + '&pageNum=' + that.data.doneCurPage,
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
    url: app.globalData.urlHeader + '/api/v1/hook/query?status=1&userKey=' + app.globalData.openid + '&pageSize=' + that.data.pageSize + '&pageNum=' + that.data.progressCurPage,
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