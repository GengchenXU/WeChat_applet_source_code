import { getAbout } from '../../actions'
import packingRequest from '../../util/packingRequest'
import wxParse from '../../components/wxParse/wxParse'

const app = getApp();
const root = app.host.root;
const root_images = app.host.root_images;

const store = app.store;
const root_reducer = store.getState();
const dispatch = store.dispatch;

const url = root + 'v1/fastphoto/about?type=2';

Page({
    data: {
        about: root_reducer.about
    },
    onLoad: function () {
        var _this = this;

        // 快拍关于
        var p1 = packingRequest({
            url: url
        }).then(res => {
            var data = res.data.data;
            
            if ( data ) {
                dispatch(getAbout(data));
                return Promise.resolve(data);
            };
        }, err => {
            console.log(err);
            return Promise.reject(err);
        });

        store.subscribe(() => {
            var about = store.getState().about;

            wxParse.wxParse('about', 'html', about, _this, 5);
        });
        
    }
});