//获取应用实例
const app = getApp()

Page({
  data: {
    phone: "",
    phoneCheck: false,
    invitation_code: "",
    invitationCheck: false,
    btnRegistered: true
  },
  onLoad: function() {
    
  },
  bindPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
    if (this.data.phone.length == 11) {
      this.setData({
        phoneCheck: true
      })
    }
    else{
      this.setData({
        phoneCheck: false
      })
    }
    if (this.data.phoneCheck && this.data.invitationCheck){
      this.setData({
        btnRegistered: false
      })
    }
    else{
      this.setData({
        btnRegistered: true
      })
    }
  },
  bindInvitationInput: function(e) {
    this.setData({
      invitation_code: e.detail.value
    })
    if (this.data.invitation_code.length >0) {
      this.setData({
        invitationCheck: true
      })
    }
    else{
      this.setData({
        invitationCheck: false
      })
    }
    if (this.data.phoneCheck && this.data.invitationCheck) {
      this.setData({
        btnRegistered: false
      })
    }
    else{
      this.setData({
        btnRegistered: true
      })
    }
  },
  getUserInfo: function(e) {
    var data = e.detail.userInfo
    data.phone = this.data.phone
    data.invitation_code = this.data.invitation_code
    console.log(data)
    
    //注册
    wx.request({
      url: app.globalData.http_url_head +"login/wxRegister",
      data: data,
      method:"POST",
      success:e=>{
        console.log(e)
      },
      fail:e=>{
        console.log(e)
      }
    })

    wx.login({
      timeout: 50000,
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.errMsg=="login:ok"){
          console.log(res.code)
          wx.request({
            url: app.globalData.http_url_head + "login/wxLogin",
            data: {
              invitation_code: this.data.invitation_code,
              phone: this.data.phone,
              code: res.code
            },
            method: "POST",
            success: e => {
              console.log(e)
            },
            fail: e => {
              console.log(e)
            }
          })
        }
      },
      fail: res => {
        console.log("#登陆失败")
      }
    })
  }
})