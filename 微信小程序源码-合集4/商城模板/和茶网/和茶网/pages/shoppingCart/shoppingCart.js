Page({
  data: {
    modalHidden:false,
    shoppingCartInfo:[],
    allMoney:0
  },
  onLoad: function () {
    // console.log('loaded.');
  },
  onShow:function(){
    var that=this;
    if(wx.getStorageSync('shoppingCartInfo')){
      var arrInfo=wx.getStorageSync('shoppingCartInfo');
      var money=this.calcuteAllMoney(arrInfo);
      that.setData({
        modalHidden:true,
        shoppingCartInfo:arrInfo,
        allMoney:money
      });
    }else{
      that.setData({
        modalHidden:false
      });
    }
  },
  sub:function(event){
    var index=event.target.dataset.index;
    var arrInfo=this.data.shoppingCartInfo;
    if(arrInfo[index].goodSum>1){
      arrInfo[index].goodSum--;
    }
    var money=this.calcuteAllMoney(arrInfo);
    this.setData({
      shoppingCartInfo:arrInfo,
      allMoney:money
    });
    wx.setStorageSync('shoppingCartInfo',arrInfo);
  },
  add:function(event){
    var index=event.target.dataset.index;
    var arrInfo=this.data.shoppingCartInfo;
    arrInfo[index].goodSum++;
    var money=this.calcuteAllMoney(arrInfo);
    this.setData({
      shoppingCartInfo:arrInfo,
      allMoney:money
    });
    wx.setStorageSync('shoppingCartInfo',arrInfo);
  },
  deleteGood:function(event){
    var index=event.target.dataset.index;
    var arrInfo=this.data.shoppingCartInfo;
    arrInfo.splice(index,1);
    var money=this.calcuteAllMoney(arrInfo);
    this.setData({
      shoppingCartInfo:arrInfo,
      allMoney:money
    });
    wx.setStorageSync('shoppingCartInfo',arrInfo);
  },
  calcuteAllMoney:function(arr){
    var sum=0;
    for(var i=0;i<arr.length;i++){
      sum+=parseFloat(arr[i].goodPrice)*parseFloat(arr[i].goodSum);
    }
    return sum;
  }
});
