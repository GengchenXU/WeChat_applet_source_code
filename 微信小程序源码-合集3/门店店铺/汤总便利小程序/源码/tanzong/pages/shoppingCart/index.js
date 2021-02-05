//index.js
var app = getApp()
import { set_shopCart, set_shelves_info, set_unconfirmed  } from '../../utils/set.js' ;
import { shelves, shelves_product } from '../../api/index';
import { isJSON } from '../../utils/util.js';
Page({
  data: {
    goodsList: {
      saveHidden: true,
      totalPrice: 0,
      totalCount: 0,//购物车的件数
      allSelect: true,
      noSelect: false,
      list: []
    },
    delBtnWidth: 120,    //删除按钮宽度单位（rpx）
  },
  //计算购物车商品件数
  getshopNum() {
    const shopCart = this.data.goodsList.list;
    let count = 0;
    if (shopCart.length <= 0) return 0;
    shopCart.forEach((value, index, arr) => {
      count+= value.num
    })
    //console.log(count)
    return count;
    
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);  //以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  onLoad: function () {
    this.initEleWidth();
    this.onShow();
  },
  onShow: function () {
    this.getData()
  },
  getData(){
    var shopList = [];
    // 获取购物车数据
    var shopList = wx.getStorageSync('shopCart') || [];
    this.data.goodsList.list = shopList;
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), shopList, this.getshopNum());
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var index = e.currentTarget.dataset.index;

    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) {//移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        }
      }
      var list = this.data.goodsList.list;
      if (index != "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list, this.getshopNum());
      }
    }
  },
  touchE: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      var list = this.data.goodsList.list;
      if (index !== "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list, this.getshopNum());

      }
    }
  },
  delItem: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    list.splice(index, 1);
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list, this.getshopNum());
  },
  selectTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      list[parseInt(index)].active = !list[parseInt(index)].active;
      this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list, this.getshopNum());
    }
  },
  totalPrice: function () {
    var list = this.data.goodsList.list;
    var total = 0;
    for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        total += parseFloat(curItem.prices) * curItem.num;
    }
    total = parseFloat(total.toFixed(2));//js浮点计算bug，取两位小数精度
    console.log(total)
    return total;
  },
  allSelect: function () {
    var list = this.data.goodsList.list;
    var allSelect = false;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },
  noSelect: function () {
    var list = this.data.goodsList.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.active) {
        noSelect++;
      }
    }
    if (noSelect == list.length) {
      return true;
    } else {
      return false;
    }
  },
  setGoodsList: function (saveHidden, total, allSelect, noSelect, list, totalCount) {
    console.log(totalCount)
    this.setData({
      goodsList: {
        saveHidden: saveHidden,
        totalPrice: total,
        allSelect: allSelect,
        noSelect: noSelect,
        list: list,
        totalCount: totalCount
      }
    });
    set_shopCart(this.data.goodsList.list)
  },
  bindAllSelect: function () {
    var currentAllSelect = this.data.goodsList.allSelect;
    var list = this.data.goodsList.list;
    if (currentAllSelect) {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = false;
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = true;
      }
    }

    this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list, this.getshopNum());
  },
  jiaBtnTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].num < 30) {
        list[parseInt(index)].num++;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list, this.getshopNum());
      }
    }
  },
  jianBtnTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].num > 1) {
        list[parseInt(index)].num--;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list, this.getshopNum());
      }
    }
  },
  editTap: function () {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = false;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list, this.getshopNum());
  },
  saveTap: function () {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = true;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list, this.getshopNum());
  },
  getSaveHide: function () {
    var saveHidden = this.data.goodsList.saveHidden;
    return saveHidden;
  },
  deleteSelected: function () {
    var list = this.data.goodsList.list;
    /*
     for(let i = 0 ; i < list.length ; i++){
           let curItem = list[i];
           if(curItem.active){
             list.splice(i,1);
           }
     }
     */
    // above codes that remove elements in a for statement may change the length of list dynamically
    list = list.filter(function (curGoods) {
      return !curGoods.active;
    });
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list, this.getshopNum());
  },
  navigateToPayOrder: function () {
    const shopList = wx.getStorageSync('shopCart')
    set_unconfirmed(shopList)
    wx.removeStorage({
      key: 'shopCart',
     
    })
    wx.navigateTo({
      url: "/pages/shoppingCart/submitOrder"
    })
  },
  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
     //在页面隐藏的时候  将购物车的修改 存入缓存
    set_shopCart(this.data.goodsList.list)
  },
  // 控件处理程序
  controltap() {
    // 二维码控件处理
    wx.scanCode({
      success: (res) => {
        //返回是否是既定格式
        if (!res.result || !isJSON(res.result)) {
          showToast('无效的二维码')
          return;
        }
        //获得二维码上面的信息
        const info = JSON.parse(res.result)
        if (info.type == "shelves") {
          //扫描的是货架信息
          let shelves_no = info.data;
          console.log(shelves_no)
          this.getShelcesInfo(shelves_no);

        } else if (info.type == "product") {
          //扫描的是商品
          let product_no = info.data;
          this.get_shelves_product(product_no);

        }

      },
      fail: (res) => {
      }
    })
  },
  /**
  * 获得货架信息
  */
  getShelcesInfo(shelves_no) {
    const where = {
      shelves_no
    }
    shelves({ data: { where: JSON.stringify(where) } }).then((res) => {
      //缓存货架信息
      //console.log(res.data.list[0])
      if (!this.is_identical_shelves(res.data.list[0].id)){
         wx.removeStorage({
           key: 'shopCart',
           
         })
      }
      set_shelves_info(res.data.list[0]);
      this.getData()

    });


  },
  /**
   * 获得商品信息
   */
  get_shelves_product(product_no) {

    shelves_product({ data: { product_no } }).then(res => {
      console.log(this.is_identical_shelves(res.data.list[0].shelves_id))
      if (!this.is_identical_shelves(res.data.list[0].shelves_id)) {
        wx.removeStorage({
          key: 'shopCart',
        });
        wx.removeStorage({
          key: 'shelves_info',
        });
        const where = {
          id: res.data.list[0].shelves_id
        }
       
        shelves({ data: { where: JSON.stringify(where) } }).then((res1) => {
          console.log(res1)
          set_shelves_info(res1.data.list[0])
        });
        console.log(wx.getStorageSync('shopCart'),11111111)

      }
    
    
      
      //获取购物车内的商品
      const shopCart = wx.getStorageSync('shopCart') || [];
      console.log(shopCart)
      let i = shopCart.findIndex((value, index, arry) => {
        return value.id == res.data.list[0].id
      })
      if (i >= 0) {
        shopCart[i].num += 1

      } else {
        shopCart.push(Object.assign({}, res.data.list[0], { num: 1 }));
      }
      set_shopCart(shopCart);
      wx.showToast({
        title: '扫码成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          this.getData()
        }
      })
    })
  },
  //判断扫码的货架 与本地存储的货架是不是同一个货架
  is_identical_shelves(id){
    let shelves_id = wx.getStorageSync('shelves_info').id || '';
    if (id == shelves_id) return true;
    return false;
  }



})
