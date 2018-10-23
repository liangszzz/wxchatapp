//app.js
App({
  onLaunch: function() {
    wx.login({
      success: res => {
        wx.request({
          url: this.globalData.http_url_head + 'login/wxLogin/' + res.code,
          method: "POST",
          success: res => {
            if (res.data.code == 0) {
              this.globalData.userInfo = res.data.entity
            } else {
              wx.reLaunch({
                url: '/pages/login/login'
              })
            }
            if (this.loginSuccessCallBack) {
              this.loginSuccessCallBack();
            }
          }
        })
      },
      fail: res => {
        console.log("login fail")
        console.log(res)
      }
    })
  },

  onShow: function(options) {},
  onHide: function() {},
  onError: function(msg) {},
  onPageNotFound: function(options) {
    console.log(options)
    wx.redirectTo({
      url: 'pages/login/login'
    }) // 如果是 tabbar 页面，请使用 wx.switchTab
  },
  globalData: {
    userInfo: null,
    http_url_head: "http://192.168.1.3:8080/"
  }
})