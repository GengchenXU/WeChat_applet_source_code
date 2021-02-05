var app = getApp();
var root = app.globalData.root;

var url = {
    base: 'https://v0.api.upyun.com/',
    auth: root + 'v1/system/image_upload_authorization',
    post: root + 'v1/works/post'
}

var getAsynUserData = require('../../widget/getAsynUserData');
var activityId;

Page({
    data: {
        is_scroll_x: true,
        remain: {
            num: 140,
            hidden: true
        },

        // 提交数据
        photos: [],
        location: '位置',
        x: 0,
        y: 0,
        content: '',
        tags: []
    },
    onLoad: function ( opt ) {
        if ( typeof opt.id !== 'undefined' ) {
            activityId = opt.id;
        };
        
        var photos = this.data.photos;
        photos = app.globalData.puzzelData;

        this.setData({
            photos: photos
        });
    },
    onShow: function () {
        var tags = this.data.tags;
        var content = this.data.content;
        var location = this.data.location;

        // 渲染添加的标签
        var selectedTags = app.globalData.selectedTags;
        console.log(selectedTags);
        var len = selectedTags.length;

        if ( len ) {
            selectedTags.forEach(function ( item ) {
                tags.push({
                    id: item.id,
                    text: '#'+item.text+'#'
                });
            });
        };

        // 渲染图说内容
        content = app.globalData.worksDes;
        location = app.globalData.location;

        this.setData({
            tags: tags,
            content: content,
            location: location
        });
    },
    getContentValue: function ( e ) {
        var content = e.detail.value;
        app.globalData.worksDes = content;

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
            content: value
        });
    },
    chooseLocation: function () {
        var _this = this;
        var location = this.data.location;
        var x = this.data.x;
        var y = this.data.y;

        wx.chooseLocation({
            success: function(res){
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
            }
        })
    },
    navigateToTags: function () {
        wx.navigateTo({
            url: '../../pages/tags/tags'
        })
    },
    submitData: function () {
        var that = this;
        var len = this.data.photos.length;
        
        var photos = this.data.photos;
        var x = this.data.x;
        var y = this.data.y;
        var location = this.data.location;
        var content = this.data.content.trim();
        var tags = [];
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
        if ( !this.data.tags.length ) {
            return wx.showToast({
                title: '请为作品贴上个性的标签吧。'
            });
        };
        this.data.tags.forEach(function ( item, index ) {
            tags.push(item.id);
        });

        photos.forEach(function ( item, index ) {
            images.push({
                w: item.origin_width,
                h: item.origin_height,
                exif: ''
            });
        });

        wx.showLoading({
            title: '图片正在上传中'
        });

        getAsynUserData(function ( user ) {
            var access_token = user.access_token;

            // 获得图片授权
            wx.request({
                url: url.auth,
                header: {
                    accesstoken: access_token
                },
                data: {
                    n: len, 
                    t: 'works',
                    activity_id: activityId
                },
                success: function( res ){
                    var auth = res.data.data.authorization;

                    auth.forEach(function ( item, idx ) {
                        images[idx].url = item.file;
                    });
                    
                    // 又拍云地址
                    var bucket = res.data.data.bucket;
                    var ypy = url.base+bucket;
                    works_sn = res.data.data.works_sn;


                    // 上传图片到又拍云
                    for ( let i = 0; i < len; i++ ) {
                        var success_arr = [];

                        wx.uploadFile({
                            url: ypy,
                            filePath: photos[i].src,
                            name: 'file',
                            formData: {
                                'signature': auth[i].sign,
                                'policy': auth[i].policy,
                                'file': auth[i].file
                            },
                            success: function ( res ) {
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
                                            activity_id: activityId,
                                            works_sn: works_sn,
                                            images: images,
                                            tags: tags,
                                            text: content,
                                            location: location,
                                            x: x,
                                            y: y,
                                            from_device: from_device,
                                            device_model: device_model
                                        }
                                        post_data = JSON.stringify(post_data);

                                        wx.request({
                                            url: url.post,
                                            method: 'POST',
                                            header: {
                                                accesstoken: access_token
                                            },
                                            data: {
                                                data: post_data
                                            },
                                            success: function ( res ) {
                                                var msg = res.data.message;

                                                var p = new Promise(function ( resolve, reject ) {
                                                    if ( msg == '操作成功' ) {
                                                        resolve(msg);
                                                    }
                                                    else {
                                                        reject(msg);
                                                    }
                                                });

                                                p.then(value => {
                                                    wx.hideLoading();
                                                    wx.showToast({
                                                        title: '图片上传成功',
                                                        success: function ( res ) {
                                                            wx.navigateTo({
                                                                url: '../../pages/activity-details/activity-details?id='+activityId
                                                            });          
                                                        }
                                                    });
                                                }, value => {
                                                    wx.showToast({
                                                        title: value
                                                    });
                                                });
                                            },
                                            complete: function ( res ) {
                                                var errMsg = res.errMsg.split(':')[1];

                                                var authErrMsg = new Promise(function ( resolve, reject ) {
                                                    if ( errMsg == 'ok' ) {
                                                        resolve(errMsg);
                                                    }
                                                    else {
                                                        reject(errMsg);
                                                    }
                                                });

                                                authErrMsg.then(value => {
                                                    return;
                                                }, value => {
                                                    wx.hideLoading();
                                                    wx.showToast({
                                                        title: '图片上传失败'
                                                    });
                                                });
                                            }
                                        });
                                    };

                                });
                            }
                        });
                    };


                },
                complete: function( res ) {
                    var errMsg = res.errMsg.split(':')[1];

                    var authErrMsg = new Promise(function ( resolve, reject ) {
                         if ( errMsg == 'ok' ) {
                             resolve(errMsg);
                         }
                         else {
                             reject(errMsg);
                         }
                     });

                    authErrMsg.then(value => {
                        return;
                    }, value => {
                        wx.showToast({
                            title: '授权失败'
                        });
                    });
                }
            }) 
        });
    }
});