const app = getApp();
const request = app.api.request;

class Load {

  constructor(host) {
    this.host = host;
    this.is_finish = false;
    this.is_tab_finish = false;
    this.page_num = 2;

    this.first = true;

    this.is_request_complete = true;
  }
  loading(that, id, cb, access_tocken, is_page) {
    var _this = this;
    var url = this.host;
    var loadStyleData = that.data.loadStyleData;
    var tabLoadStyleData;
    var is_finish;

    if (that.data.tabLoadStyleData) {
      is_finish = _this.is_tab_finish
    } else {
      is_finish = _this.is_finish
    }
    if (!is_finish) {
      if (that.data.tabLoadStyleData) {
        tabLoadStyleData = that.data.tabLoadStyleData;
        tabLoadStyleData.hide_loading = false;
        that.setData({
          tabLoadStyleData: tabLoadStyleData
        });
      } else {
        loadStyleData.hide_loading = false;
        that.setData({
          loadStyleData: loadStyleData,
        });
      }

      if (_this.is_request_complete) {
        _this.is_request_complete = false;
        if (is_page) {
          request({
            url: url,
            data: {
              page: _this.page_num,
              per_num: 10
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
              title: '接口调用失败'
            });
            return Promise.reject(err);
          }).then(res => {
            _this.is_request_complete = true;
            cb(res, _this);
          }, err => {
            _this.is_request_complete = true;
            console.log(err);
          });
          _this.page_num++;
        }
        else {
          if (!access_tocken) {
            access_tocken = '';
          };
          request({
            url: url,
            header: {
              accesstoken: access_tocken
            },
            data: {
              nextId: id,
              per_num: 10
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
              title: '接口调用失败'
            });
            return Promise.reject(err);
          }).then(res => {
            _this.is_request_complete = true;
            cb(res, _this);
          }, err => {
            _this.is_request_complete = true;
            console.log(err);
          });
        }
      };

    }
  }
  throttel(fn, delay, str) {
    var timer;
    var start = Date.now();
    var _this = this;
    var str = str ? str : ' ';

    return function () {
      var ctx = this;

      if (_this.first) {
        fn(str);
        _this.first = false;
      }
      else {
        var end = Date.now();
        var delta = end - start;

        if (delta >= delay) {
          clearTimeout(timer);
          fn(str);
          // fn.apply(ctx);
          start = Date.now();
        }
        else {
          clearTimeout(timer);
          timer = setTimeout(() => {
            fn(str);
            start = Date.now();
          }, delay - delta);
        }
      }
    }
  }
}
module.exports = Load;