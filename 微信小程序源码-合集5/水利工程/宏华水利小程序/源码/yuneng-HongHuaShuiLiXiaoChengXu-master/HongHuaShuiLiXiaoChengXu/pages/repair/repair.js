//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
	    array: ['请选择部件', '部件1', '部件2', '部件3'],
	    index: 0
  },
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  gorepairrecode:function(){
    wx.navigateTo({
      url: '../repair_record/repair_record',
    })
  }
})
