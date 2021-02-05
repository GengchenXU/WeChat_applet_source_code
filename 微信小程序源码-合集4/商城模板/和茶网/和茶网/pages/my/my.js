Page({
  data: {
    modalHidden:false,
    boxHidden:false,
    modal:{
      "username":"",
      "password":""
    },
    nameCheck:false,
    imgBox:[
      {
        "icon":"/images/myImages/l-dingdan.png",
        "info":"我的订单"
      },
      {
        "icon":"/images/myImages/l-shoucang.png",
        "info":"我的收藏"
      },
      {
        "icon":"/images/myImages/l-address.png",
        "info":"收货地址管理"
      },
      {
        "icon":"/images/myImages/l-jifen.png",
        "info":"积分商城"
      },
      {
        "icon":"/images/myImages/l-help.png",
        "info":"帮助中心"
      },
      {
        "icon":"/images/myImages/l-kefu.png",
        "info":"联系客服"
      },
      {
        "icon":"/images/myImages/l-about.png",
        "info":"关于我们"
      }
    ]
  },
  onLoad: function () {

  },
  onShow: function () {
    if(wx.getStorageSync("username")==""){
      this.setData({
        modalHidden:false,
        boxHidden:false
      })
      console.log("no");
    }else{
      var getUsername=wx.getStorageSync("username");
      var getPassword=wx.getStorageSync("password");
      this.setData({
        modalHidden:true,
        boxHidden:true,
        'modal.username': getUsername,
        'modal.password': getPassword
      })
      console.log("has");
    }
  },
  signConfirm:function(){
    if(this.data.nameCheck){
      wx.setStorageSync('username', this.data.modal.username);
      wx.setStorageSync('password', this.data.modal.password);
      this.setData({
        modalHidden:true,
        boxHidden:true
      })
    }
  },
  saveUsername:function(event){
    if(event.detail.value!=""){
      this.setData({
        'modal.username': event.detail.value,
        nameCheck:true
      });
    }
  },
  savePassword:function(event){
    this.setData({
      'modal.password': event.detail.value
    });
  },
  exit:function(){
    wx.setStorageSync("username","");
    wx.setStorageSync("password","");
    this.setData({
      modalHidden:false,
      boxHidden:false
    })
  }
});
