// pages/news/news.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    userInfo: {}, //当前用户的openid
    pageNumber: 1, //当前第几页
    pageSize: 9 //每页显示数量
  },

  /**
   * 请求后台获取数据
   */
  getList: function() {
    var that = this;
    wx.request({
      url: app.globalData.http_url_head + 'message/query',
      header: {
        token: app.globalData.userInfo.token
      },
      data: {
        open_id: that.data.userInfo.openId,
        page: that.data.pageNumber,
        size: that.data.pageSize
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          var list = res.data.data;
          var datalist = that.data.list;
          if (list.length > 0) {
            // 回调函数
            for (var i = 0; i < list.length; i++) {
              datalist.push(list[i]);
            }
            // 设置数据
            that.setData({
              list: datalist
            })
          } else {
            wx.showToast({
              title: '暂无更多数据',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        } else {
          wx.showToast({
            title: '获取消息列表失败',
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
    })
    that.getList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this;
    //当前页面设置为1，重新请求后台
    that.setData({
      pageNumber: 1,
    })

    setTimeout(function () {
      wx.request({
        url: app.globalData.http_url_head + 'message/query',
        header: {
          token: app.globalData.userInfo.token
        },
        data: {
          open_id: that.data.userInfo.openId,
          page: that.data.pageNumber,
          size: that.data.pageSize
        },
        method: 'POST',
        success: function (res) {
          if (res.statusCode == 200 && res.data.code == 0) {
            var list = res.data.data;
            // 设置数据
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
        },
        complete: function () {
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
        }
      })
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    // 页数+1
    var pageNumber = that.data.pageNumber + 1;
    that.setData({
      pageNumber: pageNumber
    })
    setTimeout(function () {
      that.getList();
      wx.hideLoading(); //隐藏加载图标
    }, 1000)
    
  },
})