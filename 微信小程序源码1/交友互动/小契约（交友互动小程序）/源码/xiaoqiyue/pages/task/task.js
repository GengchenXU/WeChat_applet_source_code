var app = getApp()  
var util = require('../../utils/util.js')
var page = Page( {  
  data: {  
    id: "",
    canApv: "false",
    canOper: "false",
    ellipsisHidden: true,
    task: {},
    apvSize: 0,
    windowHeight: 0,
    windowWidth: 0,
    scrollInitId: "",
    scrollTop: "",
    toTop: "",
    moreImg: "down.png",
    otherInfoHidden: true,
    watchUnApv: false,
    watchUnStart: false,
    excRule: [{
      "name": "每天",
      "value": "everyDay"
    }, {
      "name": "仅一次",
      "value": "onlyOnce"
    }, {
      "name": "周一至周五",
      "value": "monToFri"
    }, {
      "name": "周末",
      "value": "weekend"
    }, {
      "name": "自定义",
      "value": "customize"
    }],
    weeks: [{
      "name": "一",
      "value": "1"
    }, {
      "name": "二",
      "value": "2"
    }, {
      "name": "三",
      "value": "3"
    }, {
      "name": "四",
      "value": "4"
    }, {
      "name": "五",
      "value": "5"
    }, {
      "name": "六",
      "value": "6"
    }, {
      "name": "日",
      "value": "0"
    }],
    approvalPassRate: [{
      "name": "至少1人",
      "value": "leastOne"
    }, {
      "name": "半数及以上",
      "value": "halfAndAbove"
    }, {
      "name": "全部",
      "value": "all"
    }]
  },  
  onLoad: function(option){
    this.setData({
      id: option.id,
      canApv: option.canApv,
      canOper: option.canOper
    })
  },
  onShow: function(e) {
    var that = this
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      windowHeight: sysInfo.windowHeight,
      windowWidth: sysInfo.windowWidth
    })
    // 调接口
    getPageTask(that, null)
  },
  more: function(){
    var moreImg = ""
    var otherInfoHidden = false
    if(this.data.moreImg == 'down.png'){
      moreImg = 'up.png'
    } else {
      moreImg = 'down.png'
    }
    if (this.data.otherInfoHidden == true){
      otherInfoHidden = false
    } else {
      otherInfoHidden = true
    }
    this.setData({
      moreImg: moreImg,
      otherInfoHidden: otherInfoHidden
    })
  },
  scroll: function (e) {
    this.setData({
      toTop: e.detail.scrollTop
    })
  },
  formSubmit: function (e){
    app.collectFormId(e.detail.formId)
    var that = this
    var data = e.detail.value;
    wx.request({
      url: app.globalData.urlHeader + '/api/v1/approvalResult/create',
      method: 'POST',
      data: {
        approvalTaskId: e.target.dataset.taskid,
        content: data.content.length == 0 ? "已完成" : data.content,
        approverKey: app.globalData.openid,
        name: app.globalData.userInfo.nickName,
        icon: app.globalData.userInfo.avatarUrl
      },
      success: function(res){
        if (res.statusCode == 200) {
          // 刷新列表
          getPageTask(that, that.data.toTop)
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/warn.png',
            mask: true,
            duration: 1000
          })
        }
      }
    })
  },
  hiddenContent: function(event){
    var that = this
    var taskId = event.target.dataset.taskid
    var _task = that.data.task
    var _tasks = _task.approvalTask
    for (var i = 0; i < _tasks.length; i++){
      var _t = _tasks[i]
      var _taskId = _t.id
      if(_taskId == taskId){
        var hidden = _t.hidden
        if (hidden == true) {
          hidden = false
        } else {
          hidden = true
        }
        var pngPath = _t.pngPath
        if (pngPath == 'down.png'){
          pngPath = 'up.png'
        } else {
          pngPath = 'down.png'
        }
        _t.hidden = hidden
        _t.pngPath = pngPath
      }
    }
    that.setData({
      task: _task
    })
  },
  toApv: function(e){
    app.collectFormId(e.detail.formId)
    wx.navigateTo({
      url: '../apv/apv?taskId=' + e.target.dataset.taskid
    })
  },
  watchUnApv: function(e){
    var apv = e.detail.value
    if(apv){
      this.setData({
        watchUnApv: true,
        task: doWatchUnApv(this.data.task)
      })
    } else {
      this.setData({
        watchUnApv: false
      })
      getPageTask(this, null)
    }
  },
  watchUnStart: function(e){
    var unstart = e.detail.value
    if (unstart){
      this.setData({
        watchUnStart: true,
        task: doWatchUnStart(this.data.task)
      })
    } else {
      this.setData({
        watchUnStart: false
      })
      getPageTask(this, null)
    }
  },
  showApprover: function(){
    wx.navigateTo({
      url: '../approver/approver?id=' + this.data.id
    })
  }
}) 
function doWatchUnApv(_task){
  if (_task != null && _task.approvalTask != null) {
    for (var i = _task.approvalTask.length - 1; i >= 0; i--) {
      var _t = _task.approvalTask[i]
      if (_t.hiddenApv) {
        _task.approvalTask.splice(i, 1)
      }
    }
  }
  return _task
}
function doWatchUnStart(_task){
  if (_task != null && _task.approvalTask != null) {
    for (var i = _task.approvalTask.length - 1; i >= 0; i--) {
      var _t = _task.approvalTask[i]
      if (_t.status != 0) {
        _task.approvalTask.splice(i, 1)
      }
    }
  }
  return _task
}
function dealTask(that, task){
  if(task == null || task.id == null || task.id.length == 0){
    task.desc = '-'
    task.startDate = '-'
    task.endDate = '-'
    task.excRule = '-'
    task.approvalPassRate = '-'
    task.passRate = '-'
    task.open = '-'
    return
  }
  task.startDate = util.formatDate(new Date(task.startDate))
  task.endDate = util.formatDate(new Date(task.endDate))
  for (var i in that.data.excRule) {
    if (that.data.excRule[i].value == task.excRule) {
      if (task.excRule == 'customize') {
        var showMsg = that.data.excRule[i].name
        var showMsgName = new Array()
        for (var j in that.data.weeks) {
          if (util.arrayContains(task.excRuleValue, that.data.weeks[j].value)) {
            showMsgName.push("星期" + that.data.weeks[j].name)
          }
        }
        showMsg = showMsg + " [" + showMsgName.join("、") + "]"
        task.excRule = showMsg
      } else {
        task.excRule = that.data.excRule[i].name
      }
      break
    }
  }
  for (var i in that.data.approvalPassRate) {
    if (that.data.approvalPassRate[i].value == task.approvalPassRate) {
      task.approvalPassRate = that.data.approvalPassRate[i].name
      break
    }
  }
  task.passRate = task.passRate + " 分"
  if(task.open){
    task.open = "是"
  } else {
    task.open = "否"
  }
}
function getPageTask(that, toTop){
  var canApv = false
  if (that.data.canApv == 'true'){
    canApv = true
  } else {
    canApv = false
  }
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/hook/queryDetail/' + that.data.id,
    success: function (res) {
      var _task = res.data
      var scrollInitId = ""
      var scrollTop = ""
      dealTask(that, _task)
      if(_task != null && _task.approver != null){
        that.setData({
          apvSize: _task.approver.length,
          ellipsisHidden: (that.data.windowWidth - 147) / 20 > _task.approver.length
        })
      }
      if (_task != null && _task.approvalTask != null){
        var curDate = util.formatDate(new Date())
        var findCurDate = false
        for (var i = 0; i < _task.approvalTask.length; i++){
          var _t = _task.approvalTask[i]
          _t.hidden = true
          // 设置审批按钮的隐藏与否，如果任务状态是进行中且当前审批人没有审批记录就显示
          var hiddenApv = true;
          if (canApv && _t.status == 1){
            if (_t.approvalResult != null){
              var inApvList = false;
              for (var j = 0; j < _t.approvalResult.length; j++){
                var _apv = _t.approvalResult[j];
                if (_apv.status != 0 && _apv.approverKey == app.globalData.openid){
                  inApvList = true
                  break
                }
              }
              if (!inApvList){
                hiddenApv = false
              }
            }
          }
          _t.hiddenApv = hiddenApv
          _t.pngPath = 'down.png'
          // 如果是审批页面就设置跳到当前日期
          if (!findCurDate && curDate == _t.excTime){
            scrollInitId = _t.id
            _t.curDay = true
            findCurDate = true
          }
          
        }
      }
      // 如果设置了初始跳转的位置，优先跳转
      if (toTop != null) {
        scrollInitId = ""
        scrollTop = toTop
      }
      if (that.data.watchUnStart){
        _task = doWatchUnStart(_task)
      }
      if(that.data.watchUnApv){
        _task = doWatchUnApv(_task)
      }
      that.setData({
        task: _task,
        scrollInitId: scrollInitId,
        scrollTop: scrollTop
      })
    }
  })
}
