// pages/confirmApply/confirmApply.js

//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bizOrderNo: '',
    applyAmount: 0,
    rate: 0,
    terms: 0,
    oldAmount: 0,
    oldTerms: 0,
    oldPayIndex: 0,
    amountChanged: false,
    termsChanged: false,
    methodChanged: false,
    check: 0,
    payIndex: 0,
    payArray: ['等额本息', '到期还本付息'],
    terms: 0,
    termRange: [3, 6, 9, 12],
    /**
     *这里的账单的数据,status以数据库中为准,到时查询的时候页面也要相应的改动
     */
    repaymentList: []
  },

  getBills: function(orderNo) {
    let token = app.globalData.userInfo.token;
    wx.request({
      url: app.globalData.http_url_head + 'bill/initBills',
      header: {
        token: token
      },
      data: {
        bizOrderNo: orderNo
      },
      method: "POST",
      success: result => {
        console.log(result);
        let applyAmount = 0;
        let rate = 0;
        let terms = 0;
        let method = 0;
        let repaymentList = [];
        let payIndex = 0;
        if (result.data.entity) {
          applyAmount = result.data.entity.applyAmount;
          rate = result.data.entity.rate * 100;
          terms = result.data.entity.terms;
          method = result.data.entity.method;
          if (method == 4) {
            payIndex = 1;
          } else {
            payIndex = 0;
          }
          repaymentList = result.data.entity.bills;
        }

        this.setData({
          bizOrderNo: orderNo,
          applyAmount: applyAmount,
          rate: rate,
          terms: terms,
          payIndex: payIndex,
          repaymentList: repaymentList,
          oldAmount: applyAmount,
          oldTerms: terms,
          oldPayIndex: payIndex,
        });

        console.log(this.data);
      },
      fail: result => {
        console.log(result)
      }

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let bizOrderNo = options.bizOrderNo;
    this.getBills(bizOrderNo);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  /**
   * 期数变化
   */
  termsChange: function(e) {
    let terms = this.data.termRange[e.detail.value];
    console.log(terms);
    let termsChanged = false;
    if (terms != this.data.oldTerms) {
      termsChanged = true;
    }
    this.setData({
      terms: terms,
      termsChanged: termsChanged
    })
  },
  /**
   * 还款方式变化
   */
  bindpayChange: function(e) {
    let payIndex = e.detail.value;
    let methodChanged = false;
    console.log(payIndex);
    if (payIndex != this.data.oldPayIndex) {
      methodChanged = true;
    }
    this.setData({
      payIndex: payIndex,
      methodChanged: methodChanged
    })
  },

  /**
   * 已阅读
   */
  reading: function(e) {
    if (e.detail.value == '') {
      this.setData({
        check: 0
      })
    } else {
      this.setData({
        check: 1
      })
    }
  },

  /**
   * 申请金额变化 
   */
  changApplyAmount: function(e) {
    let amount = e.detail.value;
    let amountChanged = false;
    if (amount != this.data.oldAmount) {
      amountChanged = true;
    }
    this.setData({
      applyAmount: amount,
      amountChanged: amountChanged
    })
  },

  /**
   * 更新并预览账单
   */
  updateBills: function() {
    let applyAmount = this.data.applyAmount;
    let method = 1;
    let terms = this.data.terms;
    let bizOrderNo = this.data.bizOrderNo;
    if (this.data.payIndex == 1) {
      method = 4
    }

    let token = app.globalData.userInfo.token;
    wx.request({
      url: app.globalData.http_url_head + 'bill/afterChangeInitBills',
      header: {
        token: token
      },
      data: {
        bizOrderNo: bizOrderNo,
        applyAmount: applyAmount,
        terms: terms,
        method: method
      },
      method: "POST",
      success: result => {
        let applyAmount = 0;
        let rate = 0;
        let terms = 0;
        let method = 0;
        let repaymentList = [];
        let payIndex = 0;
        if (result.data.entity) {
          applyAmount = result.data.entity.applyAmount;
          rate = result.data.entity.rate * 100;
          terms = result.data.entity.terms;
          method = result.data.entity.method;
          if (method == 4) {
            payIndex = 1;
          } else {
            payIndex = 0;
          }
          repaymentList = result.data.entity.bills;
        }

        this.setData({
          applyAmount: applyAmount,
          rate: rate,
          terms: terms,
          payIndex: payIndex,
          repaymentList: repaymentList,
          oldAmount: applyAmount,
          oldTerms: terms,
          oldPayIndex: payIndex,
          amountChanged: false,
          termsChanged: false,
          methodChanged: false
        });

        console.log(this.data);
      },
      fail: result => {
        console.log(result)
      }

    })
  },

  /**
   * 跳转到审核中
   */
  formSubmit: function(e) {
    if (this.data.check == 0) {
      wx.showModal({
        title: '提示',
        content: '请先阅读《借款合同》和《产品说明》',
      })
      return false;
    }
    let that = this;
    var formId = e.detail.formId;
    var openId = app.globalData.userInfo.openId;
    //保存formId
    wx.request({
      url: app.globalData.http_url_head + 'baseInfo/updateFormId',
      method: 'post',
      header: {
        token: app.globalData.userInfo.token
      },
      data: {
        formId: formId,
        openId: openId
      },
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          wx.navigateTo({
            url: '../auditLenders/auditLenders?biz_order_no=' + that.data.bizOrderNo
          })
        }
      },
      fail: function() {
        console.log("保存失败")
      }
    })
  },
})