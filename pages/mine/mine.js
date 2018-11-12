// pages/user/user.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    orderStatus: '',
    biz_order_no: '',
    loanAmount: ''
  },

  /**
   * 安全退出
   */
  logout: function() {
    wx.reLaunch({
      url: '../login/login',
    })
  },

  /**
   * 我的消息
   */
  toMessage: util.throttle(function(e) {
    wx.navigateTo({
      url: '../message/message',
    })
  }, 1000),

  /**
   * 我的银行卡
   */
  toBankCard: util.throttle(function(e) {
    wx.navigateTo({
      url: '../bankcard/bankcard',
    })
  }, 1000),

  /**
   * 更新日志
   */
  toUpdatelog: util.throttle(function(e) {
    wx.navigateTo({
      url: '../updatelog/updatelog',
    })
  }, 1000),

  /**
   * 我的基本资料
   */
  toUserInfo: function() {
    wx.navigateTo({
      url: '../userinfo/userinfo?biz_order_no=' + this.data.biz_order_no + '&fromType=2&orderStatus=' + this.data.orderStatus,
    })
  },

  /**
   * 我的车辆信息
   */
  toCarInfo: function() {
    wx.navigateTo({
      url: '../carinfo/carinfo?biz_order_no=' + this.data.biz_order_no + '&fromType=2&orderStatus=' + this.data.orderStatus,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.findUserInfo();
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  findUserInfo: function(){
    var that = this;
    //获取该用户最近的订单
    wx.request({
      url: app.globalData.http_url_head + 'user/getRecentOrder/' + app.globalData.userInfo.idcard,
      method: 'post',
      header: {
        token: app.globalData.userInfo.token
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          var bizOrderNo = res.data.entity.biz_order_no;
          var apply_amount = res.data.entity.apply_amount;
          var orderStatus = res.data.entity.order_status;
          that.setData({
            loanAmount: apply_amount,
            biz_order_no: bizOrderNo,
            orderStatus: orderStatus
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000 //持续的时间
          })
        }
      },
      fail: function () {
        console.log("获取后台数据失败")
      }
    })
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.findUserInfo();
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();

  }



})