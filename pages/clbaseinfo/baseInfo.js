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
    bankName: null,
    bankAccount: null,
    lastRequestDate: null,
    allOrders: [],
    biz_order_no: ''
  },
  onLoad: function(e) {
    if (app.globalData.userInfo && app.globalData.userInfo.token) {
      this.queryOrder(app.globalData.http_url_head + "user/orders");
    } else {
      // 登录成功回调函数
      app.loginSuccessCallBack = () => {
        this.queryOrder(app.globalData.http_url_head + "user/orders");
      }
    }
  },
  queryOrder: function(url) {
    if (!app.globalData.userInfo || !app.globalData.userInfo.token) {
      return;
    }
    let token = app.globalData.userInfo.token;
    let idcard = app.globalData.userInfo.idcard;
    let bankName = app.globalData.userInfo.bankName;
    let bankAccount = app.globalData.userInfo.bankCard;
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
        var currentPageList = new Array();
        if (this.data.currentPage == 'single') {
          currentPageList[0] = result.data.entity.orders[0];
        } else {
          currentPageList = result.data.entity.orders;
        }
        let order;
        if (result.data.entity.orders.size > 0) {
          order = result.data.entity.orders[0].bizOrderNo;
        } else {
          order = null;
        }
        this.setData({
          remainingPrincipal: result.data.entity.remainingPrincipalTotal,
          orderList: currentPageList,
          allOrders: result.data.entity.orders,
          bankName: bankName,
          bankAccount: bankAccount,
          biz_order_no: order
        });
      },
      fail: result => {
        console.log(result)
      }
    });
  },

  //事件处理函数
  detail: function(e) {
    let now = new Date();
    let lastRequestDate = this.data.lastRequestDate;
    if (lastRequestDate && now - lastRequestDate < 1000) {
      return;
    }
    this.setData({
      lastRequestDate: now
    });
    //获取前台页面data-id存放的值
    var id = e.currentTarget.dataset.id;
    let orders = this.data.orderList;
    var status = e.currentTarget.dataset.status;
    var url = null;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].orderStatus == 64 || orders[i].orderStatus == 68 || orders[i].orderStatus == 72) {
        if (id == null || id == undefined) {
          id = orders[i].bizOrderNo;
        }
        url = '../clbaseinfodetail/clbaseinfodetail?id=' + id + '&status=' + status;
      }
    }
    if (url == null) {
      return;
    } else {
      wx.navigateTo({
        url: url,
      })
    }

  },
  /**
   * 借款还款按钮
   */
  toPersonal(e) {
    let now = new Date();
    let lastRequestDate = this.data.lastRequestDate;
    if (lastRequestDate && now - lastRequestDate < 1000) {
      return;
    }
    this.setData({
      lastRequestDate: now
    });
    let orders = this.data.orderList;
    let url = null;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].orderStatus == 19) {
        var bizOrderNo = orders[i].bizOrderNo;
        //判断当前订单是否已经确认
        var wxAppConfirm = orders[i].wxAppConfirm;
        if (wxAppConfirm == 1) {
          url = '../auditLenders/auditLenders?biz_order_no=' + bizOrderNo + '&page_type=0'
        } else {
          url = '../userinfo/userinfo?biz_order_no=' + bizOrderNo + "&fromType=1"
        }

      }
    }
    if (url == null) {
      return;
    } else {
      wx.navigateTo({
        url: url,
      })
    }
  },

  toSingleOrder() {
    if (this.currentPage == 'single') {
      return;
    }
    var singleOrderList = new Array();
    singleOrderList[0] = this.data.allOrders[0];
    this.setData({
      currentPage: 'single',
      orderList: singleOrderList,
    });
  },

  toAllOrders() {
    if (this.currentPage == 'all') {
      return;
    }
    this.setData({
      currentPage: 'all',
      orderList: this.data.allOrders
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let page = this.data.currentPage;
    if (page == 'single') {
      this.queryOrder(app.globalData.http_url_head + "user/orders");
    } else {
      this.queryOrder(app.globalData.http_url_head + "user/orders");
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 我要借款
   */
  toBorrow: function() {
    //先判断有无订单
    let allOrders = this.data.allOrders;
    if (allOrders.length > 0) { //有渠道单子
      //在判断状态值
      if (allOrders[0].orderStatus == 19) {
        var bizOrderNo = allOrders[0].bizOrderNo;
        //判断当前订单是否已经确认
        var wxAppConfirm = allOrders[0].wxAppConfirm;
        if (wxAppConfirm == 1) {
          wx.navigateTo({
            url: '../auditLenders/auditLenders?biz_order_no=' + bizOrderNo + '&page_type=0'
          })
        } else {
          wx.navigateTo({
            url: '../userinfo/userinfo?biz_order_no=' + bizOrderNo + "&fromType=1"
          })
        }
      }else{
        wx.navigateTo({
          url: '../borrowuserinfo/borrowuserinfo'
        })
      }
    } else {
      //查看自主进单是否已经确认
      wx.request({
        url: app.globalData.http_url_head + "borrow/isToBorrow/" + app.globalData.userInfo.openId,
        header: {
          token: app.globalData.userInfo.token
        },
        method: "POST",
        success: result => {
          let url = '';
          if (result.statusCode == 200 && result.data.code == 0) {
            url = '../borrowuserinfo/borrowuserinfo'
          } else {
            url = '../auditLenders/auditLenders?biz_order_no=' + result.data.msg + "&page_type=1"
          }
          wx.navigateTo({
            url: url
          })
        },
        fail: result => {
          console.log(result)
        }
      });
    }
  }

})