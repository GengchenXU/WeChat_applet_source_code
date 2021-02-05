import assignImgInfo from './assignImgInfo';

const app = getApp();

// wx promisify api
const chooseImage = app.api.chooseImage;
const getImageInfo = app.api.getImageInfo;

var route_arr = ['index']; 

function addPhoto ( route ) {
    var args = Array.prototype.slice.call(arguments);

    return chooseImage({
        sourceType: ['album'],
        sizeType: ['original']
    }).then(res => {
        var img_ready_arr = [];
        var img_arr = res.tempFilePaths;
        var len = img_arr.length;

        for ( let i = 0; i < len; i++ ) {
            img_ready_arr[i] = i;            
        };

        return Promise.resolve(Promise.all(img_ready_arr.map(function ( item, idx ) {
            return getImageInfo({
                src: img_arr[idx]
            }).then(res => {
                var origin_width = res.width;
                var origin_height = res.height;
                
                app.globalData.puzzelData.push({
                    src: img_arr[idx],
                    opacity: 1,
                    zIndex: 0,
                    origin_height: origin_height,
                    origin_width: origin_width
                });
            }, err => {
                console.log(err);
            });
        })).then( arr => {

            if ( route ) {
                var is_navigate = route_arr.some(function ( item ) {
                    if ( item == route  ) {
                        return true;
                    };
                });

                if ( is_navigate ) {

                    return wx.navigateTo({ 
                        url: '../upload-photo/upload-photo'
                    });

                }
            }

            return Promise.resolve(app.globalData.puzzelData);
        }, err => {
            console.log(err);
            return Promise.reject(err);
        }));

    }, err => {
        console.log( err );
        return Promise.reject(err);
    });    
}

export default addPhoto;
