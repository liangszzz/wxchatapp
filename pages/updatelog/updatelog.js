// pages/updatelog/updatelog.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.http_url_head + 'updateLog/query',
      header: {
        token: app.globalData.userInfo.token
      },
      method: 'POST',
      success: function (res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          var list = res.data.data;
          that.setData({
            list: list
          })
        } else {
          wx.showToast({
            title: '获取消息列表失败',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        }
      },
      fail: function (e) {
        console.log("请求后台异常！")
      }
    })

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