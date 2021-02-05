import xapi from "../../utils/xapi"
export default function drawer(page){
    let root=page;
    var drawerW = root.data.winWidth * 0.8;
    Object.assign(root,{
        hideDrawer(){
            root.setData(  //mask 
                {  
                showDrawerFlag: false
                }  
            );  
            var animation = wx.createAnimation({  
                duration: 300,   
                timingFunction: "linear",  
                delay: 0 
            });  
            page.animation = animation;  

            animation.translateX(drawerW).step();  
            page.setData({  
                animationData: animation.export()  
            })
        },
        showDw(){
            
            var animation = wx.createAnimation({  
                duration: 300,   
                timingFunction: "linear",  
                delay: 0 
            });  
            root.animation = animation;  
            animation.translateX(-drawerW).step();
            root.setData(  //mask 
                { 
                    showDrawerFlag: true,
                    animationData: animation.export()
                }  
            );
        }
    })
    this.requestdata = function (data,isback) { 
        //data:请求参数
        //isback:是否有返回按钮

        root.setData({
            showBackFlag:isback
        })
        xapi.request({
            url:'https://mp.xcar.com.cn/series/brand-series',
            data:data,
            method:'GET'
        }).then(function(rs){
            var rdata = rs.data;
            //that.data.drawerSeriesData = rdata.data.list;
            console.log(rdata);
            root.setData({
                drawerSeriesData:rdata.data.list
            });

            // 界面动画，显示抽屉
            root.showDw();
        });
    };
    
}