// pages/bankcard/bankcard.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    userInfo: {}
  },

  /**
   * 请求后台数据
   */
  getList: function() {
    var that = this;
    var idCard = that.data.userInfo.idcard;
    wx.request({
      url: app.globalData.http_url_head + 'sign/queryBankCard/' + idCard,
      header: {
        token: app.globalData.userInfo.token
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          var list = res.data.data;
          if (list.length < 1) {
            wx.showToast({
              title: '暂无银行卡信息，请完成签约代扣后再试',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          } else {
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
      fail: function(e) {
        console.log("请求后台异常！")
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    });
    if (app.globalData.userInfo.idcard == null || app.globalData.userInfo.idcard == '') {
      wx.showToast({
        title: '暂无银行卡信息，请完成签约代扣后再试',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false;
    }
    that.getList();
  },

})