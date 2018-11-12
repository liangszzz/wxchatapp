// pages/infodetail/detail.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: null,
    applyAmount: 0,
    serviceAmount: 0,
    repaymentTerms: 0,
    repaymentList: [],
    pageSize: 13,
    pageNo: 1,
  },

  /**
   * 点击确认按钮返回到上个页面 
   */
  back: function(e) {
    wx.navigateBack({
      delta: 1
    })
  },

  getBills: function(orderNo) {
    var url;
    let token = app.globalData.userInfo.token;
    wx.request({
      url: app.globalData.http_url_head + 'bill/billDetail',
      header: {
        token: token
      },
      data: {
        bizOrderNo: orderNo,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
      },
      method: "POST",
      success: result => {
        let applyAmount = 0;
        let serviceAmount = 0;
        if (result.data.entity) {
          for (let i = 0; i < result.data.entity.length; i++) {
            applyAmount = applyAmount + result.data.entity[i].shouldPayPrincipal;
            serviceAmount = serviceAmount + result.data.entity[i].shouldPayService;
          }
          let repaymentTerms = 0;
          if (result.data.entity.length > 0) {
            repaymentTerms = result.data.entity[0].repaymentTerms;
          }
          applyAmount = applyAmount.toFixed(2);
          this.setData({
            repaymentList: result.data.entity,
            applyAmount: applyAmount,
            serviceAmount: serviceAmount,
            repaymentTerms: repaymentTerms
          });
        }
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
    this.getBills(options.id);
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
    this.getBills(this.data.orderNo);
    wx.stopPullDownRefresh();
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

  orderDetailBtn: function() {
    wx.reLaunch({
      url: '../clbaseinfo/baseInfo',
    })
  },

})