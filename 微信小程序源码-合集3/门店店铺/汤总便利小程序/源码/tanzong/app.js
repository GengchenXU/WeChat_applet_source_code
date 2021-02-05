//app.js
const Login = require('./api/login');
import config from './config';
App({
  onLaunch: function () {
    //设置登录的服务器地址
    Login.setLoginUrl(config.loginUrl);
    // 登录
    this.globalData.userInfo = wx.getStorageSync('user');
    this.doLogin();
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(res.userInfo)
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  doLogin() {
    Login.login({
      success: result => {
        console.log('登录成功', result);
        wx.setStorageSync('user', result);
        this.globalData.userInfo = result;
        //console.log(wx.getStorageSync('user'))
      },
      fail: (error) => {
        console.log('登录失败', error);
      }
    });
  },
  getUserInfo (cb) {
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: ()=> {
          wx.getUserInfo({
            success:  (res)=> {
              this.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})