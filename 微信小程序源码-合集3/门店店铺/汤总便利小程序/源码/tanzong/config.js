/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

const host = "192.168.0.102:8110"

const config = {

  // 下面的地址配合云端 Server 工作
  host,
  
  //api url 
  apiUrl: `http://${host}/wx`,

  // 登录地址，用于建立会话
  loginUrl: `http://${host}/wx_login`,

  // 用code换取openId
  openIdUrl: `http://${host}/openid`,

  //项目id 
  aid:1
};

module.exports = config