// map.js
Page({
  data: {
    markers: [{
      iconPath: "img/mapicon.gif",
      id: 0,
      latitude: 30.619850,
      longitude: 104.043170,
      width: 30,
      height: 30,
      animationData: {}
    }],
    polyline: [{
      points: [{
        longitude: 0,
        latitude: 0
      }, {
        longitude: 30.547920,
        latitude: 23.21229
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  call:function(event){
		wx.makePhoneCall({
		  phoneNumber: event.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
		})
	},
	onLoad:function(){
		wx.getLocation({
		  type: 'wgs84',
		  success: function(res) {
		    var latitude = res.latitude
		    var longitude = res.longitude
		    var speed = res.speed
		    var accuracy = res.accuracy
		    console.log(res)
		  }
		})
	},
	gomap:function(){
		
			var latitude = 30.619850
	    var longitude = 104.043170
	    wx.openLocation({
	      latitude: latitude,
	      longitude: longitude,
	      scale: 28,
	      name:'成都互诚在线科技有限公司',
	      address:'成都市武侯区创业路49号4层'
	    })
	},
	copyUrl:function(event){
		wx.showToast({
		  title: '长按复制'+ event.currentTarget.dataset.text,
		  image:'img/langclick.png',
		  icon: 'success',
		  duration: 2000
		})
	}
	
})