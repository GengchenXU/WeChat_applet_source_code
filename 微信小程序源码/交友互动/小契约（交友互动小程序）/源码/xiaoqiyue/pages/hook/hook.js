var util = require('../../utils/util.js')
var app = getApp()
Page({
    data:{
        "weeks":[{
            "name":"一",
            "value":"1"
        },{
            "name":"二",
            "value":"2"
        },{
            "name":"三",
            "value":"3"
        },{
            "name":"四",
            "value":"4"
        },{
            "name":"五",
            "value":"5"
        },{
            "name":"六",
            "value":"6"
        },{
            "name":"日",
            "value":"0"
        }],
        "excRule": [{
            "name": "每天",
            "value": "everyDay"
        },{
            "name": "仅一次",
            "value": "onlyOnce"
        },{
            "name": "周一至周五",
            "value": "monToFri"
        },{
            "name": "周末",
            "value": "weekend"
        },{
            "name": "自定义",
            "value": "customize"
        }],
        "excRuleHidden": true,
        "excRuleIndex": 0,
        "customizeWeekHidden": true,
        "weeksColor":["","","","","","",""],
        "weeksFontColor":["","","","","","",""],
        "initDate": "",
        "initEndDate": "",
        "startDate":"",
        "endDate":"",
        "approvalPassRate":[{
            "name": "至少1人",
            "value":"leastOne"
        },{
            "name": "半数及以上",
            "value":"halfAndAbove"
        },{
            "name": "全部",
            "value":"all"
        }],
        "approvalPassRateIndex": 0,
        "passRateHelpHidden": true,
        "formMsgHidden": true,
        "formMsg":"",
        "disableHookBtn": false,
        "openHelpHidden": true
    },
    onLoad: function(){
        var now = new Date()
        var initDate = util.formatDate(now)
        var initEndDate = util.formatDate4YearMotchDay(now.getFullYear() + 1, now.getMonth() + 1, now.getDate())
        this.setData({
            initDate: initDate,
            startDate: initDate,
            endDate: initDate,
            initEndDate: initEndDate
        })
    },
	changeWeekColor: function(event){
		var num = event.target.dataset.num
        var weeksColorValue = this.data.weeksColor
        var weeksFontColorValue = this.data.weeksFontColor
        var color = weeksColorValue[num]
        var fontColor = ""
        if(color == ""){
            color = "#6495ED"
            fontColor = "white"
        } else {
            color = ""
            fontColor = ""
        }
        weeksColorValue[num] = color
        weeksFontColorValue[num] = fontColor
        this.setData({
            weeksColor: weeksColorValue,
            weeksFontColor: weeksFontColorValue
        })
	},
    changeStartDate: function(e) {
        this.setData({
            startDate: e.detail.value
        })
    },
    changeEndDate: function(e) {
        this.setData({
            endDate: e.detail.value
        })
    },
    showPassRateHelp: function(){
        this.setData({
            passRateHelpHidden: false
        })
    },
    passRateHelpConfirm: function(){
        this.setData({
            passRateHelpHidden: true
        })
    },
    showOpenHelp: function(){
        this.setData({
          openHelpHidden: false
        })
    },
    openHelpConfirm: function(){
      this.setData({
        openHelpHidden: true
      })
    },
    formSubmit: function(event){
        app.collectFormId(event.detail.formId)
        var that = this
        var data = event.detail.value;
        var passValidate = true
        var valiNum = 0;
        var formMsg = ""
        if(data.name.trim().length == 0){
            passValidate = false
            formMsg = ++valiNum + "、标题为空\n"
        }
        if(data.desc.trim().length == 0){
            passValidate = false
            formMsg += (++valiNum) + "、描述为空\n"
        }
        var excRule = data.excRule.trim()
        if(excRule.length == 0){
            passValidate = false
            formMsg += (++valiNum) + "、执行频率为空\n"
        } else {
           if(excRule == "customize" && data.excRuleValue.length == 0){
                passValidate = false
                formMsg += (++valiNum) + "、至少选择一个自定义执行星期\n"
           } 
        }
        var startDate = data.startDate
        if(startDate.trim().length == 0){
            passValidate = false
            formMsg += (++valiNum) + "、开始时间为空\n"
        }
        var endDate = data.endDate
        if(endDate.trim().length == 0){
            passValidate = false
            formMsg += (++valiNum) + "、结束时间为空\n"
        }
        if(startDate.trim().length > 0 && endDate.trim().length > 0 && util.compareDate(startDate, endDate)){
            passValidate = false
            formMsg += (++valiNum) + "、开始时间不能大于结束时间\n"
        }
        if(!passValidate){
            that.setData({
                formMsgHidden: false,
                formMsg: formMsg
            })
            return;
        }
        var approvalPassRate = that.data.approvalPassRate[that.data.approvalPassRateIndex].value
        that.setData({
          disableHookBtn: true
        })
        // 调用接口保存数据，获取id
        wx.request({
          url: app.globalData.urlHeader + '/api/v1/hook/create',
          data: {
            "name": data.name,
            "desc": data.desc,
            "excRule": data.excRule,
            "excRuleValue": data.excRuleValue,
            "startDate": Date.parse(startDate),
            "endDate": Date.parse(endDate),
            "passRate": data.passRate,
            "approvalPassRate": approvalPassRate,
            "open": data.open,
            "userKey": app.globalData.openid,
            "userName": app.globalData.userInfo.nickName,
            "userIcon": app.globalData.userInfo.avatarUrl
          },
          method: 'POST',
          success: function(res){
            if(res.statusCode == 200){
                wx.navigateTo({
                  url: '../share/share?id=' + res.data.id
                })  
            } else {
                wx.showToast({
                    title: res.data.message,
                    image: '../../images/warn.png',
                    mask: true,
                    duration: 2500
                })
            }
          },
          fail: function(res) {
            console.info(res)
          },
          complete: function(res) {
            setTimeout(function(){
              that.setData({
                disableHookBtn: false
              })
            }, 1500)
          }
        })
    },
    hiddenFromMsg: function(){
        this.setData({
            formMsgHidden: true
        })
    },
    changeApproPassRate: function(){
        var that = this
        var arr = that.data.approvalPassRate
        var arrName = new Array()
        for(var i in arr){
            arrName.push(arr[i].name)
        }
        wx.showActionSheet({
            itemList: arrName,
            itemColor: "gray",
            success: function(res) {
                that.setData({
                    approvalPassRateIndex: res.tapIndex
                })
            }
        })
    },
    changeExcRule: function(){
        this.setData({
            excRuleHidden: false
        })
    },
    confirmExcRule: function(){
        this.setData({
            excRuleHidden: true
        })
    },
    selectExcRule: function(e){
        var num = e.target.dataset.num
        this.setData({
            excRuleIndex: num
        })
        if(num == 4){
            this.setData({
                customizeWeekHidden: false
            })
        } else {
            this.setData({
                customizeWeekHidden: true
            })
        }
    }
})