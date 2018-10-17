// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgalist: ['http://img1.3lian.com/2015/w7/85/d/101.jpg',
      'http://img1.3lian.com/2015/w7/85/d/101.jpg',
      'http://img1.3lian.com/2015/w7/85/d/101.jpg'
    ]

  },

  /**
   * 查看大图
   */
  previewImage: function(e) {
    var currentId = parseInt(e.target.id);
    var currentUrl = this.data.imgalist[currentId];
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.imgalist // 需要预览的图片http链接列表
    })
  },

  /**
   * 查看借款合同
   */
  contract:function(){
    wx.showModal({
      title: '借款合同',
      content: '借款合同内容',
    })
  },

  /**
   * 查看产品说明
   */
  explain:function(){
    wx.showModal({
      title: '产品说明',
      content: '产品说明内容',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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