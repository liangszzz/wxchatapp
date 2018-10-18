//app.js
App({
    onLaunch: function() {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)


        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台 如果没有这个用户
                            console.log("可以将 res 发送给后台解码出 unionId")
                            console.log(res)
                            wx.request({
                                url:this.globalData.http_url_head + 'login/wxLaunch',
                                method: "POST",
                                data: res,
                                success: res => {
                                    console.log(res)
                                },
                                fail: res => {

                                }
                            })

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                } else {
                    //没有授权,跳转到注册页面
                    wx.redirectTo({
                        url: '/pages/login/login',
                        success: function(res) {},
                        fail: function(res) {}
                    })
                }
            }
        })

        //检查网络状态
        wx.getNetworkType({
            success: res => {
                console.log(res)
                if (res.networkType != "wifi") {
                    console.log("###1")
                }
            },
            fail: res => {
                console.log(res)
            }
        })
        //监听网络状态
        wx.onNetworkStatusChange(function(res) {
            console.log(res)
            if (res.networkType != "wifi") {
                console.log("no wifi")
            }
        })
    },
    onShow: function(options) {
        // Do something when show.
        console.log("####show")
        console.log(options)
    },
    onHide: function() {
        // Do something when hide.
        console.log("hide")
    },
    onError: function(msg) {
        console.log(msg)
    },
    onPageNotFound: function(options) {
        console.log(options)
        wx.redirectTo({
            url: 'pages/index/index.js'
        }) // 如果是 tabbar 页面，请使用 wx.switchTab
    },
    globalData: {
        userInfo: null,
        http_url_head: "http://192.168.1.7:8080/"
    }
})