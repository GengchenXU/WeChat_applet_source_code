//app.js
App({
  onLaunch: function () {
    var that = this
    setInterval(function(){
      // formId收集
      if (that.globalData.formIds.length == 0 || that.globalData.openid == null){
        return
      }
      // 复制一份
      var formIdsArr = that.globalData.formIds.concat()
      that.globalData.formIds = []
      wx.request({
        url: that.globalData.urlHeader + "/api/v1/formId/collect?userKey=" + that.globalData.openid,
        method: 'POST',
        data: formIdsArr,
        success: function (res) {
          if (res.statusCode != 200) {
            // 将复制的formIds放回
            for(var i=0; i<formIdsArr.length; i++){
              that.globalData.formIds.push(formIdsArr[i])
            }
          }
        }
      })
    }, 30000)
  },
  collectFormId: function(formId){
    if ("the formId is a mock one" != formId){
      this.globalData.formIds.push(formId)  
    }
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (loginRet) {
          wx.request({
            url: that.globalData.urlHeader + "/api/v1/user/get/" + loginRet.code,
            method: 'GET',
            success: function(res){
              that.globalData.openid = res.data.openid

              // 清理formId
              wx.request({
                url: that.globalData.urlHeader + "/api/v1/formId/fresh?userKey=" + res.data.openid,
                method: 'GET',
                success: function (res) {
                }
              })
            }
          })
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    formIds: [],
    isCleaned: false,
    userInfo:null,
    openid: "",
    urlHeader: "https://www.small-contract.cn/small-contract"
  }
})