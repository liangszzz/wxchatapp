// pages/news/news.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageNumber:1, //当前第几页
    pageSize:9 //每页显示数量
  },

  getList: function() {
    var that = this;
    wx.request({
      url: app.globalData.http_url_head + 'message/query',
      header: {
        token: app.globalData.userInfo.token
      },
      data: {
        phone: "13770207216",
        page: that.data.pageNumber,
        size: that.data.pageSize
      },
      method: 'POST',
      success: function (res) {
        if (res.statusCode == 200) {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.getList();

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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //当前页面设置为1，重新请求后台
    var that = this;
    that.setData({
      pageNumber:1,
    })
    that.getList();
    wx.hideNavigationBarLoading() //在标题栏中显示加载
    wx.stopPullDownRefresh(); //结束下拉刷新，页面回弹
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    var pageNumber = that.data.pageNumber + 1;
    that.setData({
      pageNumber : pageNumber
    })
    that.getList();
    wx.hideLoading();//隐藏加载图标
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})