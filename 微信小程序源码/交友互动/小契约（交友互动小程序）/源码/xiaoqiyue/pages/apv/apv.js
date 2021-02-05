var app = getApp()  
var util = require('../../utils/util.js')
Page({  
  data: {
    taskId: "",
    ret: 1,
    task:{ 
    },
    apvContent: "审批完成"
  },  
  onLoad: function(option) {
    var that = this
    var taskId = option.taskId
    // 获取任务信息
    wx.request({
      url: app.globalData.urlHeader + '/api/v1/msg/apvInfo/' + taskId,
      success: function(res){
        that.setData({
          taskId: taskId,
          task: res.data
        })
      }
    })
  },
  setContent: function(e){
    this.setData({
      apvContent: e.detail.value
    })
  },
  pass: function(event){
    app.collectFormId(event.detail.formId)
    submit(this, 1)
  },
  fail: function(event){
    app.collectFormId(event.detail.formId)
    submit(this, 3)
  }
})  
function submit(that, ret) {
  var taskId = that.data.taskId
  var content = that.data.apvContent
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/approvalResult/create',
    method: 'POST',
    data: {
      approvalTaskId: taskId,
      content: content,
      approverKey: app.globalData.openid,
      name: app.globalData.userInfo.nickName,
      icon: app.globalData.userInfo.avatarUrl,
      status: ret
    },
    success: function (res) {
      if (res.statusCode == 200) {
        wx.showToast({
          title: '审批完成',
          icon: 'success',
          mask: true,
          duration: 1000
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
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
}