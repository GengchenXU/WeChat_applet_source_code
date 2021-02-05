var app = getApp();
var util = require('../../util/util');
var photo_arr, 
    len,
    x, y, x1, y1, x2, y2, 
    move_index,
    is_moved,
    start_pos,
    end_pos,
    start_size,
    end_size;
var photo_arr_copy;

Page({
    data: {
        puzzelData: null,
        hidden: true,
        id: ''
    },
    onLoad: function ( opt ) {
        var id = this.data.id;
        id = opt.id;

        this.setData({
            puzzelData: app.globalData.puzzelData,
            id: id
        });
    },
    onShow: function () {
        app.globalData.selectedTags = [];
        app.globalData.worksDes = '';
        app.globalData.location = '';
    },
    addPhoto: function () {
        var route = util.getRoute(this);
        util.addPhoto( route, app, this);
    },
    getContainerSize: function ( len ) {
        var containerSize = {
            width: 0,
            height: 0
        }
        if ( typeof len !== 'number' || len < 1 ) {
            return;
        };
        var scale = util.getResScale();

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
    startMove: function ( e ) {
        photo_arr = this.data.puzzelData;

        photo_arr_copy = photo_arr.map(function ( item ) {
            return {
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height
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
            
            x1 = e.target.offsetLeft;
            y1 = e.target.offsetTop;
            x2 = e.touches[0].clientX;
            y2 = e.touches[0].clientY;
            x = x1 - x2;
            y = y1 - y2;

            photo_arr[move_index].opacity = 0.7;
            photo_arr[move_index].zIndex = 1;
            this.setData({
                puzzelData: photo_arr
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
                    // 重排位置
                    if ( is_moved ) {
                        start_pos = end_pos;
                        start_size = end_size;
                        
                        photo_arr_copy = photo_arr.map(function ( item ) {
                            return {
                                x: item.x,
                                y: item.y,
                                width: item.width,
                                height: item.height
                            }
                        });
                    };

                    photo_arr[i].x = start_pos.x;
                    photo_arr[i].y = start_pos.y;

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

                    // 被移动的图片移动后的位置
                    end_pos = {
                        x: photo_arr_copy[i].x,
                        y: photo_arr_copy[i].y
                    }
                    is_moved = true;
                }
            };
                                              
            this.setData({
                puzzelData: photo_arr        
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
            
            this.movePos( end_pos.x, end_pos.y );
            this.changeSize( end_size.width, end_size.height );

            end_pos = null;
            end_size = null;
            is_moved = false;
        
            photo_arr[move_index].opacity = 1;
            photo_arr[move_index].zIndex = 0;
            this.setData({
                puzzelData: photo_arr
            });
        }
    }
});