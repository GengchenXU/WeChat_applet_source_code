const getAsynUserData = require('../../widget/getAsynUserData');
const app = getApp();
const root = app.host.root;
const request = app.api.request;

function getSysInfo() {
  var _this = this;
  var res = wx.getSystemInfoSync();
  var windowWidth = res.windowWidth;
  let imgWidth = parseInt(windowWidth * 0.48);

  return imgWidth;
};

function onImageLoad(e) {
  var _this = this;
  let imageId = e.target.id;
  let oImgW = e.detail.width;         //图片原始宽度
  let oImgH = e.detail.height;        //图片原始高度

  var fallLayout = _this.data.fallLayout;
  let imgWidth = getSysInfo();  //图片设置的宽度
  let scale = imgWidth / oImgW;        //比例计算
  let imgHeight = parseInt(oImgH * scale);      //自适应高度

  let loadingCount = fallLayout.loadingCount - 1;
      fallLayout.imgWidth = imgWidth;

  let photos = _this.data.photos;
  let imageObj = null;

  for (let i = 0; i < photos.length; i++) {
    let img = photos[i];

    if (img.id === imageId) {
      imageObj = img;
      break;
    }
  } 

  imageObj.height = imgHeight;
  let col1 = fallLayout.col1;
  let col2 = fallLayout.col2;
  let col1H = fallLayout.col1H;
  let col2H = fallLayout.col2H;

  if (col1H <= col2H) {
    col1H = parseInt(col1H + imgHeight+128);
    col1.push(imageObj);
  } else {
    col2H = parseInt(col2H + imgHeight+128);
    col2.push(imageObj);
  }

  fallLayout={
    col1: col1,
    col2: col2,
    loadingCount: loadingCount,
    col1H: col1H,
    col2H: col2H
  }

  _this.setData({
    fallLayout: fallLayout,
  });
}

module.exports = {
  getSysInfo: getSysInfo,
  onImageLoad: onImageLoad
}