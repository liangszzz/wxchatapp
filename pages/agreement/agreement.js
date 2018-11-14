var WxParse = require('../../wxParse/wxParse.js'); 
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_item:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var arrageType = options.type;
    let biz_order_no = options.biz_order_no;
    //根据不同type 1：借款合同 2：产品说明 3：自动还款协议
    wx.request({
      url: app.globalData.http_url_head + 'agreement/query/' + arrageType + '/' + biz_order_no,
      header: {
        token: app.globalData.userInfo.token
      },
      method: 'POST',
      success:function(res){
        if(res.statusCode == 200 && res.data.code == 0){
            WxParse.wxParse('content_item', 'html', res.data.msg, that, 0)        
        }
      },
      fail:function(){
        console.log("请求后台失败");
      }
    })

  },
})