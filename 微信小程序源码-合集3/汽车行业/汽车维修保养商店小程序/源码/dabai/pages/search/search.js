var app = getApp()
var api = require('../../utils/api');
var util = require('../../utils/util');

Page({
  data: {
	merchantList:[],
    pageNum:1,
    isNextPage:true,
    name: ""
  },
  /*
  * 首页banner
  */
  searchWelfare: function (isClean) {
  	if(isClean) {
      this.data.pageNum = 1;
      if (this.data.merchantList.length > 0) {
      	this.data.merchantList.splice(0, this.data.merchantList.length);
      };     
    } else {
      this.data.pageNum += 1;
    }
    let that = this;
    api.searchWelfare({
      data: {
        startpage: that.data.pageNum,
        pagesize: 20,
        searchname: that.data.name,
        latitude: 0,
        longitude: 0
      },
      success: (res) => {
      	that.data.merchantList = that.data.merchantList.concat(res.data.result);
      	that.data.isNextPage = res.data.isNextPage;
        that.setData(that.data);
      },
    });
  },

  searchName: function(e) {
  	this.data.name = e.detail.value
  },

  onReachBottom: function() {
  	if (this.isNextPage) {
		this.searchWelfare(false)
  	};
  },

  onShareAppMessage: function() {
     return {
       title:'搜索',
       path:'pages/search/search'
      }
 	},
  /**
   * 入口
   */
  onLoad: function (option) {
    
  }
});
