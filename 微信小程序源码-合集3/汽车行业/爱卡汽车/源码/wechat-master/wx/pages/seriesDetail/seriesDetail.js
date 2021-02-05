var app = getApp()
Page({
  data: {
    seriesDetail:{},
    conditions:[
      {name:'name1'},
      {name:'name2'}
    ]
  },
  //事件处理函数
  requestFun:function(){
    console.log('ready to req');
    var requstUrl = 'https://m-api.xcar.com.cn/pcapi/Series/seriesInfo?token=209ec943bf22596db96dea86ea93e487&debug=1&seriesId=1154&cityId=475';
    wx.request({
      url: requstUrl,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
       var rdata = res.data;
       var self = this;
       self.seriesDetail = rdata.data;
       console.log(self.seriesDetail);
      },
      fail: function(res) {
        console.log('fail')
      },
      complete: function() {
         console.log('always');
        // complete
      }
    })
  },
  onReady: function () {
    console.log('onReady 事件')
    var requstUrl = 'https://m-api.xcar.com.cn/pcapi/Series/seriesInfo?token=209ec943bf22596db96dea86ea93e487&debug=1&seriesId=1154&cityId=475';
    var that = this; 
    wx.request({
      url: requstUrl,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
       var rdata = res.data;
       
       //self.data.seriesDetail = rdata.data;
       that.data.seriesDetail = rdata.data;
      
       that.setData({//更新
         seriesDetail:that.data.seriesDetail
        });
        console.log(that.data.seriesDetail);
      },
      fail: function(res) {
        console.log('fail')
      },
      complete: function() {
         console.log('always');
      }
    })

  },
  onLoad:function(){
    console.log('onload 事件 竟然更快？？')
  }
})
