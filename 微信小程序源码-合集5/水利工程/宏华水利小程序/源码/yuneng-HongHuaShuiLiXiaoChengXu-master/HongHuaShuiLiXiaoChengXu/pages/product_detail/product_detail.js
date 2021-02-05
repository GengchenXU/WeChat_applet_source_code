//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showdetail:false,
  	 imgUrls: [
	      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
	      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
	      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
	    ],
	    indicatorDots: true,
	    autoplay: true,
	    interval: 3000,
	    duration: 1000,
	    indicatorcolor:"rgba(0,0,0,0.5)",
	    indicatorActive:'#2c98ef',
	    thisdate: '2016-09-01',
   		time: '12:01'
	},
	 bindDateChange: function(e) {
			console.log('picker发送选择改变，携带值为', e.detail.value)
			this.setData({
				date: e.detail.value
			})
		},
   showdetail:function(){
     this.setData({
       showdetail: !this.data.showdetail
     })
   }//showdetail
})
