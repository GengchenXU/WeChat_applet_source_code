import xapi from "../../utils/xapi";
import util from "../../utils/util";
function checkForm(e){
  if(e.detail.value.name.length==0 && e.detail.value.number.length==0){
      wx.showToast({
        title: '用户名、手机不能为空',
        icon: 'fail',
        duration: 2000
      })
      return false; 
    }else if(e.detail.value.name.length==0){
      wx.showToast({
        title: '用户名不能为空',
        icon: 'fail',
        duration: 2000
      })
      return false; 
    }else if(e.detail.value.number.length==0){
      wx.showToast({
        title: '手机不能为空',
        icon: 'success',
        duration: 2000
      })
      return false; 
    }else if(!(/^1[34578]\d{9}$/.test(e.detail.value.number))){
        wx.showToast({
          title: '手机格式错误',
          icon: 'success',
          duration: 2000
        }) 
        return false; 
    }
    return true;
}
// pages/问促销价/index.js
Page({
  formSubmit: function(e) {
    var data=this.data;
    // console.log(this.data.options);
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // console.log(e.detail.value.name)
    if(!checkForm(e)){
      return;
    }
    util.extend(data.options,{ name: e.detail.value.name,mobile: e.detail.value.number});
    xapi.request({
      url: 'https://mp.xcar.com.cn/series/askprice',
      data: data.options,
      method: 'POST'})
      .then(function(res){
           var code=res.code;
           if(code==9 || code==200 && code!==100){
              wx.showToast({
                title: priceerror[code],
                icon: 'success',
                duration: 2000
              }) 
            }else{
              wx.showToast({
                title: '错误',
                icon: 'fail',
                duration: 2000
              })
            }
        },
        function(res){
          var code=res.code;
          if(code==100){
            wx.showToast({
              title: '当前网络忙，请稍后重试',
              icon: 'fail',
              duration: 2000
            })
          }
        })
  },
  onLoad:function(options){
    console.log(options);    
    var data = options;
    // 页面初始化 options为页面跳转所带来的参数
    var that = this// 不要漏了这句，很重要
    xapi.request({
      url: 'https://mp.xcar.com.cn/series/askprice-dealer',
      data: data
    }).then(function(res){
      console.log(res);  
        // 将获取到的json数据，存在名字叫zhihu的这个数组中
        that.setData({
          // cheXing: res.data.data,
          idx:res.data.data,
          // info:res.data.data['dealer-info']
          // res代表success函数的事件对，data是固定的，posts是是上面json数据中data
        });
    },function(err){
      // console.log(err);
      wx.showToast({
        title: '数据获取失败',
        icon: 'fail',
        duration: 2000
      })
    })
  }
})