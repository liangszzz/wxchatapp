// pages/user/user.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
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
  toMessage:util.throttle(function (e) {
    wx.navigateTo({
      url: '../message/message',
    })
  }, 1000),

  /**
   * 我的银行卡
   */
  toBankCard: util.throttle(function (e) {
    wx.navigateTo({
      url: '../bankcard/bankcard',
    })
  }, 1000),

  /**
   * 更新日志
   */
  toUpdatelog: util.throttle(function (e) {
    wx.navigateTo({
      url: '../updatelog/updatelog',
    })
  },1000),

  /**
   * 我的基本资料
   */
  toUserInfo: util.throttle(function (e) {
    wx.navigateTo({
      url: '../userinfo/userinfo?idcard=' + app.globalData.userInfo.idcard,
    })
  }, 1000),

  /**
   * 我的车辆信息
   */
  toCarInfo: util.throttle(function (e) {
    wx.navigateTo({
      url: '../carinfo/carinfo',
    })
  }, 1000),


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })  
  },

  
  
})