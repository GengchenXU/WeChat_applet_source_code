Page({
  data: {
    list:[],
    listGood:[],
    listMenu:[],
    fenleiHidden:false,
    paixuHidden:false,
    activeHidden:true,
    title:""
  },
  onLoad: function (options) {
    var sortId=options.sortId;
    var that=this;
    wx.request({
      url: 'http://localhost:81/mock/sort'+sortId+'.json',
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        that.setData({
          list: res.data,
          listGood:res.data
        });
      },
      fail: function (error) {
        console.log(error);
      }
    });
    wx.request({
      url: 'http://localhost:81/mock/sortMenu.json',
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        that.setData({
          listMenu: res.data[sortId-1].sonMenu,
          title:res.data[sortId-1].name
        });
      },
      fail: function (error) {
        console.log(error);
      }
    });
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title:this.data.title
    })
  },
  switchPaixu:function(event){
    var index=event.target.dataset.index;
      switch (index) {
        case "0":
          this.data.listGood.sort(function(a,b){
            if(parseInt(a.ProductSaleCount)<parseInt(b.ProductSaleCount)){
              return 1;
            }else{
              return -1;
            }
          });
          break;
        case "1":
          this.data.listGood.sort(function(a,b){
            if(parseInt(a.ProductSaleCount)>parseInt(b.ProductSaleCount)){
              return 1;
            }else{
              return -1;
            }
          });
          break;
        case "2":
          this.data.listGood.sort(function(a,b){
            if(parseInt(a.ProductSalePrice)<parseInt(b.ProductSalePrice)){
              return 1;
            }else{
              return -1;
            }
          });
          break;
        case "3":
          this.data.listGood.sort(function(a,b){
            if(parseInt(a.ProductSalePrice)>parseInt(b.ProductSalePrice)){
              return 1;
            }else{
              return -1;
            }
          });
          break;
      }
    this.setData({
      listGood: this.data.listGood,
      fenleiHidden:false,
      paixuHidden:false
    });
  },
  switchSort:function(event){
    var index=event.target.dataset.index;
    var arr=[];
    for(var i=0;i<this.data.list.length;i++){
      if(parseInt(this.data.list[i].ProductId.substring(3,4))==index){
        arr.push(this.data.list[i]);
      }
    }
    this.setData({
      listGood: arr,
      fenleiHidden:false,
      paixuHidden:false
    })
  },
  changeShow:function(event){
    var index=event.target.dataset.index;
    var that=this;
    console.log(index);
    switch(index){
      case "1":
        this.setData({
          fenleiHidden:!(that.data.fenleiHidden),
          paixuHidden:false,
          activeHidden:true
        })
        break;
      case "2":
        this.setData({
          fenleiHidden:false,
          paixuHidden:!(that.data.paixuHidden),
          activeHidden:false
        })
        break;
    }
  }

});
