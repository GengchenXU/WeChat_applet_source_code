var app = getApp()  
var util = require('../../utils/util.js')
Page({  
  data: {
    id: "",
    inviteUser: "",
    task:{ 
    },
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
  onLoad: function(option) {
    var that = this
    var hookId = option.id
    var inviteUser = option.inviteUser
    that.setData({
      id: hookId,
      inviteUser: inviteUser
    })
    // 根据id查询
    wx.request({
      url: app.globalData.urlHeader + '/api/v1/hook/get/' + hookId,
      method: 'GET',
      success: function (res) {
        var task = res.data
        if(task.id == null || task.id.length == 0){
          var task = that.data.task
          task.name = "-"
          task.desc = "-"
          task.startDate = "-"
          task.endDate = "-"
          task.excRule = "-"
          task.approvalPassRate = "-"
          task.passRate = "-"
          that.setData({
            task: task
          })
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '拉钩已被删除',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
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
            if (that.data.approvalPassRate[i].value = task.approvalPassRate) {
              task.approvalPassRate = that.data.approvalPassRate[i].name
              break
            }
          }
          task.passRate = task.passRate + " 分"
          that.setData({
            task: task
          })
        }
      }
    })
  },
  agree: function(event){
    app.collectFormId(event.detail.formId)
    wx.request({
      url: app.globalData.urlHeader + '/api/v1/hook/agree',
      data: {
        hookId: this.data.id,
        userKey: app.globalData.openid,
        name: app.globalData.userInfo.nickName,
        icon: app.globalData.userInfo.avatarUrl,
        agree: true
      },
      method: 'POST'
    })
    wx.showToast({
      title: '同意拉钩',
      icon: 'success',
      mask: true,
      duration: 1000
    })
    setTimeout(function(){
      wx.navigateBack({
        delta: 1
      })
    },1000)
  },
  refuse: function (event){
    app.collectFormId(event.detail.formId)
    wx.request({
      url: app.globalData.urlHeader + '/api/v1/hook/agree',
      data: {
        hookId: this.data.id,
        userKey: app.globalData.openid,
        name: app.globalData.userInfo.nickName,
        icon: app.globalData.userInfo.avatarUrl,
        agree: false
      },
      method: 'POST'
    })
    wx.showToast({
      title: '拒绝拉钩',
      icon: 'success',
      mask: true,
      duration: 1000
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 1000)
  }
})  
