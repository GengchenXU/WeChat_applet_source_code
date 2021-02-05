Page({
  data: {
    goodInfo:[],
    modalHidden:true,
    lunboImg:[],
    imgBox:[],
    ProductName:[],
    newPrice:"",
    oldPrice:"",
    goodDetail:[],
    shoppingCartInfo:{
      goodId:"",
      goodImg:"",
      goodName:"",
      goodPrice:"",
      goodSum:1
    }
  },
  onLoad: function (options) {
    var goodId=options.goodId;
    var that=this;
    wx.request({
      url: 'http://localhost:81/mock/detail.json',
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        for(var i=0;i<res.data.length;i++){
          if(goodId==res.data[i].ProductId){
            var arrImg=[];
            var arrDetail=[];
            for(var j=5;j<10;j++){
              arrImg.push(res.data[j].ProductImageList[j].ImageUrl)
            }
            for(var k=0;k<res.data[i].ProductParamList.length;k++){
              arrDetail.push(res.data[i].ProductParamList[k].ParamName+":"+res.data[i].ProductParamList[k].ParamValue);
            }
            that.setData({
              goodInfo:res.data[i],
              imgBox:res.data[i].ProductImageList,
              lunboImg:arrImg,
              ProductName:res.data[i].ProductName,
              goodDetail:arrDetail,
              'shoppingCartInfo.goodId':goodId,
              'shoppingCartInfo.goodImg':res.data[i].ProductImageList[0].ImageUrl
            });
          }
        }
      },
      fail: function (error) {
        console.log(error);
      }
    });
    wx.request({
      url: 'http://localhost:81/mock/sort'+goodId.substring(1,2)+'.json',
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        for(var i=0;i<res.data.length;i++){
          if(goodId==res.data[i].ProductId){
            that.setData({
              newPrice:res.data[i].ProductSalePrice,
              oldPrice:res.data[i].ProductMarketPrice,
              'shoppingCartInfo.goodName':res.data[i].ProductName,
              'shoppingCartInfo.goodPrice':res.data[i].ProductSalePrice
            })
          }
        }
      },
      fail: function (error) {
        console.log(error);
      }
    });
  },
  addToCar:function(){
    this.setData({
      modalHidden:false
    })
    if(wx.getStorageSync('shoppingCartInfo')){
      var arrInfo= wx.getStorageSync('shoppingCartInfo');
      var flag=true;
      for(var i=0;i<arrInfo.length;i++){
        if(this.data.shoppingCartInfo.goodId==arrInfo[i].goodId){
          arrInfo[i].goodSum++;
          flag=false;
        }
      }
      if(flag){
        arrInfo.push(this.data.shoppingCartInfo);
      }
    }else{
      var arrInfo=[];
      arrInfo.push(this.data.shoppingCartInfo);
    }
    wx.setStorageSync('shoppingCartInfo',arrInfo);
    console.log(wx.getStorageSync('shoppingCartInfo'));
  },
  hiddenModal:function(){
    this.setData({
      modalHidden:true
    })
  }
})
