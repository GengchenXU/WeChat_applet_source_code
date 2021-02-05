//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    requstTxt:'click me'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../seriesDetail/seriesDetail'
    })
  },
  requestFun:function(){
    console.log('ready to req');
    var requestUrl = 'https://m-api.xcar.com.cn/pcapi/Series/seriesInfo?token=209ec943bf22596db96dea86ea93e487&debug=1&seriesId=1154&cityId=475';
    wx.request({
      url: requestUrl,
      data: {},
      dataType:JSON,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
       console.log(res)
       console.log(res)
      },
      fail: function(res) {
        console.log('fail')
      },
      complete: function() {
       console.log('always')
      }
    })
    console.log('123')
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
