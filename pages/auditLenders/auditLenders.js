// pages/auditLenders/auditLenders.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面名称
    page_name: "审核放款中",
    //页面标题下的内容
    page_content: "",
    //借款金额
    apply_amount: "4000",
    //每期应还
    should_pay_per: "1000",
    //末期应还
    should_pay_last: "1000",
    //期数
    repayment_terms: "4",
    //提交日期
    submit_date: "2018-01-01",
    //末期还款日期
    should_pay_last_date: "2018-05-01",
    //还款方式
    repayment_method: "等额本息",
    //还款方式 值
    repayment_method_value: "1",
    //银行卡信息
    bank_info: "中国银行(尾号0011)"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    const biz_order_no = options.biz_order_no;
    const channel_type = options.channel_type;
    wx.request({
      url: app.globalData.http_url_head + "baseInfo/detail/" + biz_order_no + "/" + channel_type,
      header: {
        token: app.globalData.userInfo.token
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          that.setData({
            page_name: res.data.dataMap.page_name,
            page_content: res.data.dataMap.page_content,
            apply_amount: res.data.dataMap.apply_amount,
            should_pay_per: res.data.dataMap.should_pay_per,
            should_pay_last: res.data.dataMap.should_pay_last,
            repayment_terms: res.data.dataMap.repayment_terms,
            submit_date: res.data.dataMap.submit_date,
            should_pay_last_date: res.data.dataMap.should_pay_last_date,
            repayment_method: res.data.dataMap.repayment_method,
            repayment_method_value: res.data.dataMap.repayment_method_value,
            bank_info: res.data.dataMap.bank_info
          })
        }
      },
      fail: function() {
        console.log("后台获取信息失败！");
      }
    })

  },

  /**
   * 确认
   */
  examineBtn: function() {
    wx.reLaunch({
      url: '../clbaseinfo/baseInfo',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },


})