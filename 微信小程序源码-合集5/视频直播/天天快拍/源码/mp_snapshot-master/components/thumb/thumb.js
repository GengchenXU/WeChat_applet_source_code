// wx promisify api
const app = getApp();
const root = app.host.root;
const request = app.api.request;
var thumb_url = root + 'v1/works/up';

const getAsynUserData = require('../../widget/getAsynUserData');
const root_images = app.host.root_images;

var getDataUrl;
var thumbs;

function packUpData(arr, root_images) {
  thumbs = [];

  if (Array.isArray(arr)) {
    arr.forEach(function (item) {
      var obj = {};
      var avatar = root_images + item.avatar;

      obj.avatar = avatar;
      obj.nickname = item.nickname;
      obj.is_ident = item.is_ident;
      obj.content = item.content;
      obj.id = +item.id;

      thumbs.push(obj);
    });
  };
  return thumbs;
};

function renderUpList(id, rootThat, access_token){

  var that = rootThat;
  var thumbs = that.data.thumbs;
  var tabLoadStyleData = that.data.tabLoadStyleData;
  var is_hide_work = that.data.is_hide_work;
  var is_hide_footer = that.data.is_hide_footer;

      //渲染作品点赞列表
      request({
        url: thumb_url,
        header: {
          accesstoken: access_token
        },
        data: {
          works_id: id
        }
      }).then(res => {
        let code = res.data.code;
        if (typeof code !== 'undefined' && code == 100001) {
          return Promise.resolve(res);
        }
        else {
          return Promise.reject(res);
        }
      }, err => {
        wx.showToast({
          title: '点赞列表数据请求失败'
        });
        return Promise.reject(err);
      }).then(res => {
        var thumb = res.data.data;
        thumbs = packUpData(thumb.items, root_images);

        var len = thumbs.length;
        if (len < 10) {
          tabLoadStyleData.is_finish = true;
        };
        tabLoadStyleData.hide_loading = true;
        is_hide_work = false;
        is_hide_footer = false;

        that.setData({
          thumbs: thumbs,
          tabLoadStyleData: tabLoadStyleData,
          is_hide_work: is_hide_work,
          is_hide_footer: is_hide_footer
        });
      }, err => {
        console.log(err);
      });
}

module.exports = {
  packUpData: packUpData,
  renderUpList: renderUpList
}
