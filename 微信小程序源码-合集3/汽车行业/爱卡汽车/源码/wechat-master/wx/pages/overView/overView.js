Page({
  data:{
    detailData:{},
    categoryList:[],
    subSeriesList:[],
    carList:[],
    currentTab:'在售',
    winHeight:'',//系统参数
    winWidth:'',
    myData:{}
  },
  onLoad:function(options){
    var that = this;
    console.log('load!!');
    that.setData({
      myData:options
    });
    console.log(that.data.myData);
    that.getSysInfo();
  },
  onReady:function(){
    var that =  this ;
    var data = that.data.myData;
    wx.request({
      url: 'https://mp.xcar.com.cn/series/series-cars',
      data: data,
      method: 'GET',
      success: function(res){ 
        var rdata = res.data;
        console.log(rdata);
        that.setData({
          detailData:rdata.data,
          categoryList:rdata.data.categoryList
        });
        
        that.resetSub();
        that.resetCar();
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  onHide:function(p){
    // console.log(p);
  },
  getSysInfo:function(){
    var that = this;
    var res = wx.getSystemInfoSync();
    that.setData({
      winHeight: res.windowHeight,
      winWidth: res.windowWidth,
      pixelRatio: res.pixelRatio
    });
  },
  resetSub:function(){
      var that = this;
      var arr = [];
      for(var i in that.data.categoryList){
        arr.push(that.data.categoryList[i].subSeriesList);
      }
      that.setData({
        subSeriesList:arr
      });
      console.log(that.data.subSeriesList)
  },
  resetCar:function(){
      var that = this;
      var arr = [];
      for(var i in that.data.subSeriesList[0]){
        arr.push(that.data.subSeriesList[0][i].carList);
        
      }
      that.setData({
        carList:arr
      });
      console.log(that.data.carList)
  },
  swichTab:function(e){
    console.log(e);
    var that = this;
    if(that.data.currentTab == e.currentTarget.dataset.current){
      return false;
    }
    else{
      that.setData({
        currentTab:e.currentTarget.dataset.current
      });
    }
  }

})