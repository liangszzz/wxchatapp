// pages/personal/personal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    biz_order_no:'TEST201803081040',
    userInfo: {}, //当前用户的openid
    check: 0,
    imglist: ['/assets/images/shenfen1.jpg', '/assets/images/shenfen1.jpg'],
    carlist: ['/assets/images/baoma1.jpg', '/assets/images/baoma2.jpg', '/assets/images/baoma3.jpg', '/assets/images/baoma4.jpg', '/assets/images/baoma5.jpg', '/assets/images/baoma6.jpg'],

  },

  /**
   * 预览身份证
   */
  previewImage: function(e) {
    var currentUrl = e.target.dataset.src;
    console.log(currentUrl);
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.imglist // 需要预览的图片http链接列表
    })
  },

  /**
   * 预览车辆
   */
  previewImageCar: function(e) {
    var currentUrl = e.target.dataset.src;
    console.log(currentUrl);
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.carlist // 需要预览的图片http链接列表
    })
  },

  /**
   * 查看借款合同
   */
  contract: function() {
    wx.navigateTo({
      url:'../agreement/agreement?type=1',
    })
  },

  /**
   * 查看产品说明
   */
  explain: function() {
    wx.navigateTo({
      url: '../agreement/agreement?type=2',
    })
  },

  /**
   * 是否勾选
   */
  reading: function(e) {
    if (e.detail.value == '') {
      this.setData({
        check: 0
      })
    } else {
      this.setData({
        check: 1
      })
    }
  },

  /**
   * 提交
   */
  formSubmit: function(e) {
    var check = this.data.check;
    var openId = this.data.userInfo.openId;
    if (check == 0) {
      wx.showToast({
        title: '请先阅读并理解《借款合同》及《产品说明》',
        icon:"none",
        duration:2000
      })
    } else {
      //请求后台，修改订单状态及插入formId
     wx.request({
       url: app.globalData.http_url_head + "baseInfo/update",
       header: {
         token: app.globalData.userInfo.token
       },
       data:{
         formId: e.detail.formId,
         openId: openId,
         biz_order_no: this.data.biz_order_no
       },
       method: 'POST',
       success:function(res){
        if(res.statusCode == 200 && res.data.code== 0){
          wx.navigateTo({
            url: '../auditLenders/auditLenders',
          })
        }
       },
       fail:function(){
         console.log("获取后台失败！");
       }
     })
    }

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
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