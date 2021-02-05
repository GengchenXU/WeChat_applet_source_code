var app = getApp()
var util = require('../../utils/util.js')
Page( {  
  data: {
    windowHeight: 0,
    windowWidth: 0,
    hiddenRelme: true,
    icon: "",
    offset: 0,
    firstLoadDataNum: 0,
    initLimit: 20,
    limit: 10,
    time: 0,
    hiddenFreshResult: true,
    freshResult: "",
    bottomLoadMsg: "点我加载",
    dynamic: [],
    hiddenComment: true,
    commentPlaceholder: "",
    commentDynamicId:"",
    commentReplyKey: "",
    commentReplyName: "",
    commentInput:"",
    commentInitInput: ""
  },
  onLoad: function() {
    var that = this
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      windowHeight: sysInfo.windowHeight,
      windowWidth: sysInfo.windowWidth,
      icon: app.globalData.userInfo.avatarUrl
    })
    getDynamic(that, true)
    checkRelme(that)
    setInterval(function(){
      checkRelme(that)
    }, 60000)
  },
  toRelme: function(){
    var that = this
    that.setData({
      hiddenRelme: true
    })
    wx.navigateTo({
      url: '../dynrelme/dynrelme'
    })
  },
  toMyself: function(){
    wx.navigateTo({
      url: '../dynmyself/dynmyself'
    })
  },
  toComment: function(e){
    this.setData({
      commentDynamicId: e.target.dataset.id,
      commentReplyKey: e.target.dataset.replykey == null ? "" : e.target.dataset.replykey,
      commentReplyName: e.target.dataset.replyname == null ? "" : e.target.dataset.replyname,
      commentPlaceholder: "",
      hiddenComment: false
    })
    if (e.target.dataset.replykey != null){
      this.setData({
        commentInitInput: "",
        commentInput: ""
      })
    }
  },
  cancelComment: function(){
    this.setData({
      hiddenComment: true
    })
  },
  setCommentInput: function(e){
    this.setData({
      commentInput: e.detail.value,
      commentInitInput: e.detail.value
    })
  },
  submitComment: function(){
    var that = this
    if (that.data.commentInput.length == 0){
      that.setData({
        commentPlaceholder: "评论不能为空"
      })
      return
    }
    wx.request({
      url: app.globalData.urlHeader + '/api/v1/response/create',
      data: {
        "dynamicId": that.data.commentDynamicId,
        "type": 2,
        "key": app.globalData.openid,
        "name": app.globalData.userInfo.nickName,
        "icon": app.globalData.userInfo.avatarUrl,
        "content": that.data.commentInput,
        "replyKey": that.data.commentReplyKey.length == 0 ? null : that.data.commentReplyKey
      },
      method: 'POST',
      success: function (res) {
        // 刷新指定的动态评论
        refreshDynamic(that, that.data.commentDynamicId)  
        that.setData({
          hiddenComment: true
        })      
      }
    })
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
  good: function(e){
    var that = this
    var curKeyGood = e.target.dataset.curkeygood
    if(curKeyGood){
      return
    }
    var id = e.target.dataset.id
    wx:wx.request({
      url: app.globalData.urlHeader + '/api/v1/response/good/done?dynamicId=' + id + "&key=" + app.globalData.openid,
      method: 'GET',
      success: function(res) {
        var good = res.data.good
        if(!good){
          wx:wx.request({
            url: app.globalData.urlHeader + '/api/v1/response/create',
            data: {
              "dynamicId":id,
              "type":1,
              "key": app.globalData.openid,
              "name": app.globalData.userInfo.nickName,
              "icon": app.globalData.userInfo.avatarUrl
            },
            method: 'POST',
            success: function(res) {
              refreshDynamic(that, id)
            }
          })
        } else {
          refreshDynamic(that, id)
        }
      }
    })
  },
  onPullDownRefresh: function(){
    var that = this
    wx.request({
      url: app.globalData.urlHeader + '/api/v1/dynamic/latest?time=' + that.data.time + "&curKey=" + app.globalData.openid,
      method: 'GET',
      success: function (res) {
        var oldData = that.data.dynamic
        var dyns = res.data
        var time = that.data.time
        if (dyns != null && dyns.length > 0) {
          for (var i = dyns.length - 1; i >= 0; i--) {
            var dyn = dyns[i]
            if(i == 0){
              time = dyn.createTime
            }
            dyn.createTime = util.formatTime(new Date(dyn.createTime))
            oldData.unshift(dyn)
          }
        }
        that.setData({
          dynamic: oldData,
          time: time
        })
        wx.stopPullDownRefresh()
        setTimeout(function(){
          var freshResult = ""
          if (dyns != null && dyns.length > 0) {
            freshResult = "发现了" + dyns.length + "条内容"
          } else {
            freshResult = "已是最新"
          }
          that.setData({
            hiddenFreshResult: false,
            freshResult: freshResult
          })
          setTimeout(function () {
            that.setData({
              hiddenFreshResult: true
            })
          }, 2000)
        },1200)
      }
    })
  },
  bottomLoad: function () {
    getDynamic(this, false)
  }
})
// 初始化加载数据、上拉刷新
function getDynamic(that, first){
  var limit = 0
  if(first){
    limit = that.data.initLimit
  } else {
    limit = that.data.limit
  }
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/dynamic/query?offset=' + that.data.offset + '&limit=' + limit + "&curKey=" + app.globalData.openid,
    method: 'GET',
    success: function (res) {
      var oldData = that.data.dynamic
      var offset = res.data.offset
      var dyns = res.data.data
      var time = 0
      if(dyns != null && dyns.length > 0){
        for(var i=0; i<dyns.length; i++){
          var dyn = dyns[i]
          if(i == 0){
            time = dyn.createTime
          }
          dyn.createTime = util.formatTime(new Date(dyn.createTime))
          oldData.push(dyn)
        }
      } else {
        that.setData({
          bottomLoadMsg: "我可是有底线的"
        })
      }
      that.setData({
        offset: offset,
        dynamic: oldData
      })
      if(first){
        var firstLoadDataNum = 0
        if (dyns != null && dyns.length > 0) {
          firstLoadDataNum = dyns.length
        }
        // 初始化获取数据后设置最新数据时间
        that.setData({
          time: time,
          firstLoadDataNum: firstLoadDataNum
        })
      }
    }
  })
}
function refreshDynamic(that, id){
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/dynamic/get?id=' + id + '&curKey=' + app.globalData.openid,
    method: 'GET',
    success: function (res1) {
      // 找到dynamic列表中的值进行替换
      var dynamics = that.data.dynamic
      if (dynamics != null && dynamics.length > 0) {
        for (var i = 0; i < dynamics.length; i++) {
          var dyn = dynamics[i]
          if (dyn.id == id) {
            dyn.comments = res1.data.comments
            dyn.commentsTotalNum = res1.data.commentsTotalNum
            dyn.goodNum = res1.data.goodNum
            dyn.curKeyGood = res1.data.curKeyGood
            dyn.goods = res1.data.goods
            break
          }
        }
      }
      that.setData({
        dynamic: dynamics
      })
    }
  })
}

function checkRelme(that){
  wx: wx.request({
    url: app.globalData.urlHeader + '/api/v1/dynamic/relme/count?curKey=' + app.globalData.openid,
    method: 'GET',
    success: function (res) {
      var has = res.data.has
      if(has){
        that.setData({
          hiddenRelme: false
        })
      }
    }
  })
}