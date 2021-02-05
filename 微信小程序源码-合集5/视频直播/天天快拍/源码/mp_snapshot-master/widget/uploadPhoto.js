var getAsynUserData = require('../widget/getAsynUserData');


function uploadPhoto ( that, util, uploadChangeValue, e ) {
  getAsynUserData(function (user) {
    if (user==' ') {
      wx.showToast({
        title: '用户登录授权失败'
      });
    }
    else {
      var id = +e.currentTarget.id;
      var route = util.getRoute( that );
      util.addPhoto( route, uploadChangeValue  ,id );
    }
  })
}
module.exports = uploadPhoto;