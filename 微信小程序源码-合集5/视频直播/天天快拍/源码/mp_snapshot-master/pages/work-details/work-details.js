
import packingRequest from '../../util/packingRequest'
import isEmptyObj from '../../util/isEmptyObj'

import Load from '../../components/load/load'
import workPanel from '../../components/work/work'
import renderCommentData from '../../components/comment/comment'
import sliderFunc from '../../components/slider/slider'
import scorePanel from '../../components/score-panel/score-panel'
const reviewUpPanel = require('../../components/review-up-tab/review-up-tab');
const renderThumbsData = require('../../components/thumb/thumb');
const getAsynUserData = require('../../widget/getAsynUserData');

const app = getApp();
const root = app.host.root;
const root_images = app.host.root_images;

const store = app.store;
const root_reducer = store.getState();
const dispatch = store.dispatch;

var access_token;
var id;
var getDataUrl;

Page({
    data: {
        // 作品数据
        item: root_reducer.work,

        //点赞列表
        thumbs: [],

        // 查看大图数据
        slider: root_reducer.slider,

        // 加载更多
        loadStyleData: {
          hide_loading: false,
          is_finish: false,
          has_no_data: false,
          tips: ''
        },
        tabLoadStyleData: {
          hide_loading: false,
          is_finish: false,
          has_no_data: false,
          tips: ''
        },
        is_hide_work: true,
        is_hide_footer: true,

        //切换面板
        navStyleData: {
          id: {
            comments: 'comments',
            thubms: 'thubms',
          },
          nav: {
            is_active_comments: true,
            is_active_thubms: false,
          },
          navContent: {
            is_hide_comments: false,
            is_hide_thubms: true,
          }
        },

        // 打分面板
        score_panel: root_reducer.score_panel,

        is_show_comment:true
    },
    onLoad: function ( opt ) {
        var _this = this;
        var loadStyleData = this.data.loadStyleData;
        var item = this.data.item;

        id = typeof opt.id !== 'undefined' && opt.id ? opt.id : '';

        getAsynUserData(function (user) {
          //判断用户授权状态，获取access_token
          if (user == ' ') {
            access_token = ' ';
          }
          else {
            access_token = user.access_token;
          }          //判断用户授权状态，获取access_token
          if (user == ' ') {
            access_token = ' ';
          }
          else {
            access_token = user.access_token;
          }

          //作品id存在时，拉取作品数据
          if (id) {
            var p1 = _this.loadWorkData(id, access_token);

            p1.then(res => {
              item = res;

              loadStyleData.hide_loading = true;

              if (!isEmptyObj(res)) {
                item = res;
                item.is_hide_footer = false;
                item.is_hide_work = false;
              }
              else {
                loadStyleData.has_no_data = true;
                loadStyleData.tips = '作品被删除';
              }

              _this.setData({
                loadStyleData: loadStyleData,
                item: item
              });
            }, err => {
              var status_code = err.statusCode;

              loadStyleData.hide_loading = true;
              loadStyleData.has_no_data = true;
              loadStyleData.tips = status_code + '错误';

              _this.setData({
                loadStyleData: loadStyleData
              });
            });

            //渲染点赞列表数据
            _this.loadThumbsData(id, _this, access_token);

            // 点赞加载更多初始化
            getDataUrl = root + 'v1/works/up?works_id=' + id;
            _this.loadThumbs = new Load(getDataUrl, 0);
            _this.loadingHandler2 = _this.loadThumbs.throttel(_this.loadMore, 2000, 'thumbs').bind(this);
          }
          else {
            throw '作品id不存在'
          }

        })

        // 下拉刷新
        this.is_pull_down_refresh = false;

    }, 

  
    loadWorkData: function ( id, access_token ) {
        var _this = this;
        var work_url = root + 'v1/works/details';

        // 渲染作品数据
       return packingRequest({
            url: work_url,
            header: {
                accesstoken: access_token
            },
            data: {
                works_id: id
            }
        }).then(res => {
            var work = res.data.data;
            var item = workPanel.renderWorkData(work, root_images);
            item.comments = renderCommentData( work.comments.splice(0,10), root_images );

            // 评论加载跟多初始化
            getDataUrl = root + 'v1/works/commentlist?works_id=' + item.id;
            _this.load = new Load(getDataUrl, 0);
            _this.loadingHandler = _this.load.throttel(_this.loadMore, 2000, 'comments').bind(this);

            return Promise.resolve(item);
        }, err => {
            console.log(err);
            return Promise.reject(err);
        });
    },
    onUnload: function () {
        delete this.load;
    },
    loadThumbsData: renderThumbsData.renderUpList,
    openSlider: sliderFunc.openSlider,
    closeSlider: sliderFunc.closeSlider,
    sliderNumChange: sliderFunc.sliderNumChange,
    toggleOpenExif: sliderFunc.toggleOpenExif,

    onReachBottom: function () {
      var _this = this;
      var tabStatus = _this.data.navStyleData.navContent.is_hide_comments;
      if (!tabStatus) {
        _this.loadingHandler();
      } else {
        _this.loadingHandler2();
      }
    },
    openScorePanel: scorePanel.openScorePanel,
    closeScorePanel: scorePanel.closeScorePanel,
    submitScore: scorePanel.submitScore,
    getScore: scorePanel.getScore,
    startScore: scorePanel.startScore,
    gradeScore: scorePanel.gradeScore,
    toggleThumb: reviewUpPanel.toggleThumb,
    reviewLink: workPanel.reviewLink,

    // 切换评论点赞面板
    switchTab: function (e) {
      var id = e.target.id;
      var navStyleData = this.data.navStyleData;
      var nav_id_obj = this.data.navStyleData.id;
      var nav = this.data.navStyleData.nav;
      var nav_content = this.data.navStyleData.navContent;
      var tabLoadStyleData = this.data.tabLoadStyleData;

      for (var key in nav_id_obj) {
        if (nav_id_obj[key] == id) {
          for (var key in nav) {
            nav[key] = false;
          };
          for (var key in nav_content) {
            nav_content[key] = true;
          };

          nav['is_active_' + id] = true;
          nav_content['is_hide_' + id] = false;
        };
      };
      tabLoadStyleData.hide_loading = true;

      this.setData({
        tabLoadStyleData: tabLoadStyleData,
        navStyleData: navStyleData
      });
    },

    loadMore: function (str) {
      var that = this;
      var item = this.data.item;
      var thumbs = this.data.thumbs;
      var loadStyleData = this.data.loadStyleData;
      var tabLoadStyleData = this.data.tabLoadStyleData;
      var tabStr = str;
      var newLoad;

      if (tabStr == 'thumbs') {
        newLoad = that.loadThumbs;
        if (tabLoadStyleData.is_finish) {
          tabLoadStyleData.hide_loading = true;
          that.setData({
            tabLoadStyleData: tabLoadStyleData
          });
          return;
        }
      } else {
        newLoad = that.load;
        if (loadStyleData.is_finish) {
          loadStyleData.hide_loading = true;
          that.setData({
            loadStyleData: loadStyleData
          });
          return;
        };
      }

      newLoad.loading(that, null, function (res, _this) {
        var arr;
        var len;
        if (tabStr == 'thumbs') {
          arr = res.data.data.items;
          len = arr.length;
          if (!len) {
            _this.is_tab_finish = true;
            tabLoadStyleData.hide_loading = true;
            tabLoadStyleData.is_finish = true;
            return that.setData({
              tabLoadStyleData: tabLoadStyleData
            });
          }
          else {
            _this.is_tab_finish = false;
          }

        } else {
          arr = res.data.data;
          len = arr.length;
          // 判断是否浏览完毕
          if (!len) {
            _this.is_finish = true;
            loadStyleData.hide_loading = true;
            loadStyleData.is_finish = true;
            return that.setData({
              loadStyleData: loadStyleData,
            });
          }
          else {
            _this.is_finish = false;
          }
        }

        // 加载数据
        if (tabStr == 'thumbs') {
          thumbs = thumbs.concat(renderThumbsData.packUpData(arr, root_images));
          tabLoadStyleData.hide_loading = true;

          that.setData({
            tabLoadStyleData: tabLoadStyleData,
            thumbs: thumbs,
          });
        } else {
          item.comments = item.comments.concat(renderCommentData(arr, root_images));
          loadStyleData.hide_loading = true;

          that.setData({
            loadStyleData: loadStyleData,
            item: item,
          });
        }
      }, null, true);
    },
    onPullDownRefresh: function () {
        var _this = this;

        if ( !this.is_pull_down_refresh ) {
            this.is_pull_down_refresh = true;
            
            if ( id && access_token && !this.is_pull_down_refresh ) {    
                var p1 =  _this.loadWorkData( id, access_token );
                p1.then( item => {
                    
                    if ( loadStyleData.is_finish ) {
                        loadStyleData.is_finish = false;
                    }

                    this.setData({
                        item: item,
                        loadStyleData: loadStyleData
                    });

                    wx.stopPullDownRefresh();
                    _this.is_pull_down_refresh = false;
                    _this.load.is_finish = false;
                }, err => {
                    console.log(err);
                    wx.stopPullDownRefresh();
                    _this.is_pull_down_refresh = false;
                });
            };
        };
    },
    onShareAppMessage: function () {
        var name = '米拍|'+this.data.item.nickname+'的作品';
        var id = this.data.item.id;
        var path = '/pages/work-details/work-details?id='+id;

        return {
            title: name,
            path: path
        }
    }
});