//获取应用实例
const app = getApp()

Page({
    data: {
        phone: "",
        phoneCheck: false,
        invitation_code: "",
        invitationCheck: false,
        btnRegistered: true,
        btnSendSms: true,
        btnSendSmsMsg: "获取验证码"
    },
    onLoad: function() {

    },
    bindPhoneInput: function(e) {
        this.setData({
            phone: e.detail.value
        })
        if (this.data.phone.length == 11) {
            this.setData({
                phoneCheck: true,
                btnSendSms: false
            })
        } else {
            this.setData({
                phoneCheck: false,
                btnSendSms: true
            })
        }
        if (this.data.phoneCheck && this.data.invitationCheck) {
            this.setData({
                btnRegistered: false
            })
        } else {
            this.setData({
                btnRegistered: true
            })
        }
    },
    bindInvitationInput: function(e) {
        this.setData({
            invitation_code: e.detail.value
        })
        if (this.data.invitation_code.length > 0) {
            this.setData({
                invitationCheck: true
            })
        } else {
            this.setData({
                invitationCheck: false
            })
        }
        if (this.data.phoneCheck && this.data.invitationCheck) {
            this.setData({
                btnRegistered: false
            })
        } else {
            this.setData({
                btnRegistered: true
            })
        }
    },
    sendSms: function(e) {
        this.setData({
            btnSendSms: true
        });
        var that = this;
        wx.request({
            url: app.globalData.http_url_head + 'login/wxSendSms/' + this.data.phone,
            success: function(e) {
                console.log("###")
                console.log(e)
                if (e.data.code == 0) {
                    let btnSendSmsMsg = 60;
                    let interval = setInterval(function() {
                        that.setData({
                            btnSendSmsMsg: btnSendSmsMsg-- + "s"
                        });
                        if (btnSendSmsMsg <= 0) {
                            that.setData({
                                btnSendSmsMsg: "获取验证码",
                                btnSendSms: false
                            });
                            clearInterval(interval)
                        }
                    }, 1000)
                }
            },
            fail: function(e) {
                wx.showModal({
                    title: '发送失败',
                    content: "发送验证码失败!",
                    showCancel: false,
                    confirmText: "确定"
                })
                that.setData({
                    btnSendSms: true
                })
            }
        })

    },
    getUserInfo: function(e) {
        var data = e.detail.userInfo
        data.phone = this.data.phone
        data.invitation_code = this.data.invitation_code

        wx.login({
            timeout: 50000,
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.errMsg == "login:ok") {
                    data.code = res.code
                    wx.request({
                        url: app.globalData.http_url_head + "login/wxRegister",
                        data: data,
                        method: "POST",
                        success: result => {
                            console.log(result)
                            if (result.statusCode == 200 && result.data.code == 0) {
                                app.globalData.userInfo = result.data.entity
                                wx.reLaunch({
                                    url: '../clbaseinfo/baseInfo',
                                    success: res => {
                                        console.log(res)
                                    },
                                    fail: res => {
                                        console.log(res)
                                    }
                                })
                            } else {
                                wx.showModal({
                                    title: '注册失败',
                                    content: "手机号或邀请码有误!",
                                    showCancel: false,
                                    confirmText: "确定"
                                })
                            }
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