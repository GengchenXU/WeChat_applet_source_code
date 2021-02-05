//获取应用实例
var app = getApp()
var api = require('../../utils/api');
var util = require('../../utils/util');

Page({
  data: {
    banner: null,
    autoplay: true,
    interval: 5000,
    duration: 800,
    shopType: [],
    serviceType: []
  },
  /*
  * 首页banner
  */
  setBanner: function () {
    let that = this;
    api.getAdByType({
      data: {
        adpos: 3,
      },
      success: (res) => {
        that.data.banner = res.data.result;
        that.setData(that.data);
      },
    });
  },
  setTypeList: function() {
    var that = this;
    api.getWelfareTypeList({
      success: (res) => {
        for (var i = res.data.result.length - 1; i >= 0; i--) {
        	var showType = res.data.result[i].showtype;
          if (showType == "1") {
            that.data.shopType.push(res.data.result[i]);
          } else if (showType == "0") {
            that.data.serviceType.push(res.data.result[i]);
          };
        };
        that.setData(that.data);
      }
    });
  },
  search: function() {
    var url = "../search/search";
	wx.navigateTo({
      url: url
    });
  },
  vipcard: function() {
  	wx.navigateTo({
      url: "../vip/vip"
    });
  },
  gotoWeizhang:function() {
	wx.showModal({
	    title: '提示',
	    content: '小程序暂不支持违章查询，目前正在紧锣密鼓开发中，请稍候…',
	    confirmColor: '#479de6',
	    success: function(res) {
	        
	    }
	})
  },
  gotoShop: function(res) {
	let param = res.currentTarget.dataset, title = param.title, id=param.id
    var url = "../merchant/merchant?type="+id+"&title="+ title;
	wx.navigateTo({
      url: url
    });
  },
  gotoService: function(res) {
  	let param = res.currentTarget.dataset, title = param.title, id=param.id
    var url = "../merchant/merchant?type="+id+"&title="+ title;
	wx.navigateTo({
      url: url
    });
  },
  /**
   * 入口
   */
  onLoad: function () {
    var that = this;
    that.setBanner();
    that.setTypeList();
  }
});