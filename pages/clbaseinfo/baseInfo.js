//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    page: 1, //当前第几页
    limit: 7, // 每页显示数量
    hasMoreData: false, // 是否存在更多数据
    loadMore: false, //加载更多，默认false，隐藏
    orderList: [], //存放订单数据
    remainingPrincipal: 0,
    currentPage: 'single',
  },
  queryOrder(url) {
    let token = app.globalData.userInfo.token;
    let idcard = app.globalData.userInfo.idcard;
    wx.request({
      url: url,
      header: {
        token: token
      },
      data: {
        idcard: idcard
      },
      method: "POST",
      success: result => {
        console.log(result);
        this.setData({
          remainingPrincipal: result.data.entity.remainingPrincipalTotal,
          orderList: result.data.entity.orders
        });
      },
      fail: result => {
        console.log(result)
      }
    });
  },

  //事件处理函数
  detail: function(e) {
    //获取前台页面data-id存放的值
    var id = e.currentTarget.dataset.id;
    var status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: '../infodetail/detail?id=' + id + '&status=' + status,
    })
  },

  onLoad: function() {
    if (app.globalData.userInfo) {
      this.queryOrder(app.globalData.http_url_head + "user/order");
    } else {
      // 登录成功回调函数
      app.loginSuccessCallBack = () => {
        this.queryOrder(app.globalData.http_url_head + "user/order");
      }
    }
  },
  /**
   * 借款还款按钮
   */
  toPersonal(e) {
    let orders = this.data.orderList;
    let url = null;
    var bizOrderNo = e.currentTarget.dataset.id;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].orderStatus == 19) {
        url = '../personal/personal?bizOrderNo=' + bizOrderNo
        //判断当前订单是否已经确认
        wx.request({
          url: app.globalData.http_url_head + 'baseInfo/check/'+ bizOrderNo,
          header: {
            token: app.globalData.userInfo.token
          },
          method: 'post',
          success: function (res) {
            console.log(res);
            if (res.statusCode = 200 && res.data.code == 0){
              url = '../auditLenders/auditLenders?biz_order_no=' + bizOrderNo
              wx.navigateTo({
                url: url
              })
            }else{
              url = '../personal/personal?bizOrderNo=' + bizOrderNo
              wx.navigateTo({
                url: url
              })
            }
          },
          fail: function () {
            console.log("获取后台失败");
          }
        })
        
      }
    }
  },

  toSingleOrder() {
    if (this.currentPage == 'single') {
      return;
    }
    this.setData({
      currentPage: 'single'
    });
    this.queryOrder(app.globalData.http_url_head + "user/order");
  },

  toAllOrders() {
    if (this.currentPage == 'all') {
      return;
    }
    this.setData({
      currentPage: 'all'
    });
    this.queryOrder(app.globalData.http_url_head + "user/orders");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let page = this.data.currentPage;
    if (page == 'single') {
      this.queryOrder(app.globalData.http_url_head + "user/order");
    } else {
      this.queryOrder(app.globalData.http_url_head + "user/orders");
    }
    wx.stopPullDownRefresh();
  },

})