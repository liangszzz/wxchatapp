const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_name: "",
        idcard: "",
        reserve_phone_no: "",
        bank_card: "",
        bank_name_list: [],
        index: 0,
        //签约不显示验证码
        hiddenSmsCode: false,
        //签约不允许修改银行卡
        can_update: false,
        //验证码文字
        btnSendSmsMsg: "获取验证码",
        //验证码倒计时
        btnSendSmsTime: 60,
        can_send:true,
        has_read: false,

        //smsId 签约短信ID
        smsId: "",
        //已经签约
        has_signed: false,
        //确认按钮
        btn_verify_disabled: true,
        //短信验证码
        smsCode: "",
        biz_order_no: "",
        //0 以前的  1：借款a
        page_type:0
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        this.setData({
            biz_order_no: options.biz_order_no
        })
        if (options.page_type !=undefined){
            that.setData({
                page_type: options.page_type
            })
        }
        wx.request({
            url: app.globalData.http_url_head + 'sign/toCheckSign/' + options.biz_order_no + "/" + that.data.page_type,
            header: {
                token: app.globalData.userInfo.token
            },
            success: function(e) {
                if (e.data.code == 0) {
                    that.setData({
                        hiddenSmsCode: true,
                        can_update: true,
                        has_signed: true
                    })
                }
                that.setData({
                    user_name: e.data.dataMap.user_name,
                    idcard: e.data.dataMap.idcard,
                    reserve_phone_no: e.data.dataMap.reserve_phone_no,
                    bank_card: e.data.dataMap.bank_card,
                    index: e.data.dataMap.index,
                    bank_name_list: e.data.dataMap.bank_name_list
                })
            },
            fail: function(e) {
                console.error(e)
            }
        })
    },

    /**
     * 银行卡号输入框监听
     */
    bank_card_input: function(e) {
        this.setData({
            bank_card: e.detail.value
        })
    },
    reserve_phone_no_input: function(e) {
        this.setData({
            reserve_phone_no: e.detail.value
        })
    },
    /**
     * 选择银行
     */
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    },
    /**
     * 阅读打勾
     */
    readChenge: function(e) {
        if (e.detail.value[0] == "read") {
            this.setData({
                has_read: true
            })
        } else {
            this.setData({
                has_read: false
            })
        }
        this.btnVerifyDisabled()
    },

    btnVerifyDisabled: function() {
        if (this.data.has_signed && this.data.has_read) {
            if (this.data.hiddenSmsCode) {
                this.setData({
                    btn_verify_disabled: false
                })
            } else {
                //判断验证码
                if (this.data.smsCode.length == 6) {
                    this.setData({
                        btn_verify_disabled: false
                    })
                } else {
                    this.setData({
                        btn_verify_disabled: true
                    })
                }
            }
        } else {
            this.setData({
                btn_verify_disabled: true
            })
        }
    },
    /**
     * 点击获取验证码
     */
    getcode: function() {
        let that = this;
        if(!that.data.can_send){
            return
        }
        //校验 银行卡号,手机号
        if (that.data.bank_card.length < 16 || that.data.reserve_phone_no.length != 11) {
            wx.showToast({
                title: '请填写正确的手机号和银行卡号',
                icon: 'none',
                duration: 2000
            })
            return
        }
        that.setData({
            can_send: false
        })
        let interval = setInterval(function() {
            that.setData({
                btnSendSmsMsg: that.data.btnSendSmsTime-- + "s"
            });
            if (that.data.btnSendSmsTime <= 0) {
                that.setData({
                    btnSendSmsMsg: "获取验证码",
                    can_send: true
                });
                clearInterval(interval)
                that.setData({
                    btnSendSmsTime: 60
                })
            }
        }, 1000)
        wx.request({
            url: app.globalData.http_url_head + 'sign/signSms',
            method: "POST",
            header: {
                token: app.globalData.userInfo.token
            },
            data: {
                "payerName": that.data.user_name,
                "payerCardNo": that.data.idcard,
                "payerBankCardNo": that.data.bank_card,
                "bankMobile": that.data.reserve_phone_no
            },
            success: function(e) {
                console.log(e)
                if (e.data.code == 0) {
                    that.setData({
                        smsId: e.data.msg,
                        has_signed: true,
                        can_send: true
                    })
                    wx.showToast({
                        title: '验证码发送成功',
                        icon: 'none',
                        duration: 2000
                    })
                    that.btnVerifyDisabled()
                } else {
                    that.setData({
                        btnSendSmsTime: 0
                    })

                    wx.showToast({
                        title: e.data.msg,
                        icon: 'none',
                        duration: 2000
                    })

                    return
                }
            },
            fail: function(e) {
                console.log(e)
            }
        })

    },
    smsCodeInput: function(e) {
        this.setData({
            smsCode: e.detail.value
        })

        this.btnVerifyDisabled()
    },
    /**
     * 确认
     */
    verifyTap: function(e) {
        if (this.data.hiddenSmsCode) {
            //跳转
            wx.navigateTo({
                url: '../confirmApply/confirmApply?bizOrderNo=' + this.data.biz_order_no+"&page_type="+this.data.page_type,
            })
            return
        }
        let that = this;
        that.setData({
            btn_verify_disabled: true
        })
        wx.request({
            url: app.globalData.http_url_head + 'sign/doSign',
            method: "POST",
            header: {
                token: app.globalData.userInfo.token
            },
            data: {
                "payerName": that.data.user_name,
                "payerCardNo": that.data.idcard,
                "payerBankCardNo": that.data.bank_card,
                "bankMobile": that.data.reserve_phone_no,
                "smsId": that.data.smsId,
                "smsCode": that.data.smsCode,
                "bankIndex": that.data.index
            },
            success: function(e) {
                if (e.data.code == 0) {
                    app.globalData.userInfo = e.data.entity
                    //跳转
                    wx.navigateTo({
                        url: '../confirmApply/confirmApply?bizOrderNo=' + that.data.biz_order_no + "&page_type=" + this.data.page_type,
                    })
                } else {
                    that.setData({
                        btn_verify_disabled: false
                    })
                    wx.showToast({
                        title: "签约失败",
                        icon: 'none',
                        duration: 2000 //持续的时间
                    })
                    return
                }
            },
            fail: function(e) {
                console.log(e)
                that.setData({
                    btn_verify_disabled: false
                })
            }
        })
    },
    /**
     * 打开协议页面
     */
    agreement: function() {
        wx.navigateTo({
          url: '../agreement/agreement?type=3&biz_order_no=' + this.data.biz_order_no,
        })
    }

})