const app = getApp();
const root = app.host.root;
import getAsynUserData from '../../util/getAsynUserData';
import packingRequest from '../../util/packingRequest';
let url = root + 'v1/works/comment';
let works_id;
let reply;
let nickname;
var isSubmit = false;
Page({
  data: {
    value: '',
    placeholder: '发表评论'
  },
  onLoad: function (opt) {
    var id = opt.id
    var comment_id = opt.reply;
    var nickname = opt.nickname;

    var placeholder = this.data.placeholder;
    works_id = id;
    reply = comment_id ? comment_id : 0;
    nickname = nickname ? '@' + nickname : '';

    if (!works_id) {
      return wx.showToast({
        title: '作品id不存在'
      });
    };
    if (nickname) {
      placeholder = '回复' + nickname
      this.setData({
        placeholder: placeholder
      });
    };
  },
  getValue: function (e) {
    var value = this.data.value;
    value = e.detail.value.trim();

    this.setData({
      value: value
    });
  },
  submitData: function (e) {
    var placeholder = this.data.placeholder;
    var value = this.data.value;
    var content = value;
 

    if (placeholder !== '发表评论') {
      content = placeholder + ' ' + value;
    };
    
      this.p = new Promise(function (resolve, reject) {
        if ((!content) || (content.trim() == placeholder.trim())) {
          wx.showToast({
            title: '评论内容不能为空'
          });
        }
        else {
          resolve(content);
        }
      });
      this.p.then(res => {
        getAsynUserData(function (user) {
          if (!user) {
            wx.showToast({
              title: '微信授权登录失败,请删除小程序重新进入'
            });
          }
          else {
            var access_token = user.access_token;
            if (!isSubmit){
              isSubmit = true;
              packingRequest({
                url: url,
                method: 'post',
                header: {
                  accesstoken: access_token
                },
                data: {
                  works_id: works_id,
                  content: content,
                  reply: reply
                }
              }).then(res => {
                wx.showToast({
                  title: '评论成功'
                });
                //防止频点发出多条评论
                setTimeout(function () { isSubmit = false }, 1000);
                wx.redirectTo({
                  url: '../../pages/work-details/work-details?id=' + works_id
                });
                //console.log(res);
              }, err => {
                console.log(err);
              })
            }else{
              wx.showToast({
                title: '点太快啦，喝口茶吧！'
              });
            }
          }
        });
      });
  }
});