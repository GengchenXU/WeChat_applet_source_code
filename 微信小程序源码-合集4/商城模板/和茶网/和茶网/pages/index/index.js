Page({
  data: {
    lunbo:{
      imgUrls: [
        'http://img1.hecha.cn/MobileImage/20160829/20160829185059303.jpg',
        'http://img1.hecha.cn/MobileImage/20160829/20160829183159678.jpg',
        'http://img1.hecha.cn/MobileImage/20160829/20160829191000772.jpg'
      ],
      indicatorDots: true,
      autoplay: true,
      interval: 4000,
      duration: 300
    },
    imgBox:[]
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:81/mock/index.json',
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        that.setData({
          imgBox: res.data
        });
      },
      fail: function (error) {
        console.log(error);
      }
    });
  },
  bindToSortMenu: function() {
    wx.navigateTo({
      url: '/pages/sortMenu/sortMenu'
    })
  },
  bindToDetail: function() {
    wx.navigateTo({
      url: '/pages/detail/detail'
    })
  },
});
