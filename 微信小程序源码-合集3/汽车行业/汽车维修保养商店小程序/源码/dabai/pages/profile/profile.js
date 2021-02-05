const App = getApp()

Page({
	data: {
		userInfo: {},
		items: [
			{
				icon: '../../images/iconfont-order.png',
				text: '我的福利',
				path: '/pages/order/list/index'
			}, 
			{
				icon: '../../images/iconfont-addr.png',
				text: '每日签到',
				path: '/pages/address/list/index'
			}, 
			{
				icon: '../../images/iconfont-kefu.png',
				text: '我的折扣',
				path: '18521708248',
			}, 
			{
				icon: '../../images/iconfont-help.png',
				text: '我的代金券',
				path: '/pages/help/list/index',
			},
		],
		settings: [
			{
				icon: '../../images/iconfont-about.png',
				text: '关于我们',
				path: '/pages/about/index'
			}, 
		]
	},
	onLoad() {
		this.getUserInfo()
	},
	navigateTo(e) {
		const index = e.currentTarget.dataset.index
		const path = e.currentTarget.dataset.path
		App.WxService.navigateTo(path)
    },
    getUserInfo() {
    	const userInfo = App.globalData.userInfo

		if (userInfo) {
			this.setData({
				userInfo: userInfo
			})
			return
		}

		App.getUserInfo(data => {
			console.log(data)
			this.setData({
				userInfo: data
			})
		})
    },
    logout() {
    	App.WxService.showModal({
            title: '友情提示', 
            content: '确定要登出吗？', 
        })
        .then(data => data.confirm == 1 && this.signOut())
    },
    signOut() {
    	App.HttpService.signOut()
    	.then(data => {
    		console.log(data)
    		if (data.meta.code == 0) {
    			App.WxService.removeStorageSync('token')
    			App.WxService.redirectTo('/pages/login/index')
    		}
    	})
    },
})