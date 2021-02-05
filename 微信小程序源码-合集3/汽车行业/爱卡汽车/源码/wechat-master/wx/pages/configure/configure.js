Page({
  data: {

    currentTab: "aaa",//动画导航
    checked: "",//是否勾选隐藏暂无
    checkeddif: "",//是否勾选只看不同
    fixedbox: "fixedbox",//固定定位样式控制
    markbarstate: "display:none",//是否显示头部标题
    content: "",//绑定头部标题
    carname_list: "",//车名列表
    price_list: "",//产商指导价
    mprice_list: "",//经销商指导价
    configs: "",//列表配置信息
    total: "",
    arr3: [],
    arr4: [],
    json: {},
    json2: {},
    sysheight: "",
    jtop: 0,
    myData:{}
  },
  //监听页面加载
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      myData:options
    });

    console.log(that.data.myData);
    var data = that.data.myData;


    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sysheight: res.windowHeight
        })
      }
    })

    //发送请求获取数据
    var that = this;
    wx.request({
      url:'https://mp.xcar.com.cn/series/config',
      // url: 'http://127.0.0.1/more.json',
      //url:'https://mp.xcar.com.cn/series/config?cityid=475&pserid=1431',
      data:data,
      //data: { pserid: '148', cityid: '475' },
      dataType: 'json',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json' }, // 设置请求的 header
      success: function (res) {

        if (res.data.status == 1) {

          const length = res.data.data.info.mprice.length;
          let newarr = [];
          let newarr2 = [];

          const length2 = res.data.data.configs.length;


          for (let i = 0; i < length; i++) {
            newarr.push({ carid: res.data.data.info.ids[i], mprice: res.data.data.info.mprice[i] })

          }
          for (let i = 0; i < length2; i++) {
            newarr2.push('left-group' + (i + 1));
          }

          //将每个区域距离顶部的距离存在一个数组中
          var arrtop = [];
          var top1 = 214;
          arrtop.push(top1);
          for (let i = 1; i < res.data.data.configs.length; i++) {

            that.data.jtop += res.data.data.configs[i - 1].list.length * 36;


            arrtop.push(that.data.jtop + 214)


          }
          that.setData({

            carname_list: res.data.data.info.name,
            price_list: res.data.data.info.price,
            mprice_list: newarr,
            configs: res.data.data.configs,
            total: res.data.data.configs,
            toView: newarr2,
            jtop: arrtop
          });
        }
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })

  },
  //楼层滚动定位
  scroll: function (e) {
    var that = this;
    if (e.detail.scrollTop >= 170) {
      this.setData({
        markbarstate: "display:block",
        fixedbox: "fixedbox head-fixed",
      })

      for (let i = 0; i < that.data.jtop.length; i++) {
        if ((((that.data.sysheight - 100) + e.detail.scrollTop) - that.data.jtop[i]) > that.data.sysheight / 2) {
          that.setData({
            content: that.data.configs[i].name
          })

        }
      }
    }

    else {
      this.setData({
        fixedbox: "fixedbox",
        markbarstate: "display:none"
      })
    }

  },
  //动画导航切换
  clickLetter: function (e) {
    var letter = e.target.dataset.letter;
    var that = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return;
    }
    else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    var that = this;
    that.setData({
      toView: letter,
      classname: e.currentTarget.dataset.num
    });

    this.fadeoutlist();

  },
  chagestate: function () {
    var that = this;
    var arr = [];
    var newconfig = [];
    if (this.data.checked == "") {
      for (let i = 0; i < that.data.configs.length; i++) {
        for (let j = 0; j < that.data.configs[i].list.length; j++) {
          for (let z = 0; z < that.data.configs[i].list[j].values.length; z++) {
            if (arr.indexOf(that.data.configs[i].list[j].values[z]) == -1) {
              arr.push(that.data.configs[i].list[j].values[z]);
            }

          }

          if (arr.length == 1 && arr[0] == '-') {
            that.data.configs[i].list[j]['order'] = '1';

          }
          arr.splice(0, arr.length);

        }
      }

      newconfig = that.data.configs;
      for (var i = 0; i < newconfig.length; i++) {

        that.data.json2 = { name: newconfig[i].name, list: [] }

        for (var j = 0; j < newconfig[i].list.length; j++) {

          if (newconfig[i].list[j].order == '1') {
            continue;
          }

          else {

            that.data.json2.list.push(newconfig[i].list[j]);
          }
        }

        that.data.arr4.push(that.data.json2);
      }

      that.setData({
        checked: "checked",
        configs: that.data.arr4
      })
    }
    else {
      that.setData({
        arr4: [],
        checked: "",
        configs: that.data.total,
      })
    }

  },
  chagestatedif: function () {
    var that = this;
    var arr = [];
    var newconfig = [];
    if (that.data.checkeddif == "") {

      for (let i = 0; i < that.data.configs.length; i++) {
        for (let j = 0; j < that.data.configs[i].list.length; j++) {
          for (let z = 0; z < that.data.configs[i].list[j].values.length; z++) {
            if (arr.indexOf(that.data.configs[i].list[j].values[z]) == -1) {
              arr.push(that.data.configs[i].list[j].values[z]);
            }

          }

          if (arr.length == 1) {
            that.data.configs[i].list[j]['order'] = '0'

          }


          arr.splice(0, arr.length);

        }
      }

      newconfig = that.data.configs;



      for (var i = 0; i < newconfig.length; i++) {

        that.data.json = { name: newconfig[i].name, list: [] }

        for (var j = 0; j < newconfig[i].list.length; j++) {

          if (newconfig[i].list[j].order == '0') {
          }

          else {

            that.data.json.list.push(newconfig[i].list[j]);
          }
        }

        that.data.arr3.push(that.data.json);
      }
      that.setData({
        checkeddif: "checked",
        configs: that.data.arr3
      })
    }
    else {

      this.setData({
        arr3: [],
        configs: that.data.total,
        checkeddif: "",

      })
    }

  },
  //点击左上角关闭按扭效果
  switchstate: function (e) {
    var that = this;

    that.data.carname_list.splice(e.target.dataset.currentswitch, 1);
    that.data.price_list.splice(e.target.dataset.currentswitch, 1);
    that.data.mprice_list.splice(e.target.dataset.currentswitch, 1);

    for (let i = 0; i < that.data.configs.length; i++) {
      for (let j = 0; j < that.data.configs[i].list.length; j++) {
        that.data.configs[i].list[j].values.splice(e.target.dataset.currentswitch, 1)
      }
    }

    if (that.data.carname_list.length >= 1) {
      that.setData({
        carname_list: that.data.carname_list,
        price_list: that.data.price_list,
        mprice_list: that.data.mprice_list,
        configs: that.data.configs
      })
    }
    else {

      return;
    }





  },
  findlow_price: function () {
    console.log('123');
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },



  fadeinlist: function () {


    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0',

    });
    var animation2 = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0',

    });
    this.animation = animation;
    animation.translateX(0).step();
    this.animation2 = animation2;
    animation2.opacity(0).step();
    this.setData({
      animationData: animation.export(),
      animationData2: animation2.export(),
      toggstate: "display:block",

    })

  },
  fadeoutlist: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0',

    });
    var animation2 = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 300,
      transformOrigin: '50% 50% 0',

    });
    this.animation = animation;
    this.animation2 = animation2;
    animation.translateX(-318).step();
    animation2.opacity(1).step({ delay: 300 });
    this.setData({
      animationData: animation.export(),
      animationData2: animation2.export(),
      toggstate: "display:none",
    })
  }
})