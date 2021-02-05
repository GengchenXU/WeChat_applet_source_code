const app = getApp();
const request = app.api.request;

function packingRequest ( obj ) {
    return request(obj).then(res => {
        if ( typeof res.data.code !== 'undefined' && res.data.code == 100001 ) {
            return Promise.resolve(res);
        }
        else {
            return Promise.reject(res);
        }
    }, err => {
        wx.showToast({
            title: '数据请求失败'
        });
        console.log(err);
    });
}
export default packingRequest;