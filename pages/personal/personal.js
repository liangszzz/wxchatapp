// pages/personal/personal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    biz_order_no: '',
    userInfo: {}, //当前用户的openid
    check: 0,
    clCarInfo: {},
    clUserInfo: {},
    imglist: [],
    carlist: [],
  },

  /**
   * 预览身份证
   */
  previewImage: function(e) {
    var currentUrl = e.target.dataset.src;
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
      url: '../agreement/agreement?type=1',
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
    var biz_order_no = this.data.biz_order_no;
    var formId = e.detail.formId;
    if (check == 0) {
      wx.showToast({
        title: '请先阅读并理解《借款合同》及《产品说明》',
        icon: "none",
        duration: 2000
      })
    } else {
      //请求后台，修改订单状态及插入formId
      wx.request({
        url: app.globalData.http_url_head + "baseInfo/update",
        header: {
          token: app.globalData.userInfo.token
        },
        data: {
          biz_order_no: biz_order_no,
          openId: openId,
          formId: formId
        },
        method: 'POST',
        success: function(res) {
          if (res.statusCode == 200 && res.data.code == 0) {
            wx.navigateTo({
              url: '../auditLenders/auditLenders?biz_order_no=' + biz_order_no,
            })
          }
        },
        fail: function() {
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
    var bizOrderNo = options.bizOrderNo;
    var carlist = that.data.carlist;
    var imglist = that.data.imglist;
    //请求后台获取相关信息
    wx.request({
      url: app.globalData.http_url_head + "baseInfo/query",
      header: {
        token: app.globalData.userInfo.token
      },
      data: {
        biz_order_no: bizOrderNo
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          var clUserInfo = res.data.dataMap.clBaseInfo.clUserInfo;
          var clCarInfo = res.data.dataMap.clBaseInfo.clCarInfo;
          var carList = res.data.dataMap.carList;
          for (var index in carList) {
            carlist[index] = carList[index].fast_dfs_path
          }
          var idCardList = res.data.dataMap.idCardList;
          for (var index in idCardList) {
            imglist[index] = idCardList[index].fast_dfs_path
          }
          that.setData({
            clCarInfo: clCarInfo,
            clUserInfo: clUserInfo,
            imglist: imglist,
            carlist: carlist,
            userInfo: app.globalData.userInfo,
            biz_order_no: bizOrderNo
          })
        }
      },
      fail: function() {
        console.log("获取后台失败！");
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

  }
})