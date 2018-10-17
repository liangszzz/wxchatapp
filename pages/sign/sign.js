// pages/sign/sign.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum: "18888888888", //手机号码
  },

/**
 * 手机号码输入框监听
 */
  phoneInput:function(e){
    this.setData({
      phoneNum: e.detail.value
    })
  },


/**
 * 点击获取验证码
 */
  getcode:function(){
    wx.showToast({
      title: '获取输入框里的手机号码',
      icon: 'none',
      duration: 2000 //持续的时间
    })
  },

/**
 * 打开协议页面
 */
  agreement:function(){
    wx.showModal({
      title: '自动还款协议',
      content: '自动还款协议内容',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})