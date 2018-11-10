// pages/bankcard/bankcard.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    ishide:true,
    userInfo:{}
  },

/**
 * 请求后台数据
 */
  getList: function () {
    var that = this;
    var idCard = that.data.userInfo.idcard;
    wx.request({
      url: app.globalData.http_url_head + 'sign/queryBankCard/' + idCard,
      header: {
        token: app.globalData.userInfo.token
      },
      method: 'POST',
      success: function (res) {
        if (res.statusCode == 200) {
          var list = res.data.data;
          if (list.length < 1){
            that.setData({
              ishide: false
            })
          }else{
            that.setData({
              list: list
            })
          }
        } else {
          wx.showToast({
            title: '获取银行卡列表失败',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo 
    });
    that.getList();
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