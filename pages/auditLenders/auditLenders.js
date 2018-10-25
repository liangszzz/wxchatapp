// pages/auditLenders/auditLenders.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseInfo: {},
    cluserInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var biz_order_no = options.biz_order_no;
    wx.request({
      url: app.globalData.http_url_head + "/baseInfo/detail",
      header: {
        token: app.globalData.userInfo.token
      },
      method: 'POST',
      data: {
        biz_order_no: biz_order_no
      },
      success: function(res) {
        console.log(res.data.entity);
        if (res.statusCode == 200 && res.data.code == 0) {
          that.setData({
            baseInfo: res.data.entity,
            cluserInfo: res.data.entity.clUserInfo
          })
        }
      },
      fail: function() {
        console.log("后台获取信息失败！");
      }
    })

  },

  /**
   * 确认
   */
  examineBtn: function() {
    wx.reLaunch({
      url: '../clbaseinfo/baseInfo',
    })
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

  }
})