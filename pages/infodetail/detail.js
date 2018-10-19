// pages/infodetail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repaymentList: [{
      qishu: 1,
      shijian: "2018-05-14",
      jine: 720.0,
      status: 1
    },
    {
      qishu: 2,
      shijian: "2018-06-14",
      jine: 720.0,
      status: 2
    },
    {
      qishu: 3,
      shijian: "2018-07-14",
      jine: 720.0,
      status: 3
    },
    {
      qishu: 4,
      shijian: "2018-07-14",
      jine: 720.0,
      status: 4
    },
    {
      qishu: 5,
      shijian: "2018-07-14",
      jine: 720.0,
      status: 5
    }
    ]

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
    console.log("详情的订单id" + orderNo);

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