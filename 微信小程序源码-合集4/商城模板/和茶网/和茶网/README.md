#微信小程序项目开发——和茶网

##作者：杜少
##更多资料详情请咨询本人[博客](http://www.takozhang.cn)

小程序发布之后，网上对微信小程序的讨论也异常火爆，从发布到现在微信小程序一直占领着各种技术论坛的头条，当然各种平台也对微信小程序有新闻报道，毕竟腾讯在国内影响力还是很大的。

因为自己对小程序也是很有兴趣的，感觉是很有意思的一个东西，所以立马做了一个项目，水平有限，所以做的过程也就是一个学习的过程，一个提高的过程。

###下面的gif图是我项目的演示，代码需要在该文件夹根目录起服务，端口号为81

![](https://github.com/dushao103500/WeChat-hecha-project/tree/master/images/wechat-hecha-project.gif)
**图片若不能显示，请狠狠戳[这里](https://github.com/dushao103500/WeChat-hecha-project/blob/master/images/wechat-hecha-project.gif)**

###项目主要构建

**项目主要是通过微信小程序官方文档的知识支持，还有以下博客论坛的技术支持，由本人独立开发完成。项目主要有主页面，个人信息页面，分类页面，列表页面，详情页面，购物车页面，以及一些其他的子页面。**


#### 1、主页面 
**主页面主要包含轮播图，商品信息图，还有一些同步请求加载的数据。**

![](http://oe51jhwvd.bkt.clouddn.com/wechat-index.jpg)

####2、个人信息页面
**个人信息页面主要包含了注册登录，modal模块的隐藏与显示，以及stroage的存储**

![](http://oe51jhwvd.bkt.clouddn.com/hecha-info.jpg)
![](http://oe51jhwvd.bkt.clouddn.com/hecha-login.jpg)

####3、分类页面
**分类页面主要是展示商品的分类，如图所示，一共分为9个分类，每个分类里面又有小分类，都可以通过同步请求资源来实现。分页页面只请求一次数据，可以实现小分类的筛选，数据按销量和价格的排序。**

![](http://oe51jhwvd.bkt.clouddn.com/wechat-sortMenu.jpg)
![](http://oe51jhwvd.bkt.clouddn.com/wechat-sort.jpg)

####4、详情页面
**详情页面的数据主要靠列表页通过navigator传ID值来公国发送请求获得。**

![](http://oe51jhwvd.bkt.clouddn.com/wechatdetail.jpg)

####5、购物车页面
**购物车页面的数据由详情页加入购物车之后，将商品数据存储在stroage中，在购物车页面取出，同时也可以在购物车页面进行增删改查操作。**

![](http://oe51jhwvd.bkt.clouddn.com/hecha-shoppingCar.jpg)

####6、相关子页面
**如活动页面，茶饮机页面等等**

![](http://oe51jhwvd.bkt.clouddn.com/wechatmachine.jpg)
