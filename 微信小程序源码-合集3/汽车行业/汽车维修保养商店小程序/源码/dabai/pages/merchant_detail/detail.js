//获取应用实例
var app = getApp()
var api = require('../../utils/api');
var util = require('../../utils/util');

Page({
  data: {
  	merchantId:0
  },
  getMerchantDetail: function() {
    var that = this;
    api.getMerchantDetail({
      data: {
        serviceuserid: that.data.merchantId,
      },
      success: (res) => {
      	res.data.result.markers = [{
      		id: "1",
            latitude: res.data.result.latitude,
            longitude: res.data.result.longitude,
            width: 25,
            height: 25,
            iconPath: "../../images/merchant_icon.png",
            title: res.data.result.shopname
      	}];
        that.setData(res.data.result);
      }
    });
  },
  callService: function() {
  	wx.makePhoneCall({
      phoneNumber: '0310-5345888',
    })
  },
  callMerchant: function(view) {
  	var tel = view.currentTarget.dataset.value;
  	wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  gotoWelfareDetail: function(view) {
  	var welfareId = view.currentTarget.dataset.value;
    var url = "../welfare_detail/detail?id="+welfareId;
	wx.navigateTo({
      url: url
    });
  },
  /**
   * 入口
   */
  onLoad: function (option) {
  	this.data.merchantId = option.id;
    this.getMerchantDetail();
  }
});