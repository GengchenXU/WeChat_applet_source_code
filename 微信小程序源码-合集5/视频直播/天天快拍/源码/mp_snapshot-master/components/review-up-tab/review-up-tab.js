const getAsynUserData = require('../../widget/getAsynUserData');
const renderThumbsData = require('../../components/thumb/thumb');

const app = getApp();
const root = app.host.root;
const request = app.api.request;
const root_images = app.host.root_images;
const url = {
  thumb_url: root + 'v1/works/up',
  worksUp: root + 'v1/works/up',
}
var access_token;
var clicktag = 0;


function toggleThumb(e) {
  //切换点赞效果  
  var _this = this;
  var works = _this.data.item;
  var thumbs = _this.data.thumbs;
  var $ele = e.target;
  var idx = $ele.dataset.index;
  var id = $ele.id;
  var newStatus;
  var newNum;

  //判断用户是否登录
  getAsynUserData(function (user) {
    if (user == ' ') {
      access_token = ' ';
      wx.showToast({
        title: '用户未登录授权'
      });
    }
    else {
      access_token = user.access_token;

      if (clicktag == 0) {
        clicktag = 1;

        // 提交点赞数
        request({
          url: url.worksUp,
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'accesstoken': access_token
          },
          data: {
            works_id: id
          }
        }).then((res) => {
          if (typeof res.data.code !== 'undefined' && res.data.code == 100001) {
            return Promise.resolve(res);
          }
          else {
            return Promise.reject(res);
          }
        }, (err) => {
          wx.showToast({
            title: '点赞请求失败'
          });
          return Promise.reject(err);
        }).then(res => {

          //点赞或取消赞
          if (!idx && idx != 0) {
            if ($ele.dataset.thumb) {
              newStatus = 0;
              newNum = parseInt(works.up_count) - 1;

              wx.showToast({
                title: '谢谢你赞过'
              });
            } else {
              newStatus = 1;
              newNum = parseInt(works.up_count) + 1;

              wx.showToast({
                title: '谢谢你的赞'
              });
            }
            works.is_up = newStatus;
            works.up_count = newNum;
          } else {
            if ($ele.dataset.thumb) {
              newStatus = 0;
              newNum = parseInt(works[idx].up_count) - 1;

              wx.showToast({
                title: '谢谢你赞过'
              });
            } else {
              newStatus = 1;
              newNum = parseInt(works[idx].up_count) + 1;

              wx.showToast({
                title: '谢谢你的赞'
              });
            }
            works[idx].is_up = newStatus;
            works[idx].up_count = newNum;
          }
        
         //判断是否需要请求点赞列表
          if (thumbs){
            //渲染作品点赞列表
            renderThumbsData.renderUpList(id, _this);
          }
        
          _this.setData({
            item: works
          });

        }, err => {
          var msg = err.data.message;
          if (msg) {
            wx.showToast({
              title: msg
            });
          };
        });
        //防止频点出现假数据
        setTimeout(function () { clicktag = 0 }, 1000);
      }
      else {
        wx.showToast({
          title: '点太快啦，喝口茶吧！'
        });
      }
    }
  });
}

module.exports = {
  toggleThumb: toggleThumb,
}