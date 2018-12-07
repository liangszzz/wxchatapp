//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

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
    biz_order_no: '',
    channel: null // 1-wx_cl_base_info, 2-cl_base_info
  },
  onLoad: function(e) {
    if (app.globalData.userInfo && app.globalData.userInfo.token) {
      if (app.globalData.userInfo.idcard == '' || app.globalData.userInfo.idcard == null) {
        return false;
      }
      this.queryOrder(app.globalData.http_url_head + "user/orders");
    } else {
      // 登录成功回调函数
      app.loginSuccessCallBack = () => {
        if (app.globalData.userInfo.idcard == '' || app.globalData.userInfo.idcard == null){
          return false;
        }
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
        let channelType;
        if (result.data.entity.orders.length > 0) {
          order = result.data.entity.orders[0].bizOrderNo;
          channelType = result.data.entity.orders[0].channelType;
        } else {
          order = null;
        }
        this.setData({
          remainingPrincipal: result.data.entity.remainingPrincipalTotal,
          orderList: currentPageList,
          allOrders: result.data.entity.orders,
          bankName: bankName,
          bankAccount: bankAccount,
          biz_order_no: order,
          channel: channelType
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
        let bizOrderNo = orders[i].bizOrderNo;
        let channelType = orders[i].channelType;
        //判断当前订单是否已经确认
        let wxAppConfirm = orders[i].wxAppConfirm;
        if (wxAppConfirm == 1) {
          url = '../auditLenders/auditLenders?biz_order_no=' + bizOrderNo + '&page_type=0'
        } else {
          url = '../userinfo/userinfo?biz_order_no=' + bizOrderNo + "&fromType=1&channel_type="+channelType
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
    let currentTime = util.formatTime(new Date());
    let startTime = "00:00:00";
    let endTime = "06:00:00";
    if ((startTime < currentTime) && (currentTime < endTime)) {
      wx.showToast({
        title: "今日额度已用完",
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false;
    }
    let allOrders = this.data.allOrders;
    let url = '../borrowuserinfo/borrowuserinfo';
    if (allOrders.length > 0) {
      //在判断状态值
      if (allOrders[0].orderStatus == 19 || allOrders[0].orderStatus == 20) {
        var bizOrderNo = allOrders[0].bizOrderNo;
        //判断当前订单是否已经确认
        var wxAppConfirm = allOrders[0].wxAppConfirm;
        if (wxAppConfirm == 1) {
          url = '../auditLenders/auditLenders?biz_order_no=' + bizOrderNo + '&page_type=0'
        } else {
          url = '../userinfo/userinfo?biz_order_no=' + bizOrderNo + "&fromType=1&channel_type=" + this.data.channel
        }
      } else if (allOrders[0].orderStatus == 60 || allOrders[0].orderStatus == 62 || allOrders[0].orderStatus == 64) {
        return false;
      } else {
        url = url
      }
    }
    wx.navigateTo({
      url: url
    })
  }

})