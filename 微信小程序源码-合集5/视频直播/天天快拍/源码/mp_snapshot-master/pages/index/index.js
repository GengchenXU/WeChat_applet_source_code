import {
  initDateRange,
  changeDate,
  getSelectDayTopPhoto, getCurrentTopPhoto, getPreTopPhoto, getNextTopPhoto,
  getSelectDayPhotos, getCurrentPhotos, getPrevPhotos, getNextPhotos
} from '../../actions'
import addPhoto from '../../util/addPhoto'
import getRoute from '../../util/getRoute'
import isEmptyObj from '../../util/isEmptyObj'
import packingRequest from '../../util/packingRequest'
import getAsynUserData from '../../util/getAsynUserData'

import Load from '../../components/load/load'
import sliderFunc from '../../components/slider/slider'

const app = getApp();
const root = app.host.root;
const root_images = app.host.root_images;

const store = app.store;
const root_reducer = store.getState();
const dispatch = store.dispatch;

const url = {
  photos: root + 'v1/fastphoto',
  top: root + 'v1/fastphoto/top'
}

let next_id;

Page({
  data: {
    top_photo: root_reducer.top_photo,
    photos: [],
    date: root_reducer.date,
    about_url: root_reducer.about_url,
    date_range: root_reducer.date_range,

    // 加载更多
    loadStyleData: {
      hide_loading: false,
      is_finish: false,
      has_no_data: false,
      tips: ''
    },
    is_finish: false,
    slider: root_reducer.slider,
  },
  onLoad: function () {
    var _this = this;

    _this.init();

    // 时间
    var now = Date.now();
    var now_obj = this.formatTimeStamp(now);
    now = now_obj.year + '-' + now_obj.month + '-' + now_obj.date;
    this.changeDate(now);

    // 初始化加载更多
    this.load = new Load(url.photos);
    this.loadingHandler = this.load.throttel(this.loadMore, 3000);

    // 下拉刷新
    this.is_pull_down_refresh = false;

  },
  init: function () {
    var _this = this;
    var loadStyleData = this.data.loadStyleData;
    // 快拍第一
    var p1 = this.loadTopPhoto('');
    // 投稿作品
    var p2 = this.loadPhotos('');

    return this.refreshData(p1, p2).then(res => {
      var top = res[0]
      var photos = res[1];
      var len = photos.length;
      loadStyleData.hide_loading = true;

      // 初始化加载没数据
      if (len == 0) {
        loadStyleData.has_no_data = true;
        loadStyleData.tips = '赶快来参加天天快拍活动，赢取奖金吧!';
      };

      _this.setData({
        loadStyleData: loadStyleData,
        top_photo: top,
        photos: photos
      });
      wx.hideLoading();

      return Promise.resolve(res);
    }, err => {
      var status_code = err.statusCode;

      loadStyleData.hide_loading = true;
      loadStyleData.has_no_data = true;
      loadStyleData.tips = status_code + '错误';

      _this.setData({
        loadStyleData: loadStyleData
      });
      wx.hideLoading();

      return Promise.reject(err);
    });
  },
  renderTopPhoto: function (obj) {
    var render_obj = {};
    if (!isEmptyObj(obj)) {
      var img_arr = [];

      if (Array.isArray(obj.details)) {
        obj.details.forEach(function (item) {
          var obj = {};
          obj.src = root_images + item.src;

          img_arr.push(obj);
        });
      }
      var des = this.trimStr(obj.subject);
      var opinion = this.trimStr(obj.fastphoto.remark);

      render_obj.rewards = obj.fastphoto.rewards;
      render_obj.photos = img_arr;
      render_obj.id = obj.id;
      render_obj.author = obj.user.nickname;
      render_obj.location = obj.location;
      render_obj.des = des;
      render_obj.opinion = opinion;
      render_obj.comment_count = obj.comment_count;
    }
    return render_obj;
  },
  trimStr: function (val) {
    if (typeof val == 'string') {
      return val.trim();
    }
    else {
      return '';
    }
  },
  renderPhotos: function (arr) {
    var render_arr = [];
    var _this = this;

    if (Array.isArray(arr)) {
      arr.forEach(function (item, index) {
        var obj = {};

        obj.id = item.id;
        obj.avatar = root_images + item.user.avatar;
        obj.nickname = item.user.nickname;
        obj.cover = root_images + item.cover;
        obj.count = item.count;
        obj.des = item.subject;

        render_arr.push(obj);
      });

    }

    return render_arr;
  },
  dateToDay: function (day) {
    switch (day) {
      case 0:
        return '日'
      case 1:
        return '一'
      case 2:
        return '二'
      case 3:
        return '三'
      case 4:
        return '四'
      case 5:
        return '五'
      case 6:
        return '六'
    }
  },
  renderDate: function (obj) {
    var render_date = {};
    if (!isEmptyObj(obj)) {
      var current = obj.works_date;
      var current_arr = current.split('-');
      var current_date = current_arr[2];
      var current_month = current_arr[1];

      var current_day = new Date(current).getDay();
      var pre = obj.relate.pre;
      current_day = this.dateToDay(current_day);
      render_date.start = obj.date_range.range_min;

      // 现在
      render_date.current = current;
      render_date.current_month = current_month;
      render_date.current_date = current_date;
      render_date.current_day = current_day;

      // 前一天
      if (typeof pre == 'string' && pre !== 0) {
        var pre_arr = pre.split('-');
        var pre_month = current_arr[1];
        var pre_date = pre_arr[2];
        if (current_arr[2] == '01' && typeof current_arr[2] == 'string') {
          pre_month = pre_month - 1;
          render_date.pre_month = pre_month;
        } else {
          render_date.pre_month = pre_month;
        }
        render_date.pre_date = pre_date;
      };
      render_date.pre = pre;

      // 后一天
      render_date.next = obj.relate.next;
    }

    return render_date;
  },
  renderDateRange: function (obj) {
    if (!isEmptyObj(obj)) {
      return {
        start: obj.range_min,
        end: obj.range_max
      }
    };
  },
  loadTopPhoto: function (date) {
    var _this = this;

    return packingRequest({
      url: url.top,
      data: {
        during: date
      }
    }).then(res => {
      var top = res.data;

      if (typeof top == 'object') {
        var render_top_photo = _this.renderTopPhoto(top.data.items);
        // 初始化选择日期范围
        if (!date) {
          var render_date = _this.renderDate(top.data);
          var render_date_range = _this.renderDateRange(top.data.date_range);
          dispatch(initDateRange(render_date_range));
          _this.setData({
            date_range: render_date_range,
            date: render_date
          });
        }

        return Promise.resolve(render_top_photo);
      }
    }, err => {
      console.log(err);
      return Promise.reject(err);
    });

  },
  loadPhotos: function (date) {
    var _this = this;
    return packingRequest({
      url: url.photos,
      data: {
        during: date,
        per_num: 10
      }
    }).then(res => {
      var photos = res.data.data;
      var len = photos.length;
      if (Array.isArray(photos)) {
        if (len) {
          next_id = photos[len - 1].id;
        }
        var render_photos = _this.renderPhotos(photos);
        
        return Promise.resolve(render_photos);
      }
    }, err => {
      console.log(err);
      return Promise.reject(err);
    });
  },
  loadMore: function () {
    var that = this;
    var photos = this.data.photos;
    var loadStyleData = this.data.loadStyleData;
    var current = this.data.date.current;

    this.load.loading(that, next_id, function (res, _this) {
      var arr = res.data.data;
      var len = arr.length;
      loadStyleData.hide_loading = true;

      // 判断是否浏览完毕
      if (!len) {
        _this.is_finish = true;
        loadStyleData.is_finish = true;

        return that.setData({
          loadStyleData: loadStyleData
        });
      }

      // 加载数据
      photos = photos.concat(that.renderPhotos(arr, root_images));
      next_id = photos[photos.length - 1].id;

      that.setData({
        loadStyleData: loadStyleData,
        photos: photos
      });

    }, current);
  },
  formatTimeStamp(timestamp) {
    var dt = new Date(timestamp);
    var year = dt.getFullYear();
    var month = dt.getMonth() + 1;
    var date = dt.getDate();
    if ((month > 0) && (month < 10)) {
      month = '0' + month;
    }
    if ((date > 0) && (date < 10)) {
      date = '0' + date;
    }
    var day = this.dateToDay(dt.getDay());
    return {
      year: year,
      month: month,
      date: date,
      day: day
    }
  },
  changeDate: function (value) {
    var _this = this;
    var end = store.getState().date_range.end;
    var start = store.getState().date_range.start;

    var current = value;

    var current_timestamp = new Date(current).getTime();
    var pre_timestamp = current_timestamp - 24 * 60 * 60 * 1000;
    var next_timestamp = current_timestamp + 24 * 60 * 60 * 1000;

    var current_obj = this.formatTimeStamp(current_timestamp);
    var current_month = current_obj.month;
    var current_date = current_obj.date;
    var current_day = current_obj.day;

    var pre_obj = this.formatTimeStamp(pre_timestamp);
    var pre = pre_obj.year + '-' + pre_obj.month + '-' + pre_obj.date;
    var pre_month = pre_obj.month;
    var pre_date = pre_obj.date;

    var next_obj = this.formatTimeStamp(next_timestamp);
    var next = next_obj.year + '-' + next_obj.month + '-' + next_obj.date;

    if (current == end) {
      next = 0;
    };
    if (current == start) {
      pre = 0;
    }

    if (typeof value == 'number') {
      next = 0;
    };

    _this.setData({
      date: {
        pre, pre_month, pre_date,
        current, current_month, current_date, current_day,
        next
      }
    });
  },
  getCurrent: function (date, type) {
    var _this = this;
    var today_obj = this.formatTimeStamp(Date.now());
    var today = today_obj.year + '-' + today_obj.month + '-' + today_obj.date;
    var loadStyleData = this.data.loadStyleData;

    wx.showLoading({
      mask: true
    });

    // 重置数据
    this.resetData();

    // 获取当前时间下的top1和photos
    var p1 = this.loadTopPhoto(date);
    var p2 = this.loadPhotos(date);
    this.refreshData(p1, p2).then(res => {
      var top = res[0]
      var photos = res[1];
      var len = photos.length;

      if (!type) {
        if (len == 0) {
          var title = date + '无作品，请选择其他日期查看'
          return wx.showToast({
            title: title
          });
        };
      }
      else {
        if (today == date) {
          _this.init();
        };

        if (len == 0) {
          return _this.circleGetCurrent(date, type);
        };
      }

      wx.hideLoading();
      _this.changeDate(date);
      _this.setData({
        top_photo: top,
        photos: photos,
        loadStyleData: loadStyleData
      });
    }, err => {
      wx.hideLoading();
      wx.showToast({
        title: err
      });
    });

  },
  circleGetCurrent: function (current, type) {
    var _this = this;
    var p1 = this.loadTopPhoto(current);
    var p2 = this.loadPhotos(current);
    var loadStyleData = this.data.loadStyleData;
    var today_obj = this.formatTimeStamp(Date.now());
    var today = today_obj.year + '-' + today_obj.month + '-' + today_obj.date;

    this.refreshData(p1, p2).then(res => {
      var top = res[0];
      var photos = res[1];
      var len = photos.length;

      if (len == 0 && isEmptyObj(top)) {
        var date;
        var timestamp = new Date(current).getTime();

        if (type == 'pre') {
          var pre_timestamp = timestamp - 24 * 60 * 60 * 1000;
          var pre_obj = _this.formatTimeStamp(pre_timestamp);

          date = pre_obj.year + '-' + pre_obj.month + '-' + pre_obj.date;
        }
        else if (type == 'next') {
          var next_timestamp = timestamp + 24 * 60 * 60 * 1000;
          var next_obj = _this.formatTimeStamp(next_timestamp);

          date = next_obj.year + '-' + next_obj.month + '-' + next_obj.date;
        }

        if (today == current) {
          _this.init();
        };

        _this.circleGetCurrent(date, type);
      }
      else {
        wx.hideLoading();
        _this.changeDate(current);
        return _this.setData({
          top_photo: top,
          photos: photos,
          loadStyleData: loadStyleData
        });
      }
    }, err => {
      wx.hideLoading();
      wx.showToast({
        title: err
      });
    });
  },
  resetData: function () {
    var _this = this;
    this.load.is_finish = false;
  },
  refreshData: function (p1, p2) {
    return Promise.all([p1, p2]).then(res => {
      return Promise.resolve(res);
    }, err => {
      return Promise.reject(err);
    });
  },
  getPre: function (e) {
    var current = e.target.dataset.pre;
    this.getCurrent(current, 'pre');
  },
  getSelect: function (e) {
    var current = e.detail.value;
    this.getCurrent(current);
  },
  getNext: function (e) {
    var current = e.target.dataset.next;
    this.getCurrent(current, 'next');
  },
  joinReview: function () {
    var id = this.data.top_photo.id;

    wx.navigateTo({
      url: '../../pages/review/review?id=' + id,
      success: function (res) {
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  uploadPhoto: function () {
    var route = getRoute(this);
    addPhoto(route);
  },

  openSlider: sliderFunc.openSlider,
  closeSlider: sliderFunc.closeSlider,
  sliderNumChange: sliderFunc.sliderNumChange,
  toggleOpenExif: sliderFunc.toggleOpenExif,
  onUnload: function () {
    delete this.load;
  },
  onReachBottom: function () {
    this.loadingHandler();
  },
  onPullDownRefresh: function () {
        var _this = this;

        if (!this.is_pull_down_refresh) {
          this.is_pull_down_refresh = true;

          var date = _this.data.date.current;
          var loadStyleData = _this.data.loadStyleData;

          var p1 = this.loadTopPhoto(date);
          var p2 = this.loadPhotos(date);

          Promise.all([p1,p2]).then(arr => {
            var top_photo = arr[0];
            var photos = arr[1];

            if (loadStyleData.is_finish && _this.load.is_finish) {
              loadStyleData.is_finish = false;
              _this.load.is_finish = false;
            }
            this.setData({         
              top_photo: top_photo,
              photos: photos,
              loadStyleData: loadStyleData
            });

             wx.stopPullDownRefresh();
            _this.is_pull_down_refresh = false;

          }, err => {
            console.log(err);
            wx.stopPullDownRefresh();
            _this.is_pull_down_refresh = false;
          });
        };
  },
  onShareAppMessage: function () {
    var top = this.data.top_photo;

    var name = '米拍|天天快拍';
    var path = '/pages/index/index';

    if (!isEmptyObj(top)) {
      name = name + ' TOP1';
    }

    return {
      title: name,
      path: path
    }
  }
});