var app = getApp();
var root = app.globalData.root;
var url = {
    recommend: root + 'v1/tags/get_recommend_tags',
    add: root + 'v1/tags/create'
} 
var getAsynUserData = require('../../widget/getAsynUserData');

Page({
    data: {
        tags: [],
        access_token: '',
        uid: '',
        value: ''
    },
    onLoad: function () {        
        var that = this;
        var tags = this.data.tags;
        
        // 渲染标签
        getAsynUserData( function ( user ) {

            wx.request({
                url: url.recommend,
                header: {
                    accesstoken: user.access_token
                }, 
                success: function(res){
                    var arr = res.data.data;

                    arr.forEach(function ( item ) {
                        tags.push({
                            id: item.id,
                            text: item.text,
                            is_selected: false
                        });
                    });

                    that.setData({
                        tags: tags
                    });
                }
            })
        });
    },
    addTag: function ( e ) {
        var _this = this;

        var tags = this.data.tags;
        var selectedTags = app.globalData.selectedTags;

        var value = e.detail.value;
        var len = value.length;

        if ( !value ) return;
        if ( len > 8 ) {
            return wx.showToast({
                title: '标签字数不能大于8个字'
            });
        };
        this.setData({
            value: ''
        });

        getAsynUserData(function ( user ) {                
            // 创建标签
            wx.request({
                url: url.add,
                header: {
                    accesstoken: user.access_token
                },
                data: {
                    tag_name: value,
                    uid: user.id
                },
                method: 'POST',
                success: function(res){
                    var tag = {};

                    var obj = res.data.data;
                    tag.id = obj.id;
                    tag.text = obj.text;
                    tag.is_selected = true;

                    tags.push(tag);

                    app.globalData.selectedTags.push(tag);

                    _this.setData({
                        tags: tags
                    });
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })
        });
    },
    selectedTag: function ( e ) {
        var tags = this.data.tags;
        var selectedTags = app.globalData.selectedTags;

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
                tags: tags
            });
        };
    }
});