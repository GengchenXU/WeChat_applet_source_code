import drawer from '../../pages/drawer/drawer.js'
import xapi from "../../utils/xapi"
import util from "../../utils/util"

Page({
  data:{
    brandData:{},
    toView:'',
    length:'',
    winHeight:'',
    winWidth:'',
    pixelRatio:'',
    brandList:[],
    scrollTop:0,
    currentTab: 0
  },
  onLoad:function(options){
    var that = this;
    var res = wx.getSystemInfoSync();
    that.setData({
      winHeight: res.windowHeight,
      winWidth: res.windowWidth,
      pixelRatio: res.pixelRatio,
      scrollYFlag: true
    });
    //抽屉组件
    that.dw = new drawer(that);

    console.log(res)
  },
  onReady: function () {
    console.log('onReady 事件')
    var requestUrl = "https://mp.xcar.com.cn/series/brand-list";
    var that = this; 
    xapi.request({
      url: requestUrl,
      data: {},
      method: 'GET' // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then(function(res){
       var rdata = res.data;
       that.data.brandData = rdata.data;
       var myList = rdata.data.list;
       that.data.brandList = that.reCombine(myList);
       that.setData({//逻辑层到视图层
         brandData:that.data.brandData,
         brandList:that.data.brandList,
         num:1+parseInt(Math.random() * 5)
        });
    })
  },
  reCombine:function(arr){
    var res = [], obj = {}, index = 0;
    arr.forEach(function(item){
      if(obj.hasOwnProperty(item.letter)){
          res[obj[item.letter]].items.push(item);
      }
      else{
          obj[item.letter] = index++;//记录索引 0 1 2
          res.push(
            {
              flag:item.letter,
              items:[item]
            }
          );
      }
    });
    return res;
  },
  clickLetter: function (event) {
    var letter = event.target.dataset.letter;
    console.log(event);
    var that = this;
    that.setData({
      toView: letter
    })
  },
  goTop:function(){
    var that = this;
    that.setData(
      {
        scrollTop:0
      }
    );
  },
  scrollSlider:function(e){
    // console.log(e);
  },
  touchMove:function(e){
    var that = this;
    var _cX = e.touches[0].clientX;
    var _length = that.data.brandList.length;
    var _winH = that.data.winHeight;
    var _cY = e.touches[0].clientY - (_winH - 20 * _length) / 2;
    var tem = '';
    var _letterIndex = parseInt(_cY / 20); //0 1 2 3 

    // console.log('索引值：'+_letterIndex);

    if(_letterIndex <= 0){
      tem = 'hot';
    }else{
      tem = that.data.brandList[_letterIndex].flag;
    }

    util.throttle(function(){
      that.setData({
          toView: tem,
          ismove:true
      });
    }(),200)
  },
  touchEnd:function(){
     this.setData({
          ismove:false
      });
  },
//   bindChange: function( e ) {
//       var that = this;
//       that.setData( { currentTab: e.detail.current });
//  },
//   swichNav: function( e ) {
//     var that = this;
//     if( this.data.currentTab === e.target.dataset.current ) {
//         return false;
//     }
//     else{
//         that.setData( {
//           currentTab: e.target.dataset.current
//         })
//     }
//   },
  showDrawer:function(e){
    var that = this;
    that.dw.requestdata({
        "pbid": e.currentTarget.dataset.id
    },!1)
  },
  gotoSeries:function(e){
    var data={
      pserId:e.currentTarget.dataset.pserid,
      cityId:475
    }
    //跳转到新页面，可返回
     wx.navigateTo({  
      url: '../overView/overView?pserId=' + data.pserId+'&cityId=' + 475,
      success: function(res){  
        //调取弹窗
        wx.showToast({
          title: '成功'+data.pserId,
          icon: 'success',
          duration: 0
        })
      },  
      fail: function() {  
        // fail  
      },  
      complete: function(res) {  
        console.log(res) 
      }  
    })  
  }
});
