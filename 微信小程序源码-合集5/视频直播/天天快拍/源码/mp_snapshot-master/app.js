import promisify from './lib/promisify'
import Events from './lib/events'
import login from './util/login'

import { createStore, combineReducers } from './lib/redux'
import reducers from './reducers'

const keys = ['login','getUserInfo', 'request', 'uploadFile', 'setStorage', 'getStorage', 'chooseImage', 'getImageInfo', 'chooseLocation', 'showModal', 'checkSession'];

const store = createStore(combineReducers(reducers));
App({
    store,
    events: new Events(),
    api: {},
    host: {
        root: 'https://api.mepai.me/',
        root_images: 'https://images.mepai.me'
    },
    onLaunch: function () {
        var _this = this;

        // 将微信api转换为promisify接口
        var len = keys.length;
        keys.forEach(( key ) => {
            _this.api[key] = promisify(wx[key]);
        });
        
      // 用户登录
      login(this);
    },

    globalData: {
        puzzelData: []
    }
});