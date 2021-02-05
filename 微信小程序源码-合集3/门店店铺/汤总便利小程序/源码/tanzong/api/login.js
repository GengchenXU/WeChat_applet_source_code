var config = require('../config');



/***
 * @class
 * 表示登录过程中发生的异常
 */
var LoginError = (function () {
  function LoginError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  LoginError.prototype = new Error();
  LoginError.prototype.constructor = LoginError;

  return LoginError;
})();

/**
 * 微信登录，获取 code 和 encryptData
 */
var getWxLoginResult = function getLoginCode(callback) {
  wx.login({
    success: function (loginResult) {
      wx.getUserInfo({
        success: function (userResult) {
          callback(null, {
            code: loginResult.code,
            encryptedData: userResult.encryptedData,
            iv: userResult.iv,
            userInfo: userResult.userInfo,
          });
        },

        fail: function (userError) {
          var error = new LoginError('警告', '获取微信用户信息失败，请检查网络状态');
          error.detail = userError;
          callback(error, null);
        },
      });
    },

    fail: function (loginError) {
      var error = new LoginError('警告', '微信登录失败，请检查网络状态');
      error.detail = loginError;
      callback(error, null);
    },
  });
};


var noop = function noop() { };

var defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  loginUrl: null,
  loginMethod: 'POST'
};


/**
 * @method
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.loginUrl 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "GET"
 * @param {Function} options.success(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
var login = function login(options) {
  options = utilsExtend({}, defaultOptions, options);
  if (!defaultOptions.loginUrl) {
    options.fail(new LoginError('警告', '登录错误：缺少登录地址，请通过 setLoginUrl() 方法设置登录地址'));
    return;
  }

  var doLogin = () => getWxLoginResult(function (wxLoginError, wxLoginResult) {
    if (wxLoginError) {
      options.fail(wxLoginError);
      return;
    }

    var userInfo = wxLoginResult.userInfo;
    // 构造请求头，包含 code、encryptedData 和 iv
    var code = wxLoginResult.code;
    var encrypted = wxLoginResult.encryptedData;
    var iv = wxLoginResult.iv;
    var aid = config.aid;
    //合并对象  构造需要传入的数据
 
    // 请求服务器登录地址，获得会话信息
    wx.request({
      url: options.loginUrl,
      header: {
        'Accept':'application/json',
        'Content-Type': 'application/json',
        encrypted, 
        iv, 
        code
      },
      method: options.loginMethod,
      data: Object.assign({}, userInfo, {aid}),
      success: function (result) {
        var data = result.data;
       
        wx.setStorageSync('token', result.data.data.token);
        options.success(result.data.data);
      },

      // 响应错误
      fail: function (loginResponseError) {
        var error = new LoginError('警告', '登录失败，可能是网络错误或者服务器发生异常');
        options.fail(error);
      },
    });
  });

  if (wx.getStorageSync('token')) {
    wx.checkSession({
      success: function () {
        //成功登陆
        console.log('成功验证Sessionkey')

      },
      fail: function () {
        wx.removeStorageSync('token')
        doLogin();
      },
    });
  } else {
    doLogin();
  }
};

var setLoginUrl = function (loginUrl) {
  defaultOptions.loginUrl = loginUrl;
};

/**拓展对象 **/
function utilsExtend(target) {
  var sources = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < sources.length; i += 1) {
    var source = sources[i];
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};


module.exports = {
  LoginError: LoginError,
  login: login,
  setLoginUrl: setLoginUrl,
};
