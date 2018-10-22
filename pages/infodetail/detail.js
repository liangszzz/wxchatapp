// pages/infodetail/detail.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyAmount: 0,
    serviceAmount: 0,
    repaymentTerms: 0,
    repaymentList: []
  },

  /**
   * 点击确认按钮返回到上个页面 
   */
  back: function(e) {
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var orderNo = options.id;
    // if (!app.globalData.userInfo) {
    //   return;
    // }
    let token = app.globalData.userInfo.token;
    wx.request({
      url: app.globalData.http_url_head + 'bill/billDetail',
      header: {
        token:token
      },
      data: {
        orderNo : orderNo
      },
      method: "POST",
      success: result => {
        console.log(result);
        let applyAmount = 0;
        let serviceAmount = 0;
        for (let i=0; i < result.data.entity.length; i++) {
          applyAmount = applyAmount + result.data.entity[i].shouldPayPrincipal;
          serviceAmount = serviceAmount + result.data.entity[i].shouldPayService;
        }
        let repaymentTerms = result.data.entity[0].repaymentTerms;
        this.setData({
          repaymentList: result.data.entity,
          applyAmount: applyAmount,
          serviceAmount: serviceAmount,
          repaymentTerms: repaymentTerms
        });
      },
      fail: result => {
        console.log(result)
      }
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

  },

  orderDetailBtn: function () {
    wx.navigateBack({
      delta: 1
    })
  },
})