var app = getApp()
Page( {  
  data: {
    id: "",
    windowHeight: 0,
    windowWidth: 0,
    offset: 0,
    pageSize: 15,
    goods: [],
    totalNum: 0,
    initLoadDataNum: 0,
    bottomLoadMsg: "点我加载"
  }, 
  onLoad: function (option) {
    var that = this
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      id: option.id,
      windowHeight: sysInfo.windowHeight,
      windowWidth: sysInfo.windowWidth
    })
    getData(that, true)
  },
  bottomLoad: function(){
    getData(this, false)
  }
})
function getData(that, first){
  wx.request({
    url: app.globalData.urlHeader + '/api/v1/response/query?dynamicId=' + that.data.id + '&type=1&offset=' + that.data.offset + '&pageSize=' + that.data.pageSize,
    success: function (res) {
      var ret = res.data
      var goods = that.data.goods
      var offset = that.data.offset
      if (ret != null && ret.data != null && ret.data.length > 0) {
        for(var i=0; i<ret.data.length;i++){
          var good = ret.data[i]
          if (i == ret.data.length - 1) {
            offset = good.createTime
          }
          goods.push(good)
        }
        that.setData({
          goods: goods,
          offset: offset
        })
      } else {
        that.setData({
          bottomLoadMsg: "我可是有底线的"
        })
      }
      if(first){
        var totalNum = 0
        var initLoadDataNum = 0
        if (ret != null && ret.data != null && ret.data.length > 0) {
          totalNum = ret.total
          initLoadDataNum = ret.data.length
        }
        that.setData({
          initLoadDataNum: initLoadDataNum,
          totalNum: totalNum
        })
      }
    }
  })
}