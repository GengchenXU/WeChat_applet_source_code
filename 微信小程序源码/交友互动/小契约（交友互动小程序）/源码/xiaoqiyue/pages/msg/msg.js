var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    msgs: [],
    unReadNum: 0,
    downUnReadNum: 0,
    unReadMsgs: [],
    windowHeight: 0,
    windowWidth: 0,
    scrollInitId: "", // 初始化滚动到的位置id
    scrollToId: "", // 第一个未读消息id
    scrollToBottomId: "", // 最底部消息id
    upBtnHidden: true,
    downBtnHidden: true,
    clientY: 0,
    isRefresh: false,
    toTop: 0,// 滚动时候距离最上面的距离
    topMsgId: "", // 最上面元素的id
    freshNumFlag: -1,
    freshIndexFlag: -1,
    inShow: false // 是否在当前页面
  },
  scroll: function (e) {
    this.setData({
      toTop: e.detail.scrollTop
    })
  },
  start: function (e) {
    this.setData({
      clientY: e.touches[0].clientY
    })
  },
  end: function (e) {
    var that = this
    var pointTopointY = e.changedTouches[0].clientY - this.data.clientY
    var toTop = this.data.toTop
    if (toTop <= 10 && pointTopointY > 50) {
      console.info("上拉刷新")
      this.setData({
        isRefresh: true
      })
      getFreshData(that, false)
      
      setTimeout(function () {
        that.setData({
          isRefresh: false,
          toTop: 0
        })
      }, 500)
    }   
  },
  hiddenDownBtn: function(){
    // 如果移动到最下面就隐藏最下面的消息未读按钮
    this.setData({
      downBtnHidden: true,
      downUnReadNum: 0
    })
  },
  onShow: function () {
    var that = this
    that.setData({
      inShow: true
    })
    getnewData(that, true)
  },
  onHide: function(){
    this.setData({
      inShow: false
    })
  },
  onLoad: function(){
    var that = this
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      windowHeight: sysInfo.windowHeight,
      windowWidth: sysInfo.windowWidth
    })

    // 获取缓存标志信息
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

    // 缓存标识
    var freshNumFlag = cacheHubNum
    var freshIndexFlag = cacheHubIndex
    // 加载缓存逻辑
    // 将新消息缓存放入旧消息缓存中，默认100条消息，并清空新消息缓存
    try {
      var newMsgsStr = wx.getStorageSync('newMsgs')
      if (newMsgsStr.length > 0) {
        var newMsgs = JSON.parse(newMsgsStr)
        if (newMsgs != null && newMsgs.length > 0) {
          if (cacheHubNum < 0) {
            cacheHubNum = 0
          }
          if (cacheHubIndex < 0) {
            cacheHubIndex = 0
          }

          // 获取缓存存储信息量，适当删减缓存
          var cache = wx.getStorageInfoSync()
          var cacheCurrentSize = cache.currentSize
          var cacheLimitSize = cache.limitSize
          while (cacheCurrentSize / cacheLimitSize > 0.9) {
            for (var i = 0; i <= cacheHubNum; i++) {
              wx.removeStorageSync("oldMsgs_" + i)
              if (i == cacheHubNum) {
                cacheHubIndex = 0
              }
            }
            cacheCurrentSize = wx.getStorageInfoSync().currentSize
          }

          var oldMsgsStr = wx.getStorageSync("oldMsgs_" + cacheHubNum)
          var oldMsgs
          if (oldMsgsStr.length == 0) {
            oldMsgs = new Array()
          } else {
            oldMsgs = JSON.parse(oldMsgsStr)
          }

          for (var i = 0; i < newMsgs.length; i++) {
            if (cacheHubIndex < 100) {
              oldMsgs.push(newMsgs[i])
              cacheHubIndex++
              if (i == newMsgs.length - 1) {
                wx.setStorageSync("oldMsgs_" + cacheHubNum, JSON.stringify(oldMsgs))
              }
            } else {
              wx.setStorageSync("oldMsgs_" + cacheHubNum, JSON.stringify(oldMsgs))
              oldMsgs = new Array()
              cacheHubNum++
              cacheHubIndex = 0
            }
          }
          wx.removeStorageSync("newMsgs")
          wx.setStorageSync('cacheHubNum', cacheHubNum)
          freshNumFlag = cacheHubNum
          wx.setStorageSync('cacheHubIndex', cacheHubIndex)
          freshIndexFlag = cacheHubIndex
        }
      }
      that.setData({
        freshNumFlag: freshNumFlag,
        freshIndexFlag: freshIndexFlag
      })
      // 从旧消息缓存中取出20条信息，并记录最上面元素的id
      getFreshData(that, true)
    } catch (e) {
      console.error(e.message)
    }

    // 开启消息定时刷新功能，将消息添加到新消息缓存中
    setInterval(function () {
      getnewData(that, false)
    }, 30000)
  },
  detail: function(e){
    var id = e.target.dataset.id
    var attValue = e.target.dataset.attvalue
    wx.navigateTo({
      url: '../apv/apv?taskId=' + attValue
    })
  },
  endDetail: function(e){
    wx.navigateTo({
      url: '../task/task?canOper=false&canApv=false&id=' + e.target.dataset.id
    })
  },
  jumpToUpUnRead: function(e){
    app.collectFormId(e.detail.formId)
    this.setData({
      scrollInitId: this.data.scrollToId,
      upBtnHidden: true
    })
  },
  jumpToDownUnRead: function(e){
    app.collectFormId(e.detail.formId)
    this.setData({
      scrollInitId: this.data.scrollToBottomId,
      downBtnHidden: true,
      downUnReadNum: 0
    })
  }
})
function getnewData(that, first){
  if (!(that.data.inShow)){
    // 如果不是在消息页面就不刷新
    return
  }
  if (!first){
    console.info("定时刷新")
  }
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/msg/query?userKey=' + app.globalData.openid,
    method: 'GET',
    success: function (res) {
      var scrollInitId = ""
      var scrollToId = ""
      var scrollToBottomId = ""
      var unReadNum = 0
      var newMsgs = that.data.msgs
      var msgs = res.data
      that.setData({
        unReadMsgs: msgs
      })
      var newCacheMsgs
      var newCacheMsgsStr = wx.getStorageSync('newMsgs')
      if (newCacheMsgsStr.length > 0) {
        newCacheMsgs = JSON.parse(newCacheMsgsStr)
      }
      if (newCacheMsgs == null) {
        newCacheMsgs = new Array()
      }
      if (msgs != null && msgs.length > 0) {
        unReadNum = msgs.length
        for (var i = 0; i < msgs.length; i++) {
          var msg = msgs[i]
          var time = util.formatTime(new Date(msg.createTime))
          msg.createTime = time
          if (msg.type == 2){
            msg.attValue = JSON.parse(msg.attValue)
          }
          if (i == 0) {
            scrollToId = msg.id
          }
          if(i == msgs.length - 1){
            scrollToBottomId = msg.id
          }
          // 第一次刷新数据时显示到最下面的元素，如果是定时刷新则不显示
          if (first && i == msgs.length - 1) {
            scrollInitId = msg.id
          }
          newMsgs.push(msg)
          newCacheMsgs.push(msg)
        }
        readMsg(that)
      }
      wx.setStorageSync('newMsgs', JSON.stringify(newCacheMsgs))
      that.setData({
        scrollInitId: scrollInitId,
        msgs: newMsgs
      })
      if (first && unReadNum > 0) {
        that.setData({
          upBtnHidden: false,
          unReadNum: unReadNum
        })
      }
      that.setData({
        scrollToId: scrollToId,
        scrollToBottomId: scrollToBottomId,
        downUnReadNum: that.data.downUnReadNum + unReadNum
      })
      if (!first && unReadNum > 0){
        that.setData({
          downBtnHidden: false
        })
      }
    },
    fail: function (res) {
      console.error(res)
    }
  })
}
function getFreshData(that, first){
  var freshNumFlag = that.data.freshNumFlag
  var freshIndexFlag = that.data.freshIndexFlag
  if (app.globalData.isCleaned){
    return
  }
  // 刷新定位，记录刷新时第一个元素的id
  var topMsgId = ""
  if (that.data.msgs != null && that.data.msgs.length > 0) {
    topMsgId = that.data.msgs[0].id
  }
  if (freshNumFlag >= 0) {
    var oldMsgsStr = wx.getStorageSync('oldMsgs_' + freshNumFlag)
    if(oldMsgsStr.length > 0){
      var oldMsgs = JSON.parse(oldMsgsStr)
      if (oldMsgs != null && oldMsgs.length > 0){
        var num = 0
        var msgs = that.data.msgs
        var scrollInitId = ""
        while (true) {
          var canBreakWhile = false
          for (var i = freshIndexFlag - 1; i >= 0; i--) {
            msgs.unshift(oldMsgs[i])
            if(num == 0){
              // 记录第一次刷新最下面一条数据的id
              scrollInitId = oldMsgs[i].id
            }
            num++
            if(num >= 20){
              freshIndexFlag = i
              canBreakWhile = true
              break
            }
          }
          if (canBreakWhile){
            break
          }
          freshNumFlag--
          freshIndexFlag = 100
          if(freshNumFlag < 0){
            break
          }
          oldMsgsStr = wx.getStorageSync('oldMsgs_' + freshNumFlag)
          if (oldMsgsStr.length > 0) {
            oldMsgs = JSON.parse(oldMsgsStr)
            if (oldMsgs == null || oldMsgs.length == 0) {
              break
            }
          } else {
            break
          }
        }
        if (!first) {
          scrollInitId = topMsgId
        }
        that.setData({
          freshNumFlag: freshNumFlag,
          freshIndexFlag: freshIndexFlag,
          msgs: msgs,
          scrollInitId: scrollInitId
        })
      }
    }
  }
}
function readMsg(that){
  console.info("消息已读开始")
  // 调用已读接口
  var idsArr = new Array()
  var unReadMsgs = that.data.unReadMsgs
  if (unReadMsgs != null && unReadMsgs.length > 0){
    for (var i = 0; i < unReadMsgs.length; i++){
      var msg = unReadMsgs[i]
      idsArr.push(msg.id)
    }
  }
  if(idsArr.length > 0){
    wx.request({
      url: app.globalData.urlHeader + '/api/v1/msg/read?ids=' + idsArr.join(",")
    })
  }
}