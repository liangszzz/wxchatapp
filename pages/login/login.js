//获取应用实例
const app = getApp()

Page({
  data: {
    smsBtnContent: "点击获取验证码",
    smsBtnReadOnly: false
  },
  onLoad: function() {

  },
  getSmsCode: function(event) {
    //检查手机号
    //发送短信

    var that = this;
    //将按钮设置为不可用
    that.setData({
      smsBtnReadOnly: true,
      smsBtnContent: "60s"
    })
    var time = 60
    //按钮内容设置倒计时
    var intervalID = setInterval(function() {
      if (time <= 0) {
        console.log("###")
        that.setData({
          smsBtnReadOnly: false,
          smsBtnContent: "点击获取验证码"
        })
        clearInterval(intervalID)
        return
      }
      time--
      that.setData({
        smsBtnContent: time + "s"
      })
    }, 1000)
  }
})