function getResScale ()  {
    var windowWidth;
    var scale;

    var res = wx.getSystemInfoSync();
    windowWidth = res.windowWidth;
    scale = windowWidth/750;

    return scale;
}
export default getResScale;
