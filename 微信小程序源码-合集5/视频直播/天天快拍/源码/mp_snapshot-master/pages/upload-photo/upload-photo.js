import getAsynUserData from '../../widget/getAsynUserData';
import addPhoto from '../../util/addPhoto';
import assignImgInfo from '../../util/assignImgInfo';
import getResScale from '../../util/getResScale';
import packingRequest from '../../util/packingRequest';

const app = getApp();
const root = app.host.root;

const url = {
    base: 'https://v0.api.upyun.com/',
    auth: root + 'v1/system/image_upload_authorization',
    post: root + 'v1/works/post',
    recommend: root + 'v1/tags/get_recommend_tags',
    add: root + 'v1/tags/create'
}

// wx promisify api
const uploadFile = app.api.uploadFile;
const chooseLocation = app.api.chooseLocation;
const showModal = app.api.showModal;
var access_token;
var uid;

var photo_arr, 
    len,
    x, y, x1, y1, x2, y2, 
    move_index,
    is_moved,
    start_index,
    end_index,
    start_pos,
    end_pos,
    start_size,
    end_size;
var photo_arr_copy;

Page({
    data: {
        // work-edit
        photos: [],
        location: '位置',
        x: 0,
        y: 0,
        content: '',
        selectedTags: [],        
        is_scroll_x: true,
        remain: {
            num: 140,
            hidden: true
        },

        // tags
        tags: [],
        value: '',

        // 路由
        route: 'puzzel'
    },
    onLoad: function ( opt ) {
        this.is_uploading = false;
        
        this.renderTags();

        app.globalData.puzzelData.forEach(function ( item, idx ) {
            item.index = idx;
        });
        var len = app.globalData.puzzelData.length;

        // 一次性添加了大于9张图片
        if ( len > 9 ) {
            app.globalData.puzzelData.splice(9);

            wx.showToast({
                title: '最多上传9张图片'
            });
        };
        len = app.globalData.puzzelData.length;
        assignImgInfo(len, app.globalData.puzzelData);

        this.setData({
            photos: app.globalData.puzzelData
        });
    },
    onUnload: function () {
        app.globalData.puzzelData = [];
    },
    getContentValue: function ( e ) {
        var content = e.detail.value;
        app.globalData.worksDes = content;
        this.setData({
          content: content
        });

    },
    changeTips: function ( e ) {
        var value = e.detail.value;
        var remain = this.data.remain;
        if ( remain.hidden ) {
            remain.hidden = false;
        };
        remain.num = 140 - value.length;

        this.setData({
            remain: remain,
           // content: value
        });
    },
    chooseLocation: function () {
        var _this = this;
        var location = this.data.location;
        var x = this.data.x;
        var y = this.data.y;

        chooseLocation().then(res => {
            location = res.name;
            x = res.latitude;
            y = res.longitude  

            app.globalData.location = location;

            // 地址
            _this.setData({
                location: location,
                x: x,
                y: y
            });
        }, err => {
            console.log(err);
        });
    },
    toTags: function () {
        this.setData({
            route: 'tags'
        });
    },
   // 渲染标签
    renderTags: function () {
        var that = this;
        var tags = this.data.tags; 
        getAsynUserData( function ( user ) {
          //判断用户授权状态，获取access_token
          if (user == ' ') {
            access_token = ' ';
            uid=' ';
          }
          else {
            access_token = user.access_token;
            uid = user.id
          }

          packingRequest({
            url: url.recommend,
            header: {
              accesstoken: access_token
            }
          }).then(res => {
            var arr = res.data.data;

            arr.forEach(function (item) {
              tags.push({
                id: item.id,
                text: item.text,
                is_selected: false
              });
            });
            that.setData({
              tags: tags
            });
          }, err => {
            wx.showToast({
              title: '用户未登录'
            });
            //console.log(err);
          });
        });
    },
    addTag: function ( e ) {
        var _this = this;
        var tags = this.data.tags;
        var selectedTags = this.data.selectedTags;
        var value = this.data.value;

        var text = e.detail.value;
        var len = text.length;

        if ( !text ) return;
        if ( len > 8 ) {
            return wx.showToast({
                title: '标签字数不能大于8个字'
            });
        };

        // 创建标签
        packingRequest({
          url: url.add,
          header: {
            accesstoken: access_token
          },
          data: {
            tag_name: text,
            uid: uid
          },
          method: 'POST',
        }).then(res => {
          var obj = res.data.data;

          var tag = {};
          tag.id = obj.id;
          tag.text = obj.text;
          tag.is_selected = true;

          tags.push(tag);
          selectedTags.push(tag);

          _this.setData({
            tags: tags,
            selectedTags: selectedTags,
            value: ''
          });
        }, err => {
          console.log(err);
          var code = err.data.code;
          var msg = err.data.message;

          if (code === 500002) {
            var tags = _this.data.tags;
            var selectedTags = _this.data.selectedTags;

            var len = tags.length;
            var tag_id = err.data.data.id;
            var idx;

            var is_exit = tags.some(function (item, index) {
              if (item.id == tag_id) {
                idx = index;
              }

              return item.id == tag_id
            });

            if (!is_exit) {
              var tag = {};

              tag.id = tag_id;
              tag.text = err.data.data.text;
              tag.is_selected = true;

              tags.push(tag);
              selectedTags.push(tag);

              return _this.setData({
                tags: tags,
                selectedTags: selectedTags,
                value: ''
              });
            }
            else {
              if (!tags[idx].is_selected) {
                tags[idx].is_selected = true;
                selectedTags.push(tags[idx]);

                return _this.setData({
                  tags: tags,
                  selectedTags: selectedTags,
                  value: ''
                });
              }
            }
          };
          if (msg) {
            wx.showToast({
              title: msg
            });
          };
        })
    },
    selectedTag: function ( e ) {
        var tags = this.data.tags;
        var selectedTags = this.data.selectedTags;

        var idx = e.target.dataset.idx;

        if ( idx == 0 || idx ) {
            var is_selected = tags[idx].is_selected;

            if ( is_selected  ) {
                selectedTags.forEach(function ( item, index ) {
                    if ( JSON.stringify(item) == JSON.stringify(tags[idx]) ) {
                        selectedTags.splice(index, 1);
                    };
                });
                tags[idx].is_selected = false;
            }
            else {
                tags[idx].is_selected = true;
                selectedTags.push(tags[idx]);
            }
            this.setData({
                tags: tags,
                selectedTags: selectedTags
            });
        };
    },
    submitData: function () {
        var that = this;
        var len = this.data.photos.length;
        
        var photos = this.data.photos;
        var x = this.data.x;
        var y = this.data.y;
        var location = this.data.location;
        if ( location == '位置' ) {
            location = '';
        };
        var content = this.data.content.trim();
        var selectedTags = [];
        var from_device = 'wx_xcx';
        var device_model = '';
        var works_sn;
        var images = [];

        // 图片上传到又拍云结果
        var result = [];


        if ( !content) {
            return wx.showToast({
                title: '额。好图配佳文，说点什么吧'
            })
        };
        if ( !this.data.selectedTags.length ) {
            return wx.showToast({
                title: '请为作品贴上个性的标签吧。'
            });
        };
        this.data.selectedTags.forEach(function ( item, index ) {
            selectedTags.push(item.id);
        });

        photos.forEach(function ( item, index ) {
            images.push({
                w: item.origin_width,
                h: item.origin_height,
                exif: ''
            });
        });

        wx.showLoading({
            title: '图片正在上传中',
            mask: true
        });

        if ( !this.is_uploading ) {
            getAsynUserData(function ( user ) {
                if ( typeof user == 'string' ) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '微信授权登录失败,请删除小程序重新进入'
                    });
                }
                else {
                    that.is_uploading = true;

                    // 获得图片授权
                    packingRequest({
                        url: url.auth,
                        header: {
                            accesstoken: access_token
                        },
                        data: {
                            n: len,
                            t: 'works'
                        }
                    }).then( res => {
                        var auth = res.data.data.authorization;

                        images.forEach(function ( item, idx ) {
                            item.url = auth[idx].file;
                        });
                            
                        // 又拍云地址
                        var bucket = res.data.data.bucket;
                        var ypy = url.base+bucket;
                        works_sn = res.data.data.works_sn;


                        // 上传图片到又拍云
                        for ( let i = 0; i < len; i++ ) {
                            var success_arr = [];

                            uploadFile({
                                url: ypy,
                                filePath: photos[i].src,
                                name: 'file',
                                formData: {
                                    'signature': auth[i].sign,
                                    'policy': auth[i].policy,
                                    'file': auth[i].file
                                }
                            }).then( res => {
                                var data = res.data;
                                
                                if ( data ) {
                                    return Promise.resolve(res);
                                }
                                else {
                                    return Promise.reject(res);
                                }
                            }, err => {
                                return Promise.reject(err);
                            }).then(res => {
                                success_arr[i] = Promise.resolve(res.data);

                                // 上传作品到服务器
                                Promise.all(success_arr).then(values => {

                                    var is_all_exit;

                                    for ( var j = 0; j < len; j++ ) {
                                        if ( typeof values[j] == 'undefined' ) {
                                            result[j] = false;
                                        }
                                        else {
                                            result[j] = true;
                                        }
                                    };

                                    is_all_exit = result.every(function ( item ) {
                                        return item;
                                    });

                                    if ( is_all_exit ) {

                                        var post_data = {
                                            activity_id: 0,
                                            works_sn: works_sn,
                                            images: images,
                                            tags: selectedTags,
                                            text: content,
                                            location: location,
                                            x: x,
                                            y: y,
                                            from_device: from_device,
                                            device_model: device_model,
                                            type: 2
                                        }
                                        post_data = JSON.stringify(post_data);
                                        
                                        packingRequest({
                                            url: url.post,
                                            method: 'POST',
                                            header: {
                                                accesstoken: access_token
                                            },
                                            data: {
                                                data: post_data
                                            }
                                        }).then(res => {
                                            wx.hideLoading();
                                            wx.showToast({
                                                title: '图片上传成功',
                                                success: function ( res ) {      
                                                  wx.redirectTo({
                                                    url: '../../pages/index/index'
                                                  });
                                                    // wx.navigateBack({
                                                    //     delta: 1, // 回退前 delta(默认为1) 页面
                                                    //     fail: function ( err ) {
                                                    //         console.log(err);
                                                    //     }
                                                    // })
                                                },
                                                fail: function ( err ) {
                                                    console.log(err);
                                                }
                                            });
                                            that.is_uploading = false;
                                        }, err => {
                                            console.log(err);
                                            var msg = err.data.message;

                                            if ( msg ) {     
                                                wx.showToast({
                                                    title: msg
                                                });
                                            };

                                            wx.hideLoading();

                                            that.is_uploading = false;
                                        })
                                    };

                                });
                            }, err => {
                                console.log(err);
                                that.is_uploading = false;
                                wx.hideLoading();
                                wx.showToast({
                                    title: err.errMsg
                                });
                            });
                        };

                    }, err => {
                        console.log(err);
                        // var msg = err.data.message;
                        that.is_uploading = false;
                        wx.hideLoading();
                        wx.showToast({
                            title: err
                        });
                    });
                }
            });
        };

    },
    addPhoto: function () {
        var _this = this;

        addPhoto().then( photos => {

            var len = photos.length;
            if ( len > 9 ) {
                photos.splice(9);
                
                wx.showToast({
                    title: '最多上传9张图片'
                });
            }

            photos.forEach(function ( item, idx ) {
                item.index = idx;
            });
            len = photos.length;
            
            assignImgInfo(len, photos);
            
            _this.setData({
                photos: photos
            });
        }, err => {
            console.log(err);
        });
    },
    getContainerSize: function ( len ) {
        var containerSize = {
            width: 0,
            height: 0
        }
        if ( typeof len !== 'number' || len < 1 ) {
            return;
        };
        var scale = getResScale();

        // 容器宽度
        containerSize.width = len !==7 ? 680*scale : 613*scale;

        // 容器高度
        switch ( len ) {
            case 1: containerSize.height = 900*scale;
            break 
            case 2: containerSize.height = 808*scale;
            break;
            case 3: containerSize.height = 864*scale;
            break;
            case 4: containerSize.height = 748*scale;
            break;
            case 5: containerSize.height = 796*scale;
            break;
            case 6: containerSize.height = 680*scale;
            break;
            case 7: containerSize.height = 882*scale;
            break;
            case 8: containerSize.height = 792*scale;
            break;
            case 9: containerSize.height = 680*scale;
        }
        return containerSize;
    },
    movePos: function ( move_x, move_y ) {
        photo_arr[move_index].x = move_x;
        photo_arr[move_index].y = move_y;
    },
    changeSize: function ( width, height ) {
        photo_arr[move_index].width = width;
        photo_arr[move_index].height = height;
    },
    replaceIndex: function ( end_index ) {
        photo_arr[move_index].index = end_index;
    },
    startMove: function ( e ) {
        photo_arr = this.data.photos;
        
        photo_arr_copy = photo_arr.map(function ( item ) {
            return {
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height,
                index: item.index
            }
        });
        
        len = photo_arr.length;
        move_index = e.target.dataset.index;
        
        if ( move_index >= 0 ) {
            start_pos = {
                x: photo_arr[move_index].x,
                y: photo_arr[move_index].y
            }
            start_size = {
                width: photo_arr[move_index].width,
                height: photo_arr[move_index].height
            }
            start_index = photo_arr[move_index].index;
            
            x1 = e.target.offsetLeft;
            y1 = e.target.offsetTop;
            x2 = e.touches[0].clientX;
            y2 = e.touches[0].clientY;
            x = x1 - x2;
            y = y1 - y2;

            photo_arr[move_index].opacity = 0.7;
            photo_arr[move_index].zIndex = 1;
            this.setData({
                photos: photo_arr
            });        
        };
    },
    move: function ( e ) {
        var containerSize = this.getContainerSize(len);

        // 移动距离
        var move_x = e.touches[0].clientX + x;
        var move_y = e.touches[0].clientY + y;
        
        if ( move_index >= 0 ) {
            var target_width = photo_arr[move_index].width;
            var target_height = photo_arr[move_index].height;

            // 移动图片位置
            this.movePos(move_x, move_y);

            // 重排条件：移动图片的中点，在其他任何图片之中，则对图片位置重排
            var move_pos_x = e.target.offsetLeft;
            var move_pos_y = e.target.offsetTop;
            var move_center_point_x = move_pos_x + target_width/2;
            var move_center_point_y = move_pos_y + target_height/2;

            for ( var i = 0; i < len; i++ ) {
                if ( i !== move_index &&
                     move_center_point_x >= photo_arr[i].x &&
                     move_center_point_x <= (photo_arr[i].x + photo_arr[i].width) &&
                     move_center_point_y >= photo_arr[i].y &&
                     move_center_point_y <= (photo_arr[i].y + photo_arr[i].height)
                ) {
                    // 已经移动过，并且一直都在移动过程中
                    if ( is_moved ) {
                        start_pos = end_pos;
                        start_size = end_size;
                        start_index = end_index;
                        
                        photo_arr_copy = photo_arr.map(function ( item ) {
                            return {
                                x: item.x,
                                y: item.y,
                                width: item.width,
                                height: item.height,
                                index: item.index
                            }
                        });
                        
                    };

                    // 重排位置
                    photo_arr[i].x = start_pos.x;
                    photo_arr[i].y = start_pos.y;
                    end_pos = {
                        x: photo_arr_copy[i].x,
                        y: photo_arr_copy[i].y
                    }

                    // 重排大小
                    if ( photo_arr[i].width !== start_size.width || 
                         photo_arr[i].heigt !== start_size.height     
                    ) {
                        photo_arr[i].width = start_size.width;
                        photo_arr[i].height = start_size.height;
                        
                        end_size = {
                            width: photo_arr_copy[i].width,
                            height: photo_arr_copy[i].height
                        }
                    }

                    // 重排顺序
                    photo_arr[i].index = start_index;
                    end_index = photo_arr_copy[i].index;

                    is_moved = true;
                }
            };
            app.globalData.puzzelData = photo_arr;
                                              
            this.setData({
                photos: app.globalData.puzzelData
            });
        }
    },
    endMove: function ( e ) {
        if ( move_index >= 0 ) {

            if ( !end_pos ) {
                end_pos = start_pos;
            }
            if ( !end_size ) {
                end_size = start_size;
            }
            if ( typeof end_index == 'undefined' ) {
                end_index = start_index;
            };

            this.replaceIndex( end_index );
            this.movePos( end_pos.x, end_pos.y );
            this.changeSize( end_size.width, end_size.height );

            end_pos = null;
            end_size = null;
            end_index = undefined;
            is_moved = false;
        
            photo_arr[move_index].opacity = 1;
            photo_arr[move_index].zIndex = 0;
            
            app.globalData.puzzelData = photo_arr;

            this.setData({
                photos: photo_arr
            });
        }
    },
    replaceOrder: function () {
        var photos = app.globalData.puzzelData;
        var len = photos.length;
        var arr = [];

        photos.forEach(function ( item, idx ) {
            for ( var i = 0; i < len; i++ ) {
                if ( photos[i].index == idx ) {
                    arr.push(photos[i]);
                    break;
                };
            };
        });

        return arr;
    },
    toWorkEdit: function () {
        var photos = this.replaceOrder();

        this.setData({
            route: 'work-edit',
            photos: photos
        });
    },
    toPuzzel: function () {
        this.setData({
            route: 'puzzel'
        });
    },
    delPhoto: function ( e ) {
        var index = e.target.dataset.index;
        var photos = this.data.photos;
        var len = photos.length;
        var _this = this;

        if ( len == 1 ) return;

        if ( typeof index == 'number' ) {
            showModal({
                title: '删除图片',
                content: '确认删除图片'
            }).then(res => {

                var confirm = res.confirm;

                if ( confirm ) {
                    var idx = app.globalData.puzzelData[index].index;

                    app.globalData.puzzelData.splice(index, 1);
                    var len1 = app.globalData.puzzelData.length;
                    
                    for ( var i = idx; i < len-1; i++ ) {
                        idx++;
                        for ( var j = 0; j < len1; j++ ) {
                            if ( app.globalData.puzzelData[j].index == idx ) {
                                app.globalData.puzzelData[j].index--;
                            };
                        };
                    };
                    var photos = _this.replaceOrder();
                    assignImgInfo(len1, photos);
                    
                    _this.setData({
                        photos: photos
                    });
                    
                };
            }, err => {
                console.log(err);
            });
        };
    }
});