import packingRequest from '../../util/packingRequest';

const app = getApp();
const root = app.host.root;
const root_images = app.host.root_images;

const store = app.store;
const root_reducer = store.getState();

function renderSliderData ( res, root_images ) {
    var data = res.data.data;
    var obj = {};

    var photos = [];
    var lineHeight = wx.getSystemInfoSync().windowHeight;

    data.details.forEach(function ( item ) {
        var src = root_images + item.src;
        //var exif = JSON.parse(item.exif);
        var exif;
        var keys = ['make', 'model', 'focalLength', 'fNumber', 'exposureTime', 'ISO', 'exposureBiasValue', 'lensModel', 'create_time'];
        var len = keys.length;

        if ( item.exif ) {
            exif = JSON.parse(item.exif);
        }
        else {
            exif = {};
        }

        for ( var i = 0; i < len; i++ ) {
            if ( !exif[keys[i]] ) {
                exif[keys[i]] = '';
            }
        };

        // 快门速度
        var exposureTime = formatFloat(exif.exposureTime);
     
        // focalLength
        var focalLength = formatFloat(exif.focalLength);

        // fNumber 
        var fNumber = formatFloat(exif.fNumber);

        // expoureBiasValue
        var exposureBiasValue = formatFloat(exif.exposureBiasValue);

        // create_time
        var create_time;
        create_time = exif.create_time;

        // if ( exif.create_time.search(/\//g) == -1 && create_time ) {
        //    var create_time_arr = exif.create_time.split(' ');
        //    var create_time_date= create_time_arr[0].split(':').join('-');

        //    create_time = create_time_date + ' ' + create_time_arr[1];
        // }
                    
        var exif_obj = {
            make: exif.make,
            model: exif.model,
            focalLength: focalLength,
            fNumber: fNumber,
            shutterSpeed: exposureTime,
            iso: exif.ISO,
            exposure: exposureBiasValue,
            lens: exif.lensModel,
            create_time: create_time
        }
        var obj = {
            exif: exif_obj,
            src: src
        }
        photos.push(obj);
    });    
    
    obj.photos = photos;
    obj.current = 1;
    obj.is_hidden_exif = true;
    obj.lineHeight = lineHeight;
    obj.is_scroll_y = true;

    return obj;
}
function sliderNumChange ( e ) {
    var slider = this.data.slider;
    var current = e.detail.current+1;

    slider.current = current;
    this.setData({
        slider: slider
    });
}
function toggleOpenExif () {
    var slider = this.data.slider;
    var is_hidden_exif = slider.is_hidden_exif;

    if ( is_hidden_exif ) {
        slider.is_hidden_exif = false;
    }
    else {
        slider.is_hidden_exif = true;
    }
    this.setData({
        slider: slider
    });
}
function closeSlider () {
    this.setData({
        slider: root_reducer.slider
    });
}
function openSlider ( e ) {
    var id = e.currentTarget.id;
    var idx = e.target.dataset.idx;
    
    var _this = this;
    var slider = this.data.slider;


    if ( slider.is_hide_slider_wrap ) {  

        slider.is_hide_slider_wrap = false;

        this.setData({
            slider: slider
        });

        // 请求获得作品详情
        packingRequest({
            url: root+'v1/works/details',
            data: {
                works_id: id
            }
        }).then(res => {
            slider = renderSliderData(res, root_images);
            slider.is_hide_loading = true;
            slider.is_hide_slider = false;

            _this.setData({
                slider: slider
            });
        }, err => {
            console.log(err);
        });
    };
}

function formatFloat(value) {
  var value_str = new Number(value).toString();
  if (value.search(/\//g) !== -1) {
    var value_arr = value.split('/');
    var denominator = value_arr[1]; // 分母
    var numerator = value_arr[0]; // 分子
    var num = numerator / denominator;

    if (num > 1 || num == 0) {
      return num.toFixed(1);
    };

    return value;
  }
  else if (!(+value_str)) {
    return '';
  }
  else {
    var decimals_str = value_str.split('.')[0];
    var decimals_arr;

    if (decimals_str>=1) {
      return value_str;
    }
    else {   //小于1的小数转分数
      var numerator = parseFloat(value_str) ; // 分母
      var denominator = '1'; // 分子
      var endValue = denominator + '/' + Math.round(denominator / numerator); //分母四舍五入取整
      if (Math.round(denominator / numerator)==1){
         endValue=1;
      }
      return endValue;  
    }
  }
}

function formatNum ( value ) {
    var value_str = new Number(value).toString();

    if ( value.search(/\//g) !== -1 ) {
        var value_arr = value.split('/');
        var denominator = value_arr[1]; // 分母
        var numerator = value_arr[0]; // 分子

        var num = numerator / denominator;

        if ( num > 1 || num == 0 ) {
            return num.toFixed(1);
        };

        return value;
    }
    else if ( !(+value_str) ) {
        return '';
    }
    else {
        var decimals_str = value_str.split('.')[1];
        var decimals_arr;

        if ( !decimals_str && typeof decimals_str !== 'string' ) {
            return value_str;
        }
        else {
            decimals_arr = decimals_str.split('');
            var len = decimals_arr.length;
            var numerator = '1'; // 分母
            var denominator = ''; // 分子

            for ( var i = 0; i < len; i++ ) {
                numerator += '0';

                if ( decimals_arr[i] !== 0 ) {
                    denominator += decimals_arr[i];
                }
            }
            return denominator/denominator + '/' + Math.floor(numerator/denominator);
        }
    }
}

export default {
    openSlider: openSlider,
    closeSlider: closeSlider,
    toggleOpenExif: toggleOpenExif,
    sliderNumChange: sliderNumChange
}
